import os
import sys
import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from agent_core import run_stateless_review, run_hindsight_review, hindsight, HINDSIGHT_BANK_ID
from test_diffs import PR_DIFF_PRISMA_VIOLATION, PR_DIFF_AUTH_VIOLATION

load_dotenv()

app = FastAPI(title="PatternPulse - Architectural Memory Code Reviewer")

# Mount static files
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

class ReviewRequest(BaseModel):
    diff: str
    file_context: str
    mode: str = "both"  # "stateless", "hindsight", or "both"

class RetainRequest(BaseModel):
    rule: str
    context: str
    author: str

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(content=b"", media_type="image/x-icon")

@app.post("/api/review")
def review_pr(payload: ReviewRequest):
    result = {}
    if payload.mode in ["stateless", "both"]:
        result["stateless"] = run_stateless_review(payload.diff)
    if payload.mode in ["hindsight", "both"]:
        mem_res = run_hindsight_review(payload.diff, payload.file_context)
        result["hindsight"] = mem_res["review_comment"]
        result["recalled_memories"] = mem_res["recalled_memories"]
    return JSONResponse(content=result)

@app.post("/api/retain")
def retain_rule(payload: RetainRequest):
    content = f"Architecture RFC by {payload.author}: {payload.rule}"
    doc_id = f"custom-rule-{os.urandom(3).hex()}"
    hindsight.retain(
        bank_id=HINDSIGHT_BANK_ID,
        content=content,
        context=payload.context,
        document_id=doc_id
    )
    return JSONResponse(content={"status": "success", "document_id": doc_id, "retained": content})

@app.get("/api/presets")
async def get_presets():
    return {
        "prisma": {
            "title": "PR #104: Server Action Direct DB Query",
            "context": "Next.js server action database query and error handling",
            "diff": PR_DIFF_PRISMA_VIOLATION.strip()
        },
        "auth": {
            "title": "PR #105: JWT Stored in LocalStorage",
            "context": "React authentication session storage and tokens",
            "diff": PR_DIFF_AUTH_VIOLATION.strip()
        }
    }

@app.get("/", response_class=HTMLResponse)
async def serve_dashboard():
    return """
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PatternPulse | Persistent Memory Code Reviewer</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    pre, code, .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-[#040711] text-slate-100 min-h-screen">
  <div id="root"></div>
  <script src="/static/bundle.js"></script>
</body>
</html>
    """

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
