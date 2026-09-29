import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain,
  Cpu,
  GitPullRequest,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Database,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2,
  Settings2,
  RotateCcw,
  Plus,
  Copy,
  Check,
  Search,
  BookOpen,
  User,
  Clock,
  ChevronRight,
  Sliders,
  Terminal,
  Layers,
  FileCode,
  Zap,
  Globe
} from 'lucide-react';
import CliDocsModal from './CliDocsModal.jsx';

const INITIAL_SCENARIOS = {
  prisma: {
    id: 'prisma',
    tabTitle: 'PR #104: Server Action Direct DB Query',
    prNumber: '#104',
    title: 'feat: add user profile update server action',
    branch: 'feature/user-bio → main',
    file: 'app/actions/update-user-profile.ts',
    stats: '+24 -3',
    contextHint: 'Next.js server action database query, multi-tenant isolation, error logging',
    rawDiff: `@@ -1,6 +1,24 @@
+'use server';
+
+import { prisma } from '@/lib/prisma';
+
+export async function updateUserProfile(userId: string, data: { bio: string; displayName: string }) {
+  try {
+    // Direct Prisma update inside Next.js Server Action
+    const updatedUser = await prisma.user.update({
+      where: { id: userId },
+      data: {
+        bio: data.bio,
+        displayName: data.displayName,
+      },
+    });
+
+    return { success: true, user: updatedUser };
+  } catch (error) {
+    console.error('Failed to update user profile in DB:', error);
+    return { success: false, message: 'Database update failed' };
+  }
+}`,
    stateless: {
      status: 'APPROVED',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
      summary: 'The new server action is well-formed with valid TypeScript typings, proper try/catch boundaries, and valid Prisma syntax. Clean addition.',
      nits: [
        'Consider defining an explicit ReturnType interface for updateUserProfile.',
        'Minor: displayName validation could use a length check (e.g. min 2 chars).'
      ]
    },
    hindsightMemories: [
      {
        id: 'mem-42',
        type: 'DIRECTIVE',
        badgeColor: 'bg-[#3c1219] text-[#f87171] border border-[#881337]',
        author: 'Alex (TechLead)',
        date: '2026-09-14',
        context: 'database_architecture',
        text: 'Direct Prisma calls inside Server Actions are prohibited. All database queries must route through the service layer.',
        ruleId: 'RFC-42'
      },
      {
        id: 'mem-58',
        type: 'WORLD',
        badgeColor: 'bg-[#3c220f] text-[#fb923c] border border-[#9a3412]',
        author: 'Marcus (Senior Dev)',
        date: '2026-09-20',
        context: 'logging_standards',
        text: 'Raw console.error on database failures is forbidden. Must use Supabase logger wrapper for Datadog alerts.',
        ruleId: 'INC-58'
      },
      {
        id: 'mem-101',
        type: 'OBSERVATION',
        badgeColor: 'bg-[#2b104c] text-[#c084fc] border border-[#701a75]',
        author: 'Security Bot',
        date: '2026-09-25',
        context: 'multi_tenant_compliance',
        text: 'Multi-tenant isolation verified by CI wrapper. Bypassing service layer results in tenant leaks.',
        ruleId: 'SEC-101'
      }
    ],
    agentVerdict: {
      status: 'CHANGES REQUESTED (BLOCKING)',
      badgeColor: 'text-[#f87171] bg-[#400e16] border border-[#991b1b]',
      headline: '2 Critical Repository Architectural Violations Found',
      violations: [
        {
          num: 1,
          ruleRef: 'RFC-42 (Alex TechLead, 2026-09-14)',
          issue: 'DIRECT PRISMA CALL IN SERVER ACTION',
          detail: 'Calling prisma.user.update directly bypasses the multi-tenant context filter. Cross-tenant leakage risks exist without lib/services/userService.ts.',
          type: 'Security'
        }
      ],
      refactorCode: `import { userService } from '@/lib/services/userService';
import { logger } from '@/lib/logger';
import { getSessionTenantId } from '@/lib/auth';

export async function updateUserProfile(userId: string, data: { bio: string; displayName: string }) {
  try {
    const tenantId = await getSessionTenantId();
    // Compliant: Enforces tenant boundary through service layer
    const updatedUser = await userService.updateProfile({
      tenantId,
      userId,
      data
    });
    return { success: true, user: updatedUser };
  } catch (error) {
    logger.error('Failed to update user profile in DB', {
      context: 'updateUserProfile',
      userId,
      error
    });
    return { success: false, message: 'Database update failed' };
  }
}`
    }
  },
  auth: {
    id: 'auth',
    tabTitle: 'PR #105: Insecure JWT Storage',
    prNumber: '#105',
    title: 'feat: store auth token for persistent dashboard access',
    branch: 'feature/auth-persist → main',
    file: 'src/features/auth/useAuth.ts',
    stats: '+17 -1',
    contextHint: 'React authentication session storage, JWT tokens, XSS protection',
    rawDiff: `@@ -1,5 +1,17 @@
+import { useEffect } from 'react';
+
+export function useAuthSession(token: string) {
+  useEffect(() => {
+    if (token) {
+      // Store JWT token locally for access across reloads
+      localStorage.setItem('auth_token', token);
+      localStorage.setItem('session_active', 'true');
+    }
+  }, [token]);
+
+  return {
+    isAuthenticated: !!localStorage.getItem('auth_token'),
+  };
+}`,
    stateless: {
      status: 'APPROVED',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
      summary: 'Clean custom React hook. Correctly uses useEffect hook dependencies and boolean coercion for authentication flag.',
      nits: [
        'Consider cleaning up localStorage on hook unmount or logout.',
        'Token prop should ideally be typed with string | null.'
      ]
    },
    hindsightMemories: [
      {
        id: 'mem-19',
        type: 'DIRECTIVE',
        badgeColor: 'bg-rose-950/70 text-rose-300 border-rose-800/80',
        author: 'Sarah (SecOps Lead)',
        date: '2026-08-30',
        context: 'authentication_policy',
        text: 'Do not store JWT access tokens or sensitive auth state in browser localStorage/sessionStorage due to XSS vulnerability. Tokens must always be set as HTTP-only, Secure cookies with SameSite=Strict.',
        ruleId: 'SEC-19'
      },
      {
        id: 'mem-88',
        type: 'WORLD',
        badgeColor: 'bg-amber-950/70 text-amber-300 border-amber-800/80',
        author: 'David (Frontend Arch)',
        date: '2026-09-02',
        context: 'client_session_state',
        text: 'Use `useAuthContext()` or cookie-backed `/api/auth/me` endpoints for session hydration. Client code should have zero direct token access.',
        ruleId: 'RFC-88'
      }
    ],
    agentVerdict: {
      status: 'CHANGES REQUESTED (BLOCKING)',
      badgeColor: 'text-rose-400 bg-rose-950/70 border-rose-800 animate-pulse',
      headline: 'Severe Security Violation: Token Storage Policy',
      violations: [
        {
          num: 1,
          ruleRef: 'SEC-19 (Sarah SecOps Lead, 2026-08-30)',
          issue: 'JWT Saved in Browser LocalStorage (XSS Vulnerability)',
          detail: 'Exposing access tokens to localStorage leaves them vulnerable to malicious script extraction. Tokens must live strictly inside HTTP-only, Secure cookies.',
          type: 'Security Critical'
        }
      ],
      refactorCode: `import { useAuthContext } from '@/features/auth/AuthContext';

export function useAuthSession() {
  // Compliant: Consumes cookie-backed session without client storage access
  const { session, isAuthenticated, isLoading } = useAuthContext();

  return {
    isAuthenticated,
    user: session?.user ?? null,
    isLoading
  };
}`
    }
  },
  perf: {
    id: 'perf',
    tabTitle: 'PR #106: Heavy Array Chaining in Render',
    prNumber: '#106',
    title: 'perf: display filtered transaction list in billing table',
    branch: 'feature/billing-filter → main',
    file: 'src/components/billing/TransactionTable.tsx',
    stats: '+22 -2',
    contextHint: 'React performance, heavy array map reduce, memoization, virtualization',
    rawDiff: `@@ -12,5 +12,25 @@
 export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
+  // Process metrics directly in render path
+  const processed = transactions
+    .filter(t => t.status === 'COMPLETED')
+    .map(t => ({ ...t, formattedAmount: '$' + (t.cents / 100).toFixed(2) }))
+    .sort((a, b) => b.timestamp - a.timestamp)
+    .reduce((acc, curr) => {
+      acc[curr.currency] = (acc[curr.currency] || 0) + curr.cents;
+      return acc;
+    }, {} as Record<string, number>);
+
   return (
     <div className="table-container">
       <SummaryCards summary={processed} />
       <VirtualList data={transactions} />
     </div>
   );
 }`,
    stateless: {
      status: 'APPROVED',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
      summary: 'Functional JavaScript chaining looks standard and readable. Type assertion properly typed with Record<string, number>.',
      nits: [
        'Could break down the chained functions for readability.',
        'Minor: consider using Intl.NumberFormat instead of inline dollar sign.'
      ]
    },
    hindsightMemories: [
      {
        id: 'mem-77',
        type: 'DIRECTIVE',
        badgeColor: 'bg-rose-950/70 text-rose-300 border-rose-800/80',
        author: 'Elena (Frontend Lead)',
        date: '2026-09-12',
        context: 'frontend_performance_standards',
        text: 'Heavy data mapping, filtering, or array chaining (.map, .filter, .reduce) on datasets larger than 100 items must never be executed directly inside React component bodies. Always wrap in useMemo or delegate aggregation to backend queries.',
        ruleId: 'PERF-77'
      },
      {
        id: 'mem-33',
        type: 'OBSERVATION',
        badgeColor: 'bg-purple-950/70 text-purple-300 border-purple-800/80',
        author: 'Web Vitals Telemetry',
        date: '2026-09-18',
        context: 'interaction_to_next_paint',
        text: 'INP degraded from 80ms to 240ms on transactions page due to un-memoized recalculations during typing in date range filter.',
        ruleId: 'METRIC-33'
      }
    ],
    agentVerdict: {
      status: 'CHANGES REQUESTED (BLOCKING)',
      badgeColor: 'text-rose-400 bg-rose-950/70 border-rose-800 animate-pulse',
      headline: 'Render Cycle Performance Violation (INP Hazard)',
      violations: [
        {
          num: 1,
          ruleRef: 'PERF-77 (Elena Frontend Lead, 2026-09-12)',
          issue: 'Heavy Chained Array Reductions in Component Body',
          detail: 'Executing .filter().map().sort().reduce() directly in render freezes the UI thread when table parent re-renders. Must use useMemo or server aggregation.',
          type: 'Performance'
        }
      ],
      refactorCode: `import { useMemo } from 'react';

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  // Compliant: Memoized to preserve Interaction to Next Paint (INP)
  const processed = useMemo(() => {
    const summary: Record<string, number> = {};
    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      if (t.status === 'COMPLETED') {
        summary[t.currency] = (summary[t.currency] || 0) + t.cents;
      }
    }
    return summary;
  }, [transactions]);

  return (
    <div className="table-container">
      <SummaryCards summary={processed} />
      <VirtualList data={transactions} />
    </div>
  );
}`
    }
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('prisma');
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS);
  const [editableDiff, setEditableDiff] = useState(INITIAL_SCENARIOS.prisma.rawDiff);
  const [contextInput, setContextInput] = useState(INITIAL_SCENARIOS.prisma.contextHint);
  const [isEditingDiff, setIsEditingDiff] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(true);
  const [showFixCode, setShowFixCode] = useState(false);

  // Stats / Memory counter
  const [totalMemoriesCount, setTotalMemoriesCount] = useState(14);
  const [copiedCode, setCopiedCode] = useState(false);

  // Modals
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isCliModalOpen, setIsCliModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Global keyboard shortcut to toggle CLI modal (Alt+C or Ctrl+`)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === '`') || (e.altKey && (e.key === 'c' || e.key === 'C'))) {
        e.preventDefault();
        setIsCliModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Rule Form State
  const [newAuthor, setNewAuthor] = useState('Sarah (Principal Arch)');
  const [newContext, setNewContext] = useState('architecture');
  const [newDirective, setNewDirective] = useState('');
  const [newRuleId, setNewRuleId] = useState('RFC-108');

  // API Config State
  const [apiMode, setApiMode] = useState('live'); // 'mock' | 'live'
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:8000');
  const [apiPingStatus, setApiPingStatus] = useState('idle'); // 'idle' | 'testing' | 'success' | 'failed'

  const currentScenario = scenarios[activeTab];

  const handleTabChange = (key) => {
    setActiveTab(key);
    setEditableDiff(scenarios[key].rawDiff);
    setContextInput(scenarios[key].contextHint);
    setHasExecuted(true);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleExecuteReview = async () => {
    setIsAnalyzing(true);

    if (apiMode === 'live') {
      try {
        const response = await fetch(`${apiEndpoint}/api/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            diff: editableDiff,
            file_context: contextInput,
            mode: 'both'
          })
        });
        if (!response.ok) throw new Error('Backend failed');
        const data = await response.json();
        
        if (data.recalled_memories && data.recalled_memories.length > 0) {
          const liveMemories = data.recalled_memories.map((memStr, i) => {
            let type = 'WORLD';
            let text = memStr;
            const match = memStr.match(/^-\s*\[(.*?)\]\s*(.*)$/);
            if (match) {
              type = match[1];
              text = match[2];
            }
            return {
              id: `live-mem-${i}`,
              type: type,
              badgeColor: type === 'DIRECTIVE' ? 'bg-rose-950/70 text-rose-300 border-rose-800/80' : 
                          type === 'WORLD' ? 'bg-amber-950/70 text-amber-300 border-amber-800/80' : 
                          'bg-purple-950/70 text-purple-300 border-purple-800/80',
              author: 'Team Repo Standard',
              date: 'Recalled Live',
              context: 'repo_standard',
              text: text,
              ruleId: `HINDSIGHT-${i+1}`
            };
          });

          setScenarios(prev => ({
            ...prev,
            [activeTab]: {
              ...prev[activeTab],
              hindsightMemories: liveMemories,
              liveReview: data.hindsight,
              liveStateless: data.stateless
            }
          }));
        }

        setIsAnalyzing(false);
        setHasExecuted(true);
        showToast('Live review completed from FastAPI backend!');
        return;
      } catch (err) {
        console.warn('Backend unavailable, rendered in-memory simulation:', err);
        showToast('Backend offline, rendered high-fidelity simulation');
      }
    }

    // Fallback simulation (mock mode)
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasExecuted(true);
      showToast('PatternPulse recalled conventions and completed review');
    }, 1200);
  };

  const handleRetainMemory = async () => {
    if (!newDirective.trim()) return;

    const newMem = {
      id: `mem-${Date.now()}`,
      type: 'DIRECTIVE',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-700',
      author: newAuthor,
      date: '2026-09-29',
      context: newContext,
      text: newDirective,
      ruleId: newRuleId || `RULE-${Math.floor(Math.random() * 900 + 100)}`
    };

    // Update active scenario's memories
    setScenarios((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        hindsightMemories: [newMem, ...prev[activeTab].hindsightMemories]
      }
    }));

    setTotalMemoriesCount((c) => c + 1);
    setIsRuleModalOpen(false);
    setNewDirective('');

    if (apiMode === 'live') {
      try {
        await fetch(`${apiEndpoint}/api/retain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: newAuthor,
            context: newContext,
            rule: newDirective
          })
        });
      } catch (e) {
        // Fallback gracefully
      }
    }

    showToast('New architectural convention retained in Hindsight bank!');
  };

  const testApiConnection = async () => {
    setApiPingStatus('testing');
    try {
      const res = await fetch(`${apiEndpoint}/api/presets`, { method: 'GET' });
      if (res.ok) {
        setApiPingStatus('success');
      } else {
        setApiPingStatus('failed');
      }
    } catch (e) {
      setApiPingStatus('failed');
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleResetDemo = () => {
    setScenarios(INITIAL_SCENARIOS);
    setTotalMemoriesCount(14);
    setEditableDiff(INITIAL_SCENARIOS[activeTab].rawDiff);
    showToast('Demo state reset to original seed state');
  };

  const renderFormattedDiff = useMemo(() => {
    const lines = editableDiff.split('\n');
    return lines.map((line, idx) => {
      let bg = 'bg-transparent text-slate-300';
      let symbol = ' ';
      let lineNum = idx + 1;

      const isPrismaViolationLine = activeTab === 'prisma' && (line.includes('Direct Prisma update') || line.includes('const updatedUser = await prisma.user.update'));
      const isAuthViolationLine = activeTab === 'auth' && (line.includes("localStorage.setItem('auth_token'") || line.includes("localStorage.setItem('session_active'"));

      if (isPrismaViolationLine || isAuthViolationLine) {
        bg = 'bg-[#092635] text-[#5eead4] border-l-2 border-[#14b8a6] font-semibold';
      } else if (line.startsWith('+')) {
        bg = 'bg-transparent text-[#34d399]';
        symbol = '+';
      } else if (line.startsWith('-')) {
        bg = 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500 line-through opacity-80';
        symbol = '-';
      } else if (line.startsWith('@@')) {
        bg = 'bg-transparent text-[#38bdf8] font-mono text-xs py-0.5';
      }

      return (
        <div key={idx} className={`flex items-start text-xs font-mono px-3 py-0.5 hover:bg-slate-800/30 transition-colors ${bg}`}>
          <span className="w-8 select-none text-[#334155] text-right pr-3 shrink-0">{lineNum}</span>
          <span className="w-4 select-none text-[#334155] shrink-0">{symbol}</span>
          <pre className="whitespace-pre-wrap break-all flex-1 font-mono">{line.startsWith('+') || line.startsWith('-') ? line.slice(1) : line}</pre>
        </div>
      );
    });
  }, [editableDiff, activeTab]);

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans antialiased selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Header */}
      <header className="border-b border-[#141f36] bg-[#070d18]/90 backdrop-blur-md sticky top-0 z-30 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        
        {/* Brand & Memory Status */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/20">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-white"></div>
          </div>

          <span className="font-bold text-lg text-white tracking-tight">PatternPulse</span>

          <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#1a0f30] text-[#c084fc] border border-[#581c87]/70 rounded-full text-xs font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d946ef] animate-pulse"></span>
            <span>HINDSIGHT MEMORY ENGINE</span>
          </div>
        </div>

        {/* Global Memory Bank Pill & Actions */}
        <div className="flex items-center space-x-2.5">
          <div className="hidden sm:flex items-center space-x-2 bg-[#09101f] border border-[#141f36] rounded-full px-3.5 py-1">
            <span className="text-xs font-mono text-slate-400">
              Bank: <span className="text-[#2dd4bf] font-semibold">team-repo-standards</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#052e16] text-[#4ade80] border border-[#166534] rounded font-mono font-bold">
              ACTIVE
            </span>
          </div>

          <button
            onClick={() => setIsCliModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#09101f] hover:bg-[#101b33] text-[#34d399] border border-[#10b981]/40 hover:border-[#10b981] rounded-lg text-xs font-mono font-medium shadow-md shadow-emerald-950/30 transition-all active:scale-95 group"
            title="Open CLI Quickstart & Interactive Docs (Alt+C)"
          >
            <Terminal className="w-3.5 h-3.5 text-[#34d399] group-hover:scale-110 transition-transform" />
            <span>&gt; CLI Docs &amp; Quickstart</span>
          </button>

          <button
            onClick={() => setIsRuleModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#9333ea] text-white rounded-lg text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Teach New Rule</span>
          </button>

          <button
            onClick={() => setIsApiModalOpen(true)}
            className="p-1.5 bg-[#09101f] hover:bg-[#101b33] border border-[#141f36] rounded-lg text-slate-400 hover:text-slate-200 transition"
            title="Configure Live API"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={handleResetDemo}
            className="p-1.5 bg-[#09101f] hover:bg-[#101b33] border border-[#141f36] rounded-lg text-slate-400 hover:text-slate-200 transition"
            title="Reset Demo State"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Control Bar: Scenario Presets & Action */}
      <section className="bg-[#070c17]/60 border-b border-[#141f36] px-6 py-2.5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          
          {/* Tab Presets */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#a855f7]" /> Scenarios:
            </span>

            {Object.keys(scenarios).map((key) => {
              const item = scenarios[key];
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`text-xs px-3 py-1 rounded-lg border font-mono transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-[#1e1035] border-[#a855f7] text-[#e9d5ff] font-semibold shadow-sm'
                      : 'bg-[#09101f]/60 border-[#141f36] text-slate-400 hover:text-slate-200 hover:border-[#1e2e4f]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#c084fc]' : 'bg-slate-600'}`}></span>
                  <span>{item.tabTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Context Search & Execute Action */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
                placeholder="Search semantic memory context..."
                className="w-full bg-[#040711] border border-[#141f36] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-[#a855f7]"
              />
            </div>

            <button
              onClick={handleExecuteReview}
              disabled={isAnalyzing}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg transition flex items-center space-x-1.5 ${
                isAnalyzing
                  ? 'bg-purple-800 cursor-not-allowed opacity-80'
                  : 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:brightness-110 active:scale-95 shadow-purple-900/40'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Recalling...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current text-purple-200" />
                  <span>Execute Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">

        {/* TOP ROW: Code Diff (Left) & Recall Engine (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

          {/* LEFT CARD: Code Diff Viewer (col-span-7) */}
          <div className="lg:col-span-7 bg-[#070d18] border border-[#141f36] rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
            {/* Diff Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#121c2e] text-xs font-mono mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-slate-300 font-semibold">{currentScenario.file}</span>
                <span className="text-[#34d399] font-medium">+24</span>
                <span className="text-[#f87171] font-medium">-3</span>
              </div>
              <button
                onClick={() => setIsEditingDiff(!isEditingDiff)}
                className="text-[11px] font-mono text-[#38bdf8] hover:text-[#7dd3fc] font-semibold tracking-wider uppercase transition flex items-center gap-1"
              >
                <Code2 className="w-3 h-3" />
                {isEditingDiff ? 'VIEW DIFF' : 'EDIT CUSTOM DIFF'}
              </button>
            </div>

            {/* Code Canvas */}
            <div className="bg-[#030712] border border-[#0f172a] rounded-xl p-3 font-mono text-xs overflow-auto flex-1 min-h-[380px] max-h-[460px] scrollbar-thin scrollbar-thumb-slate-800">
              {isEditingDiff ? (
                <textarea
                  value={editableDiff}
                  onChange={(e) => setEditableDiff(e.target.value)}
                  className="w-full h-full min-h-[360px] bg-transparent text-[#34d399] font-mono text-xs outline-none resize-none"
                  placeholder="Paste Git diff here..."
                />
              ) : (
                <div className="py-1">{renderFormattedDiff}</div>
              )}
            </div>
          </div>

          {/* RIGHT CARD: RECALL ENGINE (col-span-5) */}
          <div className="lg:col-span-5 bg-[#070d18] border border-[#141f36] rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#121c2e] mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[#a855f7] text-xs">■</span>
                  <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                    RECALL ENGINE
                  </h2>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#1f1035] text-[#c084fc] border border-[#6b21a8] rounded-full font-semibold">
                  4-Way Hybrid Search
                </span>
              </div>

              {/* 3 Memory Cards */}
              <div className="space-y-3">
                {currentScenario.hindsightMemories.slice(0, 3).map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3.5 bg-[#0b1220]/90 border border-[#152238] rounded-xl space-y-2 hover:border-[#1e3050] transition shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${mem.badgeColor}`}>
                        {mem.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {mem.date}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {mem.text}
                    </p>

                    <div className="pt-1.5 flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-[9px] font-bold text-white shadow-sm ring-1 ring-white/10">
                          {mem.author.slice(0, 1)}
                        </div>
                        <span>{mem.author}</span>
                      </div>
                      <span className="font-mono text-slate-500 text-[11px]">{mem.ruleId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Context Footer */}
            <div className="pt-4 mt-3 border-t border-[#121c2e] flex items-center justify-between text-[11px] font-mono text-slate-500 font-semibold tracking-wider">
              <span>HISTORICAL CONTEXT FOUND</span>
              <div className="flex items-center -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-[#070d18]" title="Alex (TechLead)">A</div>
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-[#070d18]" title="Marcus (Senior Dev)">M</div>
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-[#070d18]" title="Security Bot">🤖</div>
                <span className="ml-2.5 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-[#172554] text-[#93c5fd] border border-[#1e40af]">+3</span>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM ROW: VERDICT COMPARISON (Full Width) */}
        <div className="bg-[#070d18] border border-[#141f36] rounded-2xl p-6 shadow-2xl">
          {/* Section Header */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-[#22d3ee] font-mono text-xs">○</span>
            <h3 className="text-xs font-bold text-[#22d3ee] tracking-wider uppercase font-mono">
              VERDICT COMPARISON
            </h3>
          </div>

          {/* Two Columns Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT: Stateless LLM */}
            <div className="p-5 bg-[#060b15]/70 border border-[#121c2e] rounded-xl flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#052316] text-[#4ade80] border border-[#166534] tracking-wider">
                  APPROVED
                </span>
                <p className="text-xs text-slate-300 italic leading-relaxed mt-3.5">
                  "{currentScenario.liveStateless || currentScenario.stateless.summary}"
                </p>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  Minor style nitpicks only — no architectural findings.
                </p>
              </div>

              <div className="pt-2 border-t border-[#101726] flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Lacks cross-PR memory</span>
                <span>Stateless Baseline</span>
              </div>
            </div>

            {/* RIGHT: Memory-Augmented (PatternPulse) */}
            <div className="p-5 bg-[#0a0812]/70 border border-[#260f17] rounded-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-3 py-1 rounded bg-[#400e16] text-[#f87171] border border-[#991b1b] tracking-wider">
                    CHANGES REQUESTED (BLOCKING)
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400">
                    Hindsight Grounded
                  </span>
                </div>

                {/* Violation Box */}
                <div className="bg-[#18080d] border border-[#7f1d1d]/80 rounded-xl p-4 mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#f87171]">
                      {currentScenario.agentVerdict.violations[0]?.issue ? `#1: ${currentScenario.agentVerdict.violations[0].issue.toUpperCase()}` : '#1: ARCHITECTURAL VIOLATION'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#450a0a] text-[#f87171] border border-[#991b1b] rounded font-semibold">
                      {currentScenario.agentVerdict.violations[0]?.type || 'Security'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentScenario.agentVerdict.violations[0]?.detail || currentScenario.liveReview}
                  </p>
                  <div className="text-[11px] font-mono text-[#f87171]/70">
                    Source: {currentScenario.agentVerdict.violations[0]?.ruleRef || 'Historical Team Convention'}
                  </div>
                </div>

                {/* Compliant Code Fix Toggle */}
                <div className="mt-3">
                  <button
                    onClick={() => setShowFixCode(!showFixCode)}
                    className="text-xs font-mono text-[#2dd4bf] hover:text-[#5eead4] flex items-center space-x-1.5 transition"
                  >
                    <span>{showFixCode ? '▼ Hide Compliant Architecture Fix' : '▶ View Compliant Architecture Fix'}</span>
                  </button>
                  {showFixCode && (
                    <div className="mt-2.5 p-3 bg-[#03060c] border border-slate-800 rounded-lg overflow-x-auto">
                      <pre className="text-[11px] font-mono text-emerald-300 leading-relaxed whitespace-pre">
                        {currentScenario.agentVerdict.refactorCode}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1c0d12] flex items-center justify-between text-[10px] font-mono text-[#f87171]">
                <span>Blocked by historical RFC rules</span>
                <span>team-repo-standards</span>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Teach New Rule Modal */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121826] border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Teach Agent a New Rule</h3>
                  <p className="text-[11px] text-slate-400">Retain convention into Hindsight memory bank</p>
                </div>
              </div>
              <button
                onClick={() => setIsRuleModalOpen(false)}
                className="text-slate-400 hover:text-white text-base"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Author / Lead</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Rule ID / Tag</label>
                  <input
                    type="text"
                    value={newRuleId}
                    onChange={(e) => setNewRuleId(e.target.value)}
                    placeholder="RFC-108"
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Category</label>
                <select
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="database_architecture">Database & Architecture</option>
                  <option value="security_policy">Security & Authentication</option>
                  <option value="frontend_performance">Performance & UI Rendering</option>
                  <option value="logging_standards">Logging & Telemetry</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Architectural Directive / Standard
                </label>
                <textarea
                  rows={4}
                  value={newDirective}
                  onChange={(e) => setNewDirective(e.target.value)}
                  placeholder="e.g. All public API mutations must implement rate limiting with Redis Upstash before touching controller logic..."
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsRuleModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRetainMemory}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-lg shadow-md transition"
              >
                Retain Memory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Config Modal */}
      {isApiModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121826] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Settings2 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">API & Inference Mode</h3>
              </div>
              <button onClick={() => setIsApiModalOpen(false)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1.5">Execution Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setApiMode('mock')}
                    className={`py-2 px-3 rounded-lg border text-left flex flex-col space-y-1 ${
                      apiMode === 'mock'
                        ? 'border-indigo-500 bg-indigo-950/40 text-indigo-200'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    <span className="font-bold">Offline Mock</span>
                    <span className="text-[10px] text-slate-500">Fast showcase, zero setup</span>
                  </button>

                  <button
                    onClick={() => setApiMode('live')}
                    className={`py-2 px-3 rounded-lg border text-left flex flex-col space-y-1 ${
                      apiMode === 'live'
                        ? 'border-indigo-500 bg-indigo-950/40 text-indigo-200'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    <span className="font-bold">Live FastAPI</span>
                    <span className="text-[10px] text-slate-500">Connects to Python core</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">FastAPI Backend URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="flex-1 bg-[#0a0d14] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                  />
                  <button
                    onClick={testApiConnection}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg border border-slate-700 transition shrink-0"
                  >
                    {apiPingStatus === 'testing' ? 'Testing...' : 'Ping'}
                  </button>
                </div>
                {apiPingStatus === 'success' && (
                  <span className="text-[11px] text-emerald-400 mt-1 block">● Backend online & responding</span>
                )}
                {apiPingStatus === 'failed' && (
                  <span className="text-[11px] text-rose-400 mt-1 block">● Connection failed (ensure `python server.py` is running)</span>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsApiModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLI Docs & Interactive Quickstart Drawer */}
      <CliDocsModal
        isOpen={isCliModalOpen}
        onClose={() => setIsCliModalOpen(false)}
        onCopyToast={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-[#121826] border border-indigo-500/50 shadow-xl shadow-black/60 rounded-xl px-4 py-3 flex items-center space-x-3 text-xs text-slate-200">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}
