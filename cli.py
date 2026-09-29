import os
import sys
import subprocess
from typing import Optional
import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.markdown import Markdown
from rich.syntax import Syntax
from rich.status import Status
from dotenv import load_dotenv

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Import from your existing project files
from agent_core import run_hindsight_review, run_stateless_review, hindsight, HINDSIGHT_BANK_ID
from test_diffs import PR_DIFF_PRISMA_VIOLATION, PR_DIFF_AUTH_VIOLATION

load_dotenv()

app = typer.Typer(help="⚡ PatternPulse: Architectural Code Review CLI powered by Hindsight Memory")
console = Console()


@app.command()
def review(
    scenario: Optional[str] = typer.Option(
        "prisma",
        "--scenario",
        "-s",
        help="Preset scenario: 'prisma' or 'auth', or 'git' for branch diff"
    ),
    compare: bool = typer.Option(
        True,
        "--compare/--no-compare",
        help="Show side-by-side comparison with a stateless LLM baseline"
    )
):
    """
    Run an architectural code review against Hindsight persistent memory.
    """
    console.print(Panel.fit(
        "[bold cyan]PatternPulse CLI[/bold cyan] [dim]|[/dim] [bold magenta]Hindsight Memory Engine[/bold magenta]\n"
        f"[dim]Active Memory Bank: [green]{HINDSIGHT_BANK_ID}[/green][/dim]",
        border_style="cyan"
    ))

    # 1. Select scenario diff
    if scenario == "prisma":
        diff_text = PR_DIFF_PRISMA_VIOLATION.strip()
        context_hint = "Next.js server action database query and error handling"
        title = "PR #104: Server Action Direct DB Query"
    elif scenario == "auth":
        diff_text = PR_DIFF_AUTH_VIOLATION.strip()
        context_hint = "React authentication session storage and tokens"
        title = "PR #105: Insecure JWT Storage in LocalStorage"
    elif scenario == "git":
        title = "Local Git Changes (HEAD~1)"
        context_hint = "Repository code review and architectural conventions"
        try:
            diff_text = subprocess.check_output(
                ["git", "diff", "HEAD~1"], text=True, errors="replace"
            ).strip()
        except Exception:
            diff_text = ""
        if not diff_text:
            console.print("[yellow]⚠️ No local git diff found. Defaulting to 'prisma' scenario.[/yellow]")
            diff_text = PR_DIFF_PRISMA_VIOLATION.strip()
    else:
        console.print(f"[red]Unknown scenario '{scenario}'. Use 'prisma' or 'auth'.[/red]")
        raise typer.Exit(code=1)

    # 2. Display Diff Preview
    console.print(f"\n[bold yellow]📄 Inspecting Code Diff: {title}[/bold yellow]")
    console.print(Panel(
        Syntax(diff_text[:1400], "diff", theme="monokai", line_numbers=True),
        border_style="dim"
    ))

    # 3. Query Hindsight Memory
    with Status("[bold magenta]Querying Hindsight Memory Bank (Recall)...[/bold magenta]", spinner="dots"):
        result = run_hindsight_review(diff=diff_text, file_context=context_hint)
        recalled_memories = result.get("recalled_memories", [])
        hindsight_review = result.get("review_comment", "")

    # 4. Render Recalled Memories in a Table
    mem_table = Table(
        title=f"🧠 Hindsight Recall Engine ({len(recalled_memories)} Memories Retrieved)",
        border_style="magenta"
    )
    mem_table.add_column("Type", style="cyan", width=14)
    mem_table.add_column("Recalled Architectural Rule & Source", style="white")

    for mem in recalled_memories[:4]:
        parts = mem.split("] ", 1)
        mtype = parts[0].replace("- [", "") if len(parts) > 1 else "RULE"
        mtext = parts[1] if len(parts) > 1 else mem
        mem_table.add_row(f"[{mtype}]", mtext)

    console.print(mem_table)

    # 5. Stateless Comparison
    if compare:
        with Status("[dim]Generating Stateless Baseline Review...[/dim]", spinner="dots"):
            stateless_review = run_stateless_review(diff_text)

        console.print(Panel(
            Markdown(stateless_review),
            title="[bold grey70]Standard Linter / Stateless LLM (No Memory)[/bold grey70]",
            border_style="grey50"
        ))

    # 6. Render PatternPulse Review
    is_blocking = "CHANGES REQUESTED" in hindsight_review.upper()
    verdict_style = "bold red" if is_blocking else "bold green"

    console.print(Panel(
        Markdown(hindsight_review),
        title=f"[{verdict_style}]⚡ PatternPulse Memory-Augmented Review[/{verdict_style}]",
        border_style="red" if is_blocking else "green"
    ))

    if is_blocking:
        console.print("[bold red]❌ BLOCKED:[/bold red] Architectural violations detected against historical team memory.\n")
    else:
        console.print("[bold green]✅ APPROVED:[/bold green] All team conventions satisfied.\n")


@app.command()
def learn(
    rule: str = typer.Argument(..., help="The architectural convention or RFC rule to remember"),
    author: str = typer.Option("Tech Lead", "--author", "-a", help="Author of the rule"),
    category: str = typer.Option("architecture", "--category", "-c", help="Category: security, architecture, performance, logging")
):
    """
    Teach PatternPulse a new architectural rule or post-mortem in real-time.
    """
    with Status(f"[bold green]Retaining convention into Hindsight bank...[/bold green]", spinner="dots"):
        content = f"Architecture RFC by {author}: {rule}"
        doc_id = f"cli-rule-{os.urandom(3).hex()}"
        hindsight.retain(
            bank_id=HINDSIGHT_BANK_ID,
            content=content,
            context=category,
            document_id=doc_id
        )

    console.print(Panel.fit(
        f"[bold green]✓ Successfully Retained into Bank:[/bold green] [cyan]{HINDSIGHT_BANK_ID}[/cyan]\n\n"
        f"[bold]Author:[/bold] {author}\n"
        f"[bold]Category:[/bold] {category}\n"
        f"[bold]Rule:[/bold] {rule}\n"
        f"[dim]Document ID: {doc_id}[/dim]",
        border_style="green"
    ))


@app.command()
def status():
    """
    Check the connection and health of your Hindsight memory bank.
    """
    console.print(f"[bold cyan]Connecting to Hindsight Bank:[/bold cyan] {HINDSIGHT_BANK_ID}...")
    try:
        try:
            recall = hindsight.recall(bank_id=HINDSIGHT_BANK_ID, query="architecture standards", budget="low")
        except Exception:
            recall = hindsight.recall(bank_id=HINDSIGHT_BANK_ID, query="architecture standards", types=["world"], budget="low")
        count = len(getattr(recall, "results", []))
        console.print(f"[bold green]✓ Online & Active[/bold green] - Retained Memory Entries: [bold yellow]{count}[/bold yellow]")
    except Exception as e:
        console.print(f"[bold red]✗ Connection Error:[/bold red] {e}")


if __name__ == "__main__":
    app()
