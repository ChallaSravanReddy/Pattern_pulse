import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Cpu,
  Brain,
  GitCommit,
  GitPullRequest,
  Workflow,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  ShieldAlert,
  Code,
  Sliders,
  ExternalLink,
  X
} from 'lucide-react';

export default function CliDocsModal({ isOpen, onClose, onCopyToast }) {
  const [activeTab, setActiveTab] = useState('quickstart'); // 'quickstart' | 'generator' | 'architecture' | 'hooks'
  const [shellType, setShellType] = useState('ps'); // 'ps' (PowerShell) | 'bash' (Unix/Mac) | 'cmd' (Windows Batch)
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  // Interactive Generator State
  const [genAction, setGenAction] = useState('review'); // 'review' | 'learn' | 'status'
  const [genScenario, setGenScenario] = useState('prisma'); // 'prisma' | 'auth' | 'git'
  const [genCompare, setGenCompare] = useState(true);
  const [genRule, setGenRule] = useState("All Redis cache keys must follow 'cache:v1:{entity}:{id}'");
  const [genAuthor, setGenAuthor] = useState("Cache Team");
  const [genCategory, setGenCategory] = useState("performance"); // 'architecture' | 'security' | 'performance' | 'logging'
  const [genCopied, setGenCopied] = useState(false);

  // Accordion State for Git Hooks
  const [openAccordion, setOpenAccordion] = useState('pre-push'); // 'pre-push' | 'github-actions' | 'pre-commit'

  // Expanded output previews in Quickstart
  const [expandedOutput, setExpandedOutput] = useState({});

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text, id, toastMsg = 'Command copied to clipboard!') => {
    navigator.clipboard.writeText(text);
    if (id === 'generator') {
      setGenCopied(true);
      setTimeout(() => setGenCopied(false), 2000);
    } else {
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
    if (onCopyToast) onCopyToast(toastMsg);
  };

  const getPrefix = (shell) => {
    if (shell === 'ps') return '.\\patternpulse.ps1';
    if (shell === 'cmd') return 'patternpulse.bat';
    return 'python cli.py';
  };

  const quickstartCards = [
    {
      id: 'qs-status',
      title: '1. Check Bank Status & Health',
      badge: 'HEALTH & SYNC',
      badgeColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-800',
      command: (shell) => `${getPrefix(shell)} status`,
      caption: "Verify connection to Hindsight memory bank 'team-repo-standards' and fetch active memory count.",
      outputSnippet: `Connecting to Hindsight Bank: team-repo-standards...
✓ Online & Active - Retained Memory Entries: 20`
    },
    {
      id: 'qs-prisma',
      title: '2. Scenario 1: Prisma & Multi-Tenant Violation',
      badge: 'ARCHITECTURE',
      badgeColor: 'text-rose-400 bg-rose-950/70 border-rose-800',
      command: (shell) => `${getPrefix(shell)} review --scenario prisma`,
      caption: 'Evaluates a Next.js Server Action against PR #42 conventions (Alex) and PR #58 logging rules (Marcus).',
      outputSnippet: `🧠 Hindsight Recall Engine (3 Memories Retrieved)
[- DIRECTIVE] PR #42 Review (Alex): Direct Prisma calls inside Next.js Server Actions prohibited...
[- WORLD] PR #58 Post-Mortem (Marcus): Raw console.error forbidden...
❌ BLOCKED: Architectural violations detected against historical team memory.`
    },
    {
      id: 'qs-auth',
      title: '3. Scenario 2: JWT Auth & Storage Insecurity',
      badge: 'SECURITY',
      badgeColor: 'text-amber-400 bg-amber-950/70 border-amber-800',
      command: (shell) => `${getPrefix(shell)} review --scenario auth`,
      caption: 'Catches raw JWT tokens stored in localStorage vs. HTTP-only cookies (Sarah - SecOps).',
      outputSnippet: `🧠 Hindsight Recall Engine (2 Memories Retrieved)
[- DIRECTIVE] PR #19 Security Review (Sarah): Do not store JWT in localStorage...
❌ BLOCKED: Insecure authentication token storage detected.`
    },
    {
      id: 'qs-git',
      title: '4. Review Local Git Changes (Pre-Commit / Pre-Push)',
      badge: 'LOCAL GIT HOOK',
      badgeColor: 'text-indigo-400 bg-indigo-950/70 border-indigo-800',
      command: (shell) => `${getPrefix(shell)} review --scenario git`,
      caption: 'Runs git diff HEAD~1 on your active branch and blocks push if architectural rules are broken.',
      outputSnippet: `📄 Inspecting Code Diff: Local Git Changes (HEAD~1)
Querying Hindsight Memory Bank (Recall)...
⚡ PatternPulse Memory-Augmented Review:
✅ APPROVED: All team conventions satisfied.`
    },
    {
      id: 'qs-learn',
      title: '5. Teach Agent in Real-Time (Continuous Learning)',
      badge: 'MEMORY RETENTION',
      badgeColor: 'text-purple-400 bg-purple-950/70 border-purple-800',
      command: (shell) => `${getPrefix(shell)} learn "All Redis cache keys must follow 'cache:v1:{entity}:{id}'" --author "Cache Team" --category "performance"`,
      caption: 'Calls hindsight.retain() instantly without restarting servers or re-deploying.',
      outputSnippet: `Retaining convention into Hindsight bank...
✓ Successfully Retained into Bank: team-repo-standards
Author: Cache Team | Category: performance | Rule: All Redis cache keys...
Document ID: cli-rule-526811`
    }
  ];

  // Build the generated command
  const buildGeneratedCommand = () => {
    const prefix = getPrefix(shellType);
    if (genAction === 'status') {
      return `${prefix} status`;
    }
    if (genAction === 'review') {
      const compareFlag = genCompare ? '--compare' : '--no-compare';
      return `${prefix} review --scenario ${genScenario} ${compareFlag}`;
    }
    if (genAction === 'learn') {
      const escapedRule = `"${genRule.replace(/"/g, '\\"')}"`;
      return `${prefix} learn ${escapedRule} --author "${genAuthor}" --category "${genCategory}"`;
    }
    return `${prefix} status`;
  };

  const generatedCommand = buildGeneratedCommand();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-4xl bg-[#0c1017]/95 border-l border-slate-800 backdrop-blur-2xl shadow-2xl shadow-indigo-950/50 flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="border-b border-slate-800/80 px-6 py-4 bg-[#101520]/90 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-indigo-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>PatternPulse CLI</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    v1.0.0
                  </span>
                </h2>
                <span className="hidden sm:inline-block text-xs font-mono text-slate-500">|</span>
                <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Bank: <span className="text-emerald-400 font-semibold">team-repo-standards</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Terminal-first architectural code review powered by Hindsight Memory
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
              title="Close Drawer (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Shell Flavor Selector & Tab Bar */}
        <div className="border-b border-slate-800 bg-[#0e131d] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('quickstart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                activeTab === 'quickstart'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Play className="w-3 h-3 text-indigo-300" />
              <span>1-Min Quickstart</span>
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                activeTab === 'generator'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-3 h-3 text-indigo-300" />
              <span>Command Generator</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                activeTab === 'architecture'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3 h-3 text-indigo-300" />
              <span>Engine Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('hooks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                activeTab === 'hooks'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GitCommit className="w-3 h-3 text-indigo-300" />
              <span>Git Hooks & CI/CD</span>
            </button>
          </div>

          {/* Shell Selector Pill */}
          <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700/80 rounded-lg p-1 text-xs">
            <span className="text-[11px] font-mono text-slate-500 pl-1.5 pr-0.5 hidden sm:inline">Shell:</span>
            <button
              onClick={() => setShellType('ps')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                shellType === 'ps'
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PowerShell
            </button>
            <button
              onClick={() => setShellType('bash')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                shellType === 'bash'
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bash / Mac
            </button>
            <button
              onClick={() => setShellType('cmd')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                shellType === 'cmd'
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CMD (.bat)
            </button>
          </div>
        </div>

        {/* Drawer Body - Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* TAB 1: ONE-MINUTE QUICKSTART */}
          {activeTab === 'quickstart' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/40 border border-indigo-800/40 rounded-xl p-4 flex items-start space-x-3.5">
                <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <h4 className="font-semibold text-indigo-200 text-sm">Developer-First Terminal Integration</h4>
                  <p className="text-slate-400 leading-relaxed">
                    PatternPulse operates as a native standalone CLI alongside the web dashboard. Run pre-commit checks, verify branch changes, or enforce team architecture RFCs right from your IDE terminal with zero context-switching.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {quickstartCards.map((card, idx) => {
                  const cmdText = card.command(shellType);
                  const isCopied = copiedIndex === card.id;
                  const isOutputOpen = !!expandedOutput[card.id];

                  return (
                    <div
                      key={card.id}
                      className="bg-[#111724] border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700 group shadow-md"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-slate-100">{card.title}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                            {card.badge}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                        {card.caption}
                      </p>

                      {/* Code Block with Copy Button */}
                      <div className="relative bg-[#080b11] border border-slate-800/90 rounded-lg p-3 font-mono text-xs text-slate-200 flex items-center justify-between group-hover:border-slate-700 transition">
                        <div className="flex items-center space-x-2 overflow-x-auto pr-16 scrollbar-none">
                          <span className="text-slate-500 select-none">
                            {shellType === 'ps' ? 'PS>' : shellType === 'cmd' ? 'C:\\>' : '$'}
                          </span>
                          <span className="text-emerald-400 font-medium whitespace-nowrap">{cmdText}</span>
                        </div>

                        <button
                          onClick={() => copyToClipboard(cmdText, card.id, `Copied command: ${card.title}`)}
                          className={`absolute right-2 px-2.5 py-1.5 rounded-md text-xs font-sans font-medium flex items-center space-x-1.5 transition ${
                            isCopied
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Output Preview Accordion */}
                      <div className="mt-2.5">
                        <button
                          onClick={() =>
                            setExpandedOutput((prev) => ({
                              ...prev,
                              [card.id]: !prev[card.id]
                            }))
                          }
                          className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                        >
                          <span>{isOutputOpen ? '▼ Hide Expected Terminal Output' : '▶ Peek Expected Terminal Output'}</span>
                        </button>

                        {isOutputOpen && (
                          <div className="mt-2 bg-[#06080d] border border-slate-800/80 rounded-lg p-3 font-mono text-[11px] text-slate-400 whitespace-pre-wrap leading-relaxed animate-in fade-in">
                            <span className="text-slate-600 block mb-1 font-sans text-[10px] uppercase tracking-wider">Simulated Output:</span>
                            {card.outputSnippet}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE COMMAND GENERATOR */}
          {activeTab === 'generator' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-[#111724] border border-slate-800 rounded-xl p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>Visual Command Generator</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select your target task, flags, and options to construct a ready-to-run CLI invocation.
                  </p>
                </div>

                {/* Step 1: Action Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    1. Select CLI Action
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      onClick={() => setGenAction('review')}
                      className={`p-3 rounded-xl border text-left flex flex-col space-y-1 transition ${
                        genAction === 'review'
                          ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-950'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <GitPullRequest className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-slate-100">Review Code</span>
                      </div>
                      <span className="text-[11px] text-slate-400">Run memory-grounded PR evaluation</span>
                    </button>

                    <button
                      onClick={() => setGenAction('learn')}
                      className={`p-3 rounded-xl border text-left flex flex-col space-y-1 transition ${
                        genAction === 'learn'
                          ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-950'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-slate-100">Teach New Rule</span>
                      </div>
                      <span className="text-[11px] text-slate-400">Retain convention into Hindsight</span>
                    </button>

                    <button
                      onClick={() => setGenAction('status')}
                      className={`p-3 rounded-xl border text-left flex flex-col space-y-1 transition ${
                        genAction === 'status'
                          ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-950'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-slate-100">Check Health</span>
                      </div>
                      <span className="text-[11px] text-slate-400">Ping bank & verify memory count</span>
                    </button>
                  </div>
                </div>

                {/* Step 2: Dynamic Sub-options */}
                {genAction === 'review' && (
                  <div className="space-y-4 pt-2 border-t border-slate-800">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      2. Review Configuration
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Scenario Target */}
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5 font-medium">Scenario / Diff Target</label>
                        <select
                          value={genScenario}
                          onChange={(e) => setGenScenario(e.target.value)}
                          className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                        >
                          <option value="prisma">--scenario prisma (PR #104: Server Action DB Leak)</option>
                          <option value="auth">--scenario auth (PR #105: LocalStorage JWT Insecurity)</option>
                          <option value="git">--scenario git (Local Uncommitted Changes HEAD~1)</option>
                        </select>
                      </div>

                      {/* Compare Switch */}
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5 font-medium">Stateless Baseline Comparison</label>
                        <div className="flex items-center space-x-3 bg-[#0a0d14] border border-slate-700 rounded-lg px-3 py-2">
                          <input
                            type="checkbox"
                            id="compareToggle"
                            checked={genCompare}
                            onChange={(e) => setGenCompare(e.target.checked)}
                            className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                          />
                          <label htmlFor="compareToggle" className="text-xs text-slate-200 cursor-pointer select-none">
                            {genCompare ? (
                              <span className="text-indigo-300 font-semibold">Enabled (--compare)</span>
                            ) : (
                              <span className="text-slate-400">Disabled (--no-compare)</span>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {genAction === 'learn' && (
                  <div className="space-y-4 pt-2 border-t border-slate-800">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      2. New Architectural Convention Details
                    </label>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Architectural Rule or RFC Description</label>
                        <input
                          type="text"
                          value={genRule}
                          onChange={(e) => setGenRule(e.target.value)}
                          className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                          placeholder="e.g. All Redis keys must include tenant prefix..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Author / RFC Sponsor</label>
                          <input
                            type="text"
                            value={genAuthor}
                            onChange={(e) => setGenAuthor(e.target.value)}
                            className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Category</label>
                          <select
                            value={genCategory}
                            onChange={(e) => setGenCategory(e.target.value)}
                            className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                          >
                            <option value="architecture">architecture</option>
                            <option value="security">security</option>
                            <option value="performance">performance</option>
                            <option value="logging">logging</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {genAction === 'status' && (
                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
                    <p>
                      The <span className="font-mono text-emerald-400">status</span> command tests the live connection to your Hindsight vector memory bank, verifies authentication credentials in <span className="font-mono text-slate-300">.env</span>, and outputs the active count of indexed conventions.
                    </p>
                  </div>
                )}
              </div>

              {/* Dynamic Terminal Preview Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono font-medium flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    Live Terminal Preview
                  </span>
                  <span className="text-[11px] text-slate-500">Auto-generated for {shellType.toUpperCase()}</span>
                </div>

                <div className="bg-[#06080d] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                  {/* Terminal Header */}
                  <div className="bg-[#0f141f] px-4 py-2 border-b border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                      <span className="text-[11px] font-mono text-slate-400 ml-2">Terminal — PatternPulse CLI</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">utf-8</span>
                  </div>

                  {/* Terminal Body */}
                  <div className="p-4 font-mono text-xs text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 overflow-x-auto">
                      <span className="text-slate-500 select-none">
                        {shellType === 'ps' ? 'PS>' : shellType === 'cmd' ? 'C:\\>' : '$'}
                      </span>
                      <span className="text-emerald-400 font-semibold">{generatedCommand}</span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(generatedCommand, 'generator', 'Generated command copied!')}
                      className={`px-4 py-2 rounded-lg text-xs font-sans font-bold flex items-center justify-center space-x-1.5 transition shrink-0 ${
                        genCopied
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                          : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30'
                      }`}
                    >
                      {genCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Command</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOW THE CLI ENGINE OPERATES */}
          {activeTab === 'architecture' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-[#111724] border border-slate-800 rounded-xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-indigo-400" />
                    <span>How the CLI Engine Operates</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Unlike standard static analysis linters that only inspect grammar, PatternPulse connects directly to the repository's historical memory bank to prevent recurring tech debt.
                  </p>
                </div>

                {/* 5-Step Pipeline Stepper */}
                <div className="relative pl-6 space-y-6 border-l-2 border-indigo-900/60 ml-3 py-1">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                      1
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>Diff Ingestion & Syntax Highlighting</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded">
                          git diff | Rich Monokai
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Captures pull request code diffs from preset scenarios or live local git changes (`git diff HEAD~1`). Renders with line numbers and tokenized syntax in the terminal.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-900 border-2 border-purple-500 flex items-center justify-center text-[10px] font-bold text-purple-400">
                      2
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>Semantic Hindsight Memory Recall</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-purple-950 text-purple-300 rounded border border-purple-800">
                          hindsight.recall()
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Executes a contextual vector query against <span className="font-mono text-emerald-400">team-repo-standards</span>. It retrieves historical PR debates, RFC guidelines, and incident post-mortems relevant to the modified files.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-900 border-2 border-pink-500 flex items-center justify-center text-[10px] font-bold text-pink-400">
                      3
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>Memory Extraction & Terminal Table</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-pink-950 text-pink-300 rounded border border-pink-800">
                          rich.table.Table
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Parses memory directives, world knowledge, and observations into an interactive console table with citation tags, original authors (e.g. Alex, Sarah, Marcus), and decision dates.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center text-[10px] font-bold text-amber-400">
                      4
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>Dual Synthesis via Groq LLM Engine</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-950 text-amber-300 rounded border border-amber-800">
                          qwen-32b / gpt-oss-120b
                        </span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#0a0d14] border border-slate-800 p-2.5 rounded-lg space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Stateless Baseline</span>
                          <p className="text-slate-400 text-[11px]">
                            Lacks repository history. Approves the PR because syntax and TypeScript types are valid.
                          </p>
                        </div>
                        <div className="bg-indigo-950/30 border border-indigo-800/60 p-2.5 rounded-lg space-y-1">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase">PatternPulse Augmented</span>
                          <p className="text-indigo-200 text-[11px]">
                            Cites exact historical RFCs, flags multi-tenant/security bypass, and outputs compliant code.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                      5
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>Exit Code Verdict & CI Blocking</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                          Exit Code 0 / 1
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        If architectural violations are detected, the CLI outputs a blocking verdict and exits with <span className="font-mono text-rose-400 font-bold">1</span>. If clean, it exits with <span className="font-mono text-emerald-400 font-bold">0</span> for automated CI/CD pipelines.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GIT HOOKS & CI/CD */}
          {activeTab === 'hooks' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-[#111724] border border-slate-800 rounded-xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-emerald-400" />
                    <span>Automate PatternPulse in Git & CI/CD</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enforce architectural compliance automatically before code is pushed to remote branches or merged in GitHub Pull Requests.
                  </p>
                </div>

                {/* Accordion 1: Git Pre-Push Hook */}
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'pre-push' ? '' : 'pre-push')}
                    className="w-full bg-[#0e131e] px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:bg-slate-800/60 transition"
                  >
                    <span className="flex items-center space-x-2">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Git Pre-Push Hook (.git/hooks/pre-push)</span>
                    </span>
                    {openAccordion === 'pre-push' ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {openAccordion === 'pre-push' && (
                    <div className="p-4 bg-[#07090f] border-t border-slate-800 space-y-3 animate-in fade-in">
                      <p className="text-xs text-slate-400">
                        Create or edit <span className="font-mono text-slate-300">.git/hooks/pre-push</span> in your local repository. This script runs before every <span className="font-mono text-emerald-400">git push</span> and aborts if team conventions are violated:
                      </p>

                      <div className="relative bg-[#05070a] border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300">
                        <pre className="overflow-x-auto scrollbar-none text-[11px] leading-relaxed">
{`#!/bin/sh
# .git/hooks/pre-push: Block pushes that violate architectural conventions

echo "⚡ Running PatternPulse Architectural Review..."
python cli.py review --scenario git

if [ $? -ne 0 ]; then
    echo "❌ Push blocked: Architectural violations found against team memory."
    echo "💡 Review the recommendations above before pushing."
    exit 1
fi

echo "✅ PatternPulse architectural review passed."
exit 0`}
                        </pre>

                        <button
                          onClick={() =>
                            copyToClipboard(
                              `#!/bin/sh\necho "⚡ Running PatternPulse Architectural Review..."\npython cli.py review --scenario git\nif [ $? -ne 0 ]; then\n    echo "❌ Push blocked: Architectural violations found against team memory."\n    exit 1\nfi\nexit 0`,
                              'hook-pre-push',
                              'Pre-push hook script copied!'
                            )
                          }
                          className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center space-x-1 border border-slate-700 transition"
                        >
                          {copiedIndex === 'hook-pre-push' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Copy Script</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 font-mono">
                        Note: Make it executable on Unix/macOS: <span className="text-indigo-400">chmod +x .git/hooks/pre-push</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 2: GitHub Actions CI Workflow */}
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'github-actions' ? '' : 'github-actions')}
                    className="w-full bg-[#0e131e] px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:bg-slate-800/60 transition"
                  >
                    <span className="flex items-center space-x-2">
                      <Workflow className="w-3.5 h-3.5 text-indigo-400" />
                      <span>GitHub Actions Workflow (.github/workflows/patternpulse.yml)</span>
                    </span>
                    {openAccordion === 'github-actions' ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {openAccordion === 'github-actions' && (
                    <div className="p-4 bg-[#07090f] border-t border-slate-800 space-y-3 animate-in fade-in">
                      <p className="text-xs text-slate-400">
                        Automatically review incoming Pull Requests and post architectural change requests directly to GitHub:
                      </p>

                      <div className="relative bg-[#05070a] border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300">
                        <pre className="overflow-x-auto scrollbar-none text-[11px] leading-relaxed">
{`name: PatternPulse Architectural Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install Dependencies
        run: pip install typer rich python-dotenv groq hindsight-client

      - name: Run PatternPulse CLI Review
        env:
          GROQ_API_KEY: \${{ secrets.GROQ_API_KEY }}
          HINDSIGHT_API_KEY: \${{ secrets.HINDSIGHT_API_KEY }}
          HINDSIGHT_BANK_ID: 'team-repo-standards'
        run: python cli.py review --scenario git`}
                        </pre>

                        <button
                          onClick={() =>
                            copyToClipboard(
                              `name: PatternPulse Architectural Review\non:\n  pull_request:\n    types: [opened, synchronize]\njobs:\n  review:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 2\n      - name: Set up Python\n        uses: actions/setup-python@v5\n        with:\n          python-version: '3.11'\n      - name: Install Dependencies\n        run: pip install typer rich python-dotenv groq hindsight-client\n      - name: Run PatternPulse CLI Review\n        env:\n          GROQ_API_KEY: \${{ secrets.GROQ_API_KEY }}\n          HINDSIGHT_API_KEY: \${{ secrets.HINDSIGHT_API_KEY }}\n          HINDSIGHT_BANK_ID: 'team-repo-standards'\n        run: python cli.py review --scenario git`,
                              'ci-workflow',
                              'GitHub Actions YAML copied!'
                            )
                          }
                          className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center space-x-1 border border-slate-700 transition"
                        >
                          {copiedIndex === 'ci-workflow' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Copy YAML</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="border-t border-slate-800/80 bg-[#101520] px-6 py-3.5 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Tip:</span>
            <span>Run <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">python cli.py --help</code> to view all CLI flags.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
