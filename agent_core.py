import os
import sys
import json
from dotenv import load_dotenv
from groq import Groq
from hindsight_client import Hindsight

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


load_dotenv()

HINDSIGHT_API_KEY = os.getenv("HINDSIGHT_API_KEY")
HINDSIGHT_BANK_ID = os.getenv("HINDSIGHT_BANK_ID", "team-repo-standards")
HINDSIGHT_BASE_URL = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize SDKs
hindsight = Hindsight(base_url=HINDSIGHT_BASE_URL, api_key=HINDSIGHT_API_KEY)
groq = Groq(api_key=GROQ_API_KEY)

MODEL_NAME = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")  # or "qwen/qwen3-32b"

def _chat_completion(messages, temperature=0.2):
    """Execute Groq chat completion with fallback to verified active models."""
    candidate_models = [MODEL_NAME, "openai/gpt-oss-120b", "qwen/qwen3.8-27b"]
    for m in candidate_models:
        try:
            return groq.chat.completions.create(
                model=m,
                messages=messages,
                temperature=temperature,
            )
        except Exception as e:
            if "model_not_found" in str(e) or "404" in str(e):
                continue
            raise

def run_stateless_review(diff: str) -> str:
    """Standard generic code review without access to repository memory."""
    prompt = f"""
You are an automated GitHub PR Code Reviewer.
Review the following Git pull request diff. Look for syntax errors, typing issues, or standard JavaScript/TypeScript bugs.

DIFF:
{diff}

Provide a concise markdown review with your verdict (APPROVE or REQUEST CHANGES).
"""
    response = _chat_completion(
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    return response.choices[0].message.content


def run_hindsight_review(diff: str, file_context: str) -> dict:
    """
    Context-aware code review powered by Hindsight persistent memory.
    1. Recalls relevant architectural decisions and past team reviews.
    2. Formats team conventions as grounded context.
    3. Evaluates the diff against those specific team standards.
    """
    # 1. Recall from Hindsight
    query = f"Code conventions, database policies, error logging, and security standards for: {file_context}"
    recalled_rules = []
    try:
        try:
            recall_response = hindsight.recall(
                bank_id=HINDSIGHT_BANK_ID,
                query=query,
                types=["world"],
                budget="mid"
            )
        except Exception:
            recall_response = hindsight.recall(
                bank_id=HINDSIGHT_BANK_ID,
                query=query,
                budget="mid"
            )
        if hasattr(recall_response, "results") and recall_response.results:
            for r in recall_response.results:
                recalled_rules.append(f"- [{r.type.upper()}] {r.text}")
    except Exception as e:
        pass
    
    recalled_context_str = "\n".join(recalled_rules) if recalled_rules else "No prior team conventions found."

    # 2. Synthesize using Groq
    system_prompt = """
You are PatternPulse, an elite Senior Engineering Lead performing an architectural Pull Request review.
You have access to the repository's team memory (past PR debates, architectural decisions, and security conventions).

Your job is NOT merely to act as a syntax linter. You must enforce the team's historical architectural decisions.
If incoming code violates a remembered standard:
1. Issue a BLOCKING change request.
2. Specifically cite the historical rule, context, and rationale from memory.
3. Provide the corrected code matching the team's pattern.
"""

    user_prompt = f"""
=== INCOMING PR DIFF ===
{diff}

=== RECALLED TEAM MEMORY & ARCHITECTURAL CONVENTIONS (FROM HINDSIGHT) ===
{recalled_context_str}

=== INSTRUCTIONS ===
Evaluate the diff against the recalled conventions above.
Provide a clear, structured review:
- Verdict: [CHANGES REQUESTED | APPROVED]
- Architectural Violations (cite exact memories and explain why it violates repo standards)
- Required Fix (with code snippet)
"""

    response = _chat_completion(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.1,
    )

    return {
        "recalled_memories": recalled_rules,
        "review_comment": response.choices[0].message.content
    }


if __name__ == "__main__":
    from test_diffs import PR_DIFF_PRISMA_VIOLATION
    
    print("==================================================")
    print("RUNNING STATELESS REVIEW (WITHOUT MEMORY)...")
    print("==================================================")
    stateless_result = run_stateless_review(PR_DIFF_PRISMA_VIOLATION)
    print(stateless_result)
    
    print("\n==================================================")
    print("RUNNING HINDSIGHT REVIEW (WITH RECALLED CONVENTIONS)...")
    print("==================================================")
    memory_result = run_hindsight_review(
        diff=PR_DIFF_PRISMA_VIOLATION,
        file_context="Next.js server action database query and error handling"
    )
    
    print("\n[RECALLED TEAM STANDARDS FROM HINDSIGHT]:")
    for mem in memory_result["recalled_memories"][:3]:
        print(f"  {mem}")
        
    print("\n[PATTERN-PULSE AGENT REVIEW]:")
    print(memory_result["review_comment"])
