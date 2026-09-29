import os
import time
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

HINDSIGHT_API_KEY = os.getenv("HINDSIGHT_API_KEY")
HINDSIGHT_BANK_ID = os.getenv("HINDSIGHT_BANK_ID", "team-repo-standards")
HINDSIGHT_BASE_URL = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")

client = Hindsight(
    base_url=HINDSIGHT_BASE_URL,
    api_key=HINDSIGHT_API_KEY
)

PAST_CONVENTIONS = [
    {
        "content": (
            "PR #42 Review by TechLead (Alex): Direct Prisma calls inside Next.js Server Actions "
            "or API route handlers are strictly prohibited. All database queries must route through "
            "the service layer in `lib/services/*` to guarantee multi-tenant tenant_id isolation."
        ),
        "context": "database_architecture_and_security",
        "document_id": "pr-42-review"
    },
    {
        "content": (
            "PR #19 Security Review by SecOps (Sarah): Do not store JWT access tokens or sensitive auth state "
            "in browser localStorage or sessionStorage due to XSS vulnerability. Tokens must always be set as "
            "HTTP-only, Secure cookies with SameSite=Strict."
        ),
        "context": "authentication_and_storage_policy",
        "document_id": "pr-19-review"
    },
    {
        "content": (
            "PR #58 Post-Mortem by Senior Dev (Marcus): Raw `console.error` statements on database failures are forbidden. "
            "All Postgres and Supabase queries must catch specific PostgrestError exceptions and route through our "
            "structured logger `logger.error({ code, error, context })` so alerts reach Datadog."
        ),
        "context": "logging_and_error_handling",
        "document_id": "pr-58-review"
    },
    {
        "content": (
            "PR #77 Architecture RFC by Frontend Lead (Elena): Heavy data mapping, filtering, or array chaining "
            "(.map, .filter, .reduce) on datasets larger than 100 items must never be executed directly inside React component bodies. "
            "Always wrap in `useMemo` or delegate aggregation to SQL queries on the backend."
        ),
        "context": "frontend_performance_standards",
        "document_id": "pr-77-review"
    }
]

def seed_team_memories():
    print(f"Connecting to Hindsight Bank: [{HINDSIGHT_BANK_ID}]...")
    
    # 1. Optionally initialize bank if not already present
    try:
        client.create_bank(
            bank_id=HINDSIGHT_BANK_ID,
            name="Repo Architecture Memory",
            mission="Track repo-specific architectural conventions, code review decisions, and engineering preferences."
        )
        print(f"Bank '{HINDSIGHT_BANK_ID}' created.")
    except Exception:
        print(f"Bank '{HINDSIGHT_BANK_ID}' already exists or ready.")

    # 2. Retain each convention
    print("\nRetaining past PR conventions into Hindsight...")
    for item in PAST_CONVENTIONS:
        print(f"-> Retaining: {item['document_id']}...")
        client.retain(
            bank_id=HINDSIGHT_BANK_ID,
            content=item["content"],
            context=item["context"],
            document_id=item["document_id"]
        )
        time.sleep(0.5)

    print("\nAll conventions retained successfully!")

    # 3. Test immediate recall to verify knowledge ingestion
    print("\nVerifying memory retention with a test recall query...")
    test_query = "Can we query the database directly in a Next.js action?"
    response = client.recall(bank_id=HINDSIGHT_BANK_ID, query=test_query)

    print(f"Recall test query: '{test_query}'")
    print(f"Memories found: {len(response.results)}")
    for r in response.results:
        print(f"- [{r.type}] {r.text}")

if __name__ == "__main__":
    seed_team_memories()
