"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  GitBranch,
  GitCommitHorizontal,
  Github,
  GitPullRequest,
  Info,
  LayoutDashboard,
  Lightbulb,
  LockKeyhole,
  Menu,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  X,
} from "lucide-react";

type RangeKey = "7D" | "30D" | "90D" | "1Y";

type Contributor = {
  initials: string;
  name: string;
  handle: string;
  commits: number;
  pullRequests: number;
  lastActive: string;
};

type Repository = {
  slug: string;
  owner: string;
  name: string;
  description: string;
  visibility: "Public" | "Private";
  branch: string;
  language: string;
  activityScale: number;
  metrics: {
    commits: number;
    contributors: number;
    mergedPulls: number;
    openIssues: number;
  };
  attention: {
    reviews: number;
    oldestReview: string;
    untriaged: number;
    mergeImprovement: number;
  };
  pullRequests: {
    merged: number;
    open: number;
    median: string;
    queue: Array<{ title: string; number: number; age: string; status: string }>;
  };
  issues: {
    closed: number;
    opened: number;
    backlog: number;
    queue: Array<{ title: string; number: number; age: string; label: string }>;
  };
  contributors: Contributor[];
  activity: Array<{
    kind: "commit" | "pull" | "issue";
    title: string;
    detail: string;
    time: string;
  }>;
};

const repositories: Repository[] = [
  {
    slug: "nicosimoncinii/devinsight",
    owner: "nicosimoncinii",
    name: "devinsight",
    description: "Repository analytics for developers and small teams.",
    visibility: "Public",
    branch: "main",
    language: "TypeScript",
    activityScale: 1,
    metrics: { commits: 184, contributors: 8, mergedPulls: 31, openIssues: 14 },
    attention: { reviews: 3, oldestReview: "26 hours", untriaged: 4, mergeImprovement: 11 },
    pullRequests: {
      merged: 31,
      open: 7,
      median: "6h 24m",
      queue: [
        { title: "Add repository analytics shell", number: 48, age: "26h", status: "Waiting for review" },
        { title: "Normalize GitHub installation events", number: 46, age: "18h", status: "1 reviewer assigned" },
        { title: "Improve sync retry telemetry", number: 43, age: "9h", status: "Waiting for review" },
      ],
    },
    issues: {
      closed: 21,
      opened: 17,
      backlog: 14,
      queue: [
        { title: "Define sync retry behavior", number: 44, age: "3h", label: "Needs owner" },
        { title: "Document stale repository states", number: 41, age: "1d", label: "Needs priority" },
        { title: "Clarify contributor activity rules", number: 39, age: "2d", label: "Needs label" },
      ],
    },
    contributors: [
      { initials: "NS", name: "Nico Simoncini", handle: "@nicosimoncinii", commits: 62, pullRequests: 14, lastActive: "18 min ago" },
      { initials: "AM", name: "Ari Moretti", handle: "@arimoretti", commits: 38, pullRequests: 8, lastActive: "2 hours ago" },
      { initials: "JT", name: "Jamie Tan", handle: "@jamietan", commits: 27, pullRequests: 6, lastActive: "Yesterday" },
      { initials: "LP", name: "Luca Park", handle: "@lucapark", commits: 19, pullRequests: 3, lastActive: "2 days ago" },
    ],
    activity: [
      { kind: "pull", title: "feat(frontend): add repository shell", detail: "Pull request #48 merged into main", time: "18 min ago" },
      { kind: "commit", title: "docs: refine GitHub App permissions", detail: "3 commits pushed by nicosimoncinii", time: "1 hour ago" },
      { kind: "issue", title: "Define sync retry behavior", detail: "Issue #44 opened by arimoretti", time: "3 hours ago" },
      { kind: "pull", title: "fix(api): normalize repository names", detail: "Pull request #43 approved", time: "Yesterday" },
    ],
  },
  {
    slug: "acme/api-platform",
    owner: "acme",
    name: "api-platform",
    description: "Shared APIs and developer tooling for the Acme platform.",
    visibility: "Private",
    branch: "main",
    language: "Python",
    activityScale: 1.45,
    metrics: { commits: 247, contributors: 12, mergedPulls: 38, openIssues: 21 },
    attention: { reviews: 5, oldestReview: "31 hours", untriaged: 7, mergeImprovement: 6 },
    pullRequests: {
      merged: 38,
      open: 11,
      median: "9h 12m",
      queue: [
        { title: "Rotate installation tokens", number: 812, age: "31h", status: "Waiting for review" },
        { title: "Add organization audit events", number: 810, age: "22h", status: "2 reviewers assigned" },
        { title: "Improve pagination telemetry", number: 806, age: "14h", status: "Waiting for review" },
      ],
    },
    issues: {
      closed: 28,
      opened: 24,
      backlog: 21,
      queue: [
        { title: "Rate limit spikes during nightly sync", number: 809, age: "2h", label: "Needs priority" },
        { title: "Installation callback timeout", number: 803, age: "8h", label: "Needs owner" },
        { title: "Audit log timezone mismatch", number: 798, age: "2d", label: "Needs label" },
      ],
    },
    contributors: [
      { initials: "MD", name: "Maya Diaz", handle: "@mayadiaz", commits: 74, pullRequests: 17, lastActive: "7 min ago" },
      { initials: "RK", name: "Rowan Kim", handle: "@rowankim", commits: 55, pullRequests: 11, lastActive: "42 min ago" },
      { initials: "SG", name: "Sam Green", handle: "@samgreen", commits: 41, pullRequests: 8, lastActive: "4 hours ago" },
      { initials: "AP", name: "Avery Patel", handle: "@averyp", commits: 33, pullRequests: 6, lastActive: "Yesterday" },
    ],
    activity: [
      { kind: "commit", title: "feat(auth): rotate installation tokens", detail: "5 commits pushed by mayadiaz", time: "7 min ago" },
      { kind: "pull", title: "Add organization audit events", detail: "Pull request #812 merged into main", time: "42 min ago" },
      { kind: "issue", title: "Rate limit spikes during nightly sync", detail: "Issue #809 assigned to rowankim", time: "2 hours ago" },
      { kind: "pull", title: "Improve pagination telemetry", detail: "Pull request #806 approved", time: "Yesterday" },
    ],
  },
  {
    slug: "acme/design-system",
    owner: "acme",
    name: "design-system",
    description: "Reusable components, tokens, and product foundations.",
    visibility: "Private",
    branch: "trunk",
    language: "TypeScript",
    activityScale: 0.72,
    metrics: { commits: 126, contributors: 6, mergedPulls: 22, openIssues: 9 },
    attention: { reviews: 2, oldestReview: "17 hours", untriaged: 3, mergeImprovement: 14 },
    pullRequests: {
      merged: 22,
      open: 4,
      median: "4h 48m",
      queue: [
        { title: "Add compact density tokens", number: 194, age: "17h", status: "Waiting for review" },
        { title: "Fix segmented control focus order", number: 189, age: "8h", status: "1 reviewer assigned" },
        { title: "Document accessible tooltips", number: 187, age: "5h", status: "Waiting for review" },
      ],
    },
    issues: {
      closed: 16,
      opened: 11,
      backlog: 9,
      queue: [
        { title: "Tooltip contrast in high contrast mode", number: 191, age: "1d", label: "Needs owner" },
        { title: "Audit token naming conventions", number: 186, age: "2d", label: "Needs priority" },
        { title: "Document focus ring requirements", number: 182, age: "3d", label: "Needs label" },
      ],
    },
    contributors: [
      { initials: "ES", name: "Elena Silva", handle: "@elenasilva", commits: 48, pullRequests: 12, lastActive: "31 min ago" },
      { initials: "NB", name: "Noah Brown", handle: "@noahbrown", commits: 29, pullRequests: 5, lastActive: "3 hours ago" },
      { initials: "IK", name: "Imani King", handle: "@imanik", commits: 21, pullRequests: 4, lastActive: "Yesterday" },
      { initials: "TH", name: "Theo Hall", handle: "@theoh", commits: 12, pullRequests: 2, lastActive: "3 days ago" },
    ],
    activity: [
      { kind: "pull", title: "feat(tokens): add compact density scale", detail: "Pull request #194 merged into trunk", time: "31 min ago" },
      { kind: "commit", title: "docs: add keyboard navigation examples", detail: "2 commits pushed by noahbrown", time: "3 hours ago" },
      { kind: "issue", title: "Tooltip contrast in high contrast mode", detail: "Issue #191 opened by imanik", time: "Yesterday" },
      { kind: "pull", title: "Fix segmented control focus order", detail: "Pull request #189 approved", time: "2 days ago" },
    ],
  },
];

const ranges: Record<RangeKey, { label: string; factor: number; change: number; points: string[]; values: number[] }> = {
  "7D": { label: "Last 7 days", factor: 0.24, change: 8, points: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [8, 14, 10, 18, 25, 7, 12] },
  "30D": { label: "Last 30 days", factor: 1, change: 18, points: ["Jul 14", "Jul 18", "Jul 22", "Jul 26", "Jul 30", "Aug 3", "Aug 7", "Aug 11"], values: [36, 44, 38, 61, 53, 72, 64, 81] },
  "90D": { label: "Last 90 days", factor: 2.8, change: 12, points: ["May 19", "Jun 2", "Jun 16", "Jun 30", "Jul 14", "Jul 28", "Aug 11"], values: [47, 55, 62, 51, 73, 69, 84] },
  "1Y": { label: "Last 12 months", factor: 10.5, change: 34, points: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"], values: [42, 38, 51, 45, 57, 63, 59, 71, 68, 77, 82, 91] },
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function normalizeSeries(values: number[], total: number) {
  if (total <= 0) return values.map(() => 0);
  const sourceTotal = values.reduce((sum, value) => sum + value, 0);
  const raw = values.map((value) => (value / sourceTotal) * total);
  const normalized = raw.map((value) => Math.floor(value));
  const remainderOrder = raw
    .map((value, index) => ({ index, fraction: value - normalized[index] }))
    .sort((a, b) => b.fraction - a.fraction);
  let remaining = total - normalized.reduce((sum, value) => sum + value, 0);
  for (let index = 0; remaining > 0; index += 1, remaining -= 1) {
    normalized[remainderOrder[index % remainderOrder.length].index] += 1;
  }
  return normalized;
}

type Insight = {
  id: "review" | "triage" | "velocity";
  tone: "critical" | "warning" | "positive";
  eyebrow: string;
  title: string;
  signal: string;
  summary: string;
  impact: string;
  action: string;
  target: "pull-requests" | "issues";
  cta: string;
  icon: LucideIcon;
};

export default function Home() {
  const [repositorySlug, setRepositorySlug] = useState(repositories[0].slug);
  const [range, setRange] = useState<RangeKey>("30D");
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSynced, setLastSynced] = useState("2 min ago");
  const [notice, setNotice] = useState("");
  const [expandedInsight, setExpandedInsight] = useState<Insight["id"] | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const setupModalRef = useRef<HTMLElement>(null);
  const modalReturnFocusRef = useRef<HTMLElement | null>(null);

  const repository = repositories.find((item) => item.slug === repositorySlug) ?? repositories[0];
  const selectedRange = ranges[range];

  const metrics = useMemo(() => ({
    commits: Math.max(1, Math.round(repository.metrics.commits * selectedRange.factor)),
    contributors: Math.max(1, Math.round(repository.metrics.contributors * Math.min(1, selectedRange.factor + 0.15))),
    mergedPulls: Math.max(1, Math.round(repository.metrics.mergedPulls * selectedRange.factor)),
    openIssues: repository.metrics.openIssues,
  }), [repository, selectedRange.factor]);

  const activityValues = useMemo(
    () => normalizeSeries(selectedRange.values.map((value) => value * repository.activityScale), metrics.commits),
    [metrics.commits, repository.activityScale, selectedRange.values],
  );
  const mergedValues = useMemo(
    () => normalizeSeries(selectedRange.values.map((value, index) => value * (0.72 + (index % 3) * 0.08)), metrics.mergedPulls),
    [metrics.mergedPulls, selectedRange.values],
  );
  const chartTotal = activityValues.reduce((sum, value) => sum + value, 0);
  const chartMaximum = Math.max(10, Math.ceil(Math.max(...activityValues) / 10) * 10);
  const chartAverage = Math.round(activityValues.reduce((sum, value) => sum + value, 0) / activityValues.length);
  const chartTicks = [chartMaximum, Math.round(chartMaximum * 0.75), Math.round(chartMaximum * 0.5), Math.round(chartMaximum * 0.25), 0];
  const visibleContributors = repository.contributors.map((contributor) => ({
    ...contributor,
    commits: Math.max(0, Math.round(contributor.commits * selectedRange.factor)),
    pullRequests: Math.max(0, Math.round(contributor.pullRequests * selectedRange.factor)),
  }));
  const visibleContributorTotal = visibleContributors.reduce((sum, contributor) => sum + contributor.commits, 0);
  const topContributorShare = visibleContributorTotal > 0 ? Math.round((visibleContributors[0].commits / visibleContributorTotal) * 100) : 0;
  const periodIssues = {
    closed: Math.max(0, Math.round(repository.issues.closed * selectedRange.factor)),
    opened: Math.max(0, Math.round(repository.issues.opened * selectedRange.factor)),
  };

  const navigation: Array<{ id: string; label: string; icon: LucideIcon; badge?: number }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "insights", label: "Insights", icon: Lightbulb, badge: 3 },
    { id: "pull-requests", label: "Pull requests", icon: GitPullRequest, badge: repository.pullRequests.open },
    { id: "issues", label: "Issues", icon: CircleDot, badge: repository.issues.backlog },
    { id: "contributors", label: "Contributors", icon: UsersRound },
  ];

  const insights: Insight[] = [
    {
      id: "review",
      tone: "critical",
      eyebrow: "High priority",
      title: `${repository.attention.reviews} pull requests need review`,
      signal: `Oldest waiting ${repository.attention.oldestReview}`,
      summary: `${repository.attention.reviews} pull requests are waiting for feedback. The oldest has been idle for ${repository.attention.oldestReview}.`,
      impact: "Long waits delay delivery and make authors recover lost context.",
      action: `Assign a reviewer, starting with #${repository.pullRequests.queue[0].number}.`,
      target: "pull-requests",
      cta: "Inspect review queue",
      icon: GitPullRequest,
    },
    {
      id: "triage",
      tone: "warning",
      eyebrow: "Needs attention",
      title: `${repository.attention.untriaged} issues need triage`,
      signal: "Owner or priority missing",
      summary: `${repository.attention.untriaged} of ${repository.metrics.openIssues} open issues still need an owner, priority, or label.`,
      impact: "Untriaged work makes planning less reliable and lets stale issues accumulate.",
      action: "Complete ownership and priority before the next planning session.",
      target: "issues",
      cta: "Open triage queue",
      icon: CircleDot,
    },
    {
      id: "velocity",
      tone: "positive",
      eyebrow: "Positive trend",
      title: `Merge time improved ${repository.attention.mergeImprovement}%`,
      signal: `Median ${repository.pullRequests.median}`,
      summary: `Pull requests are merging ${repository.attention.mergeImprovement}% faster than in the previous period.`,
      impact: "Shorter feedback loops reduce work in progress and context switching.",
      action: "Compare recently merged work and document the review pattern that worked.",
      target: "pull-requests",
      cta: "Review merge flow",
      icon: TrendingUp,
    },
  ];

  const metricCards: Array<{
    label: string;
    value: string;
    trend: string;
    tone: "positive" | "neutral" | "warning";
    target: string;
    icon: LucideIcon;
    series: number[];
  }> = [
    {
      label: "Commits",
      value: formatNumber(metrics.commits),
      trend: `${selectedRange.change}% more than the previous period`,
      tone: "positive",
      target: "activity",
      icon: GitCommitHorizontal,
      series: activityValues,
    },
    {
      label: "Active contributors",
      value: String(metrics.contributors),
      trend: `${Math.max(1, Math.round(metrics.contributors * 0.25))} more people active`,
      tone: "positive",
      target: "contributors",
      icon: UsersRound,
      series: activityValues.map((_, index) => Math.max(1, Math.round(metrics.contributors * (0.55 + index / Math.max(10, activityValues.length * 2.2))))),
    },
    {
      label: "Merged pull requests",
      value: formatNumber(metrics.mergedPulls),
      trend: `${Math.max(4, Math.round(selectedRange.change * 0.78))}% more than the previous period`,
      tone: "positive",
      target: "pull-requests",
      icon: GitPullRequest,
      series: mergedValues,
    },
    {
      label: "Open issues",
      value: String(metrics.openIssues),
      trend: `${repository.attention.untriaged} still need triage`,
      tone: "warning",
      target: "issues",
      icon: CircleDot,
      series: activityValues.map((_, index) => Math.max(1, metrics.openIssues + Math.round((activityValues.length - index - 1) * 0.55) + (index % 3 === 0 ? 1 : 0))),
    },
  ];

  useEffect(() => {
    if (!syncing) return;
    const progressTimer = window.setInterval(() => setSyncProgress((current) => Math.min(current + 13, 92)), 260);
    const finishTimer = window.setTimeout(() => {
      setSyncing(false);
      setSyncProgress(100);
      setLastSynced("just now");
      setNotice(`${repository.name} data is up to date`);
    }, 2200);
    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(finishTimer);
    };
  }, [syncing, repository.name]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const sectionIds = ["overview", "insights", "activity", "pull-requests", "issues", "contributors"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -65%", threshold: [0.05, 0.2, 0.5] },
    );
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = setupOpen || mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [setupOpen, mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const sidebar = sidebarRef.current;
    sidebar?.querySelector<HTMLElement>("button, select, a[href]")?.focus();

    const handleMenuKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !sidebar) return;
      const focusable = Array.from(sidebar.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };

    document.addEventListener("keydown", handleMenuKeys);
    return () => {
      document.removeEventListener("keydown", handleMenuKeys);
      previousFocus?.focus();
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!setupOpen) return;
    const dialog = setupModalRef.current;
    dialog?.focus();

    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSetupOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) { event.preventDefault(); dialog.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === dialog) { event.preventDefault(); last.focus(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };

    document.addEventListener("keydown", handleDialogKeys);
    return () => {
      document.removeEventListener("keydown", handleDialogKeys);
      window.setTimeout(() => modalReturnFocusRef.current?.focus(), 0);
    };
  }, [setupOpen]);

  const startSync = () => {
    if (syncing) return;
    setSyncProgress(9);
    setSyncing(true);
    setNotice("");
  };

  const chooseRepository = (slug: string) => {
    setRepositorySlug(slug);
    setLastSynced("2 min ago");
    setMobileMenuOpen(false);
  };

  const followAnchor = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    window.setTimeout(() => document.getElementById(id)?.focus({ preventScroll: true }), 0);
  };

  const openSetup = () => {
    modalReturnFocusRef.current = mobileMenuOpen ? menuButtonRef.current : document.activeElement as HTMLElement | null;
    setMobileMenuOpen(false);
    setSetupStep(1);
    setSetupOpen(true);
  };

  const skipToContent = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const main = document.getElementById("main-content");
    main?.focus();
    main?.scrollIntoView({ block: "start" });
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content" onClick={skipToContent}>Skip to repository overview</a>

      <aside ref={sidebarRef} id="primary-navigation" className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`} aria-label="Primary navigation">
        <div className="sidebar-header">
          <a className="brand" href="#overview" onClick={() => followAnchor("overview")} aria-label="DevInsight overview">
            <span className="brand-mark" aria-hidden="true">D/</span>
            <span>DevInsight</span>
          </a>
          <button className="icon-button sidebar-close" type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation"><X size={20} /></button>
        </div>

        <div className="repo-switcher">
          <label htmlFor="repository">Current repository</label>
          <div className="select-control">
            <GitBranch size={17} aria-hidden="true" />
            <select id="repository" value={repositorySlug} onChange={(event) => chooseRepository(event.target.value)}>
              {repositories.map((item) => <option key={item.slug} value={item.slug}>{item.slug}</option>)}
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </div>
        </div>

        <nav className="main-nav" aria-label="Repository sections">
          <p className="nav-group-label">Repository</p>
          {navigation.map(({ id, label, icon: Icon, badge }) => (
            <a key={id} className={`nav-item ${activeSection === id ? "active" : ""}`} href={`#${id}`} onClick={() => followAnchor(id)} aria-current={activeSection === id ? "location" : undefined}>
              <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
              <span>{label}</span>
              {badge !== undefined && <span className="nav-badge">{badge}</span>}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="manage-repositories" type="button" onClick={openSetup}>
            <Plus size={18} aria-hidden="true" />
            Manage repositories
          </button>
          <div className="account-summary">
            <span className="connection-dot" aria-hidden="true" />
            <span><strong>GitHub connected</strong><small>@nicosimoncinii</small></span>
            <Github size={18} aria-hidden="true" />
          </div>
        </div>
      </aside>

      {mobileMenuOpen && <button className="menu-scrim" type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} />}

      <div className="workspace">
        <header className="mobile-topbar">
          <button ref={menuButtonRef} className="icon-button menu-button" type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation" aria-controls="primary-navigation" aria-expanded={mobileMenuOpen}><Menu size={20} /></button>
          <a className="mobile-brand" href="#overview" onClick={() => followAnchor("overview")}><span>D/</span> DevInsight</a>
          <span className="demo-badge">Demo</span>
        </header>

        <main id="main-content" className="main-content" tabIndex={-1}>
          <section id="overview" className="repository-overview" aria-labelledby="repository-title" tabIndex={-1}>
            <header className="repository-header">
              <div className="repository-heading-copy">
                <div className="title-row">
                  <h1 id="repository-title"><span>{repository.owner}</span> / {repository.name}</h1>
                  <span className="visibility-badge">{repository.visibility === "Private" ? <LockKeyhole size={13} aria-hidden="true" /> : <Github size={13} aria-hidden="true" />}{repository.visibility}</span>
                </div>
                <p>{repository.description}</p>
                <div className="repository-meta">
                  <span><i className="language-dot" aria-hidden="true" />{repository.language}</span>
                  <span><GitBranch size={14} aria-hidden="true" />{repository.branch}</span>
                  <span className="fresh-meta"><CheckCircle2 size={14} aria-hidden="true" />Up to date · synced {lastSynced}</span>
                </div>
              </div>
              <div className="header-controls">
                <div className="range-control" role="group" aria-label="Analytics period">
                  {(Object.keys(ranges) as RangeKey[]).map((item) => (
                    <button key={item} type="button" className={range === item ? "selected" : ""} aria-pressed={range === item} onClick={() => setRange(item)}>{item}</button>
                  ))}
                </div>
                <button className="button-primary" type="button" onClick={startSync} disabled={syncing}>
                  <RefreshCw size={17} className={syncing ? "spinning" : ""} aria-hidden="true" />
                  {syncing ? `Syncing ${syncProgress}%` : "Sync now"}
                </button>
              </div>
            </header>

            <div className="metrics-grid">
              {metricCards.map(({ label, value, trend, tone, target, icon: Icon, series }) => {
                const seriesMaximum = Math.max(...series);
                return (
                  <a className="metric-card" href={`#${target}`} onClick={() => followAnchor(target)} key={label}>
                    <span className="metric-card-heading"><span className="metric-icon"><Icon size={18} aria-hidden="true" /></span>{label}<ChevronRight size={16} aria-hidden="true" /></span>
                    <strong>{value}</strong>
                    <span className={`metric-trend ${tone}`}>{tone === "warning" ? <AlertTriangle size={14} aria-hidden="true" /> : <ArrowUpRight size={14} aria-hidden="true" />}{trend}</span>
                    <span className="spark-bars" aria-hidden="true">{series.map((point, index) => <i key={`${label}-${index}`} style={{ "--spark-height": `${Math.max(18, (point / seriesMaximum) * 100)}%` } as CSSProperties} />)}</span>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="overview-grid" aria-label="Repository summary">
            <article id="activity" className="panel activity-panel" aria-labelledby="activity-title" tabIndex={-1}>
              <div className="panel-header">
                <div><span>Development activity</span><h2 id="activity-title">Repository activity</h2><p>Commits and merged pull requests across {selectedRange.label.toLowerCase()}.</p></div>
                <div className="chart-total"><strong>{formatNumber(chartTotal)}</strong><span>commits</span><small>+{selectedRange.change}%</small></div>
              </div>
              <div className="chart-legend"><span><i className="legend-bars" />Commits</span><span><i className="legend-merged" />Merged PRs</span><span><i className="legend-average" />Average {chartAverage}</span></div>
              <div className="chart-scroll">
                <div className="chart-body" aria-hidden="true">
                  <div className="y-axis">{chartTicks.map((tick, index) => <span key={`${tick}-${index}`} style={{ "--tick-position": `${index * 25}%` } as CSSProperties}>{tick}</span>)}</div>
                  <div className="plot-surface">
                    {chartTicks.map((tick, index) => <i className="chart-grid-line" key={`${tick}-${index}`} style={{ "--tick-position": `${index * 25}%` } as CSSProperties} />)}
                    <div className="average-line" style={{ "--average-position": `${100 - (chartAverage / chartMaximum) * 100}%` } as CSSProperties}><span>Avg {chartAverage}</span></div>
                    <div className="plot-columns" style={{ "--columns": activityValues.length } as CSSProperties}>
                      {activityValues.map((value, index) => (
                        <div className="chart-column" key={`${selectedRange.points[index]}-${value}`} title={`${selectedRange.points[index]}: ${value} commits, ${mergedValues[index]} merged pull requests`} style={{ "--commit-height": `${Math.max(8, (value / chartMaximum) * 100)}%`, "--merge-height": `${Math.max(5, (mergedValues[index] / chartMaximum) * 100)}%` } as CSSProperties}>
                          <span className="bar-number">{value}</span>
                          <div className="bar-pair">
                            <i className="chart-bar commits" />
                            <i className="chart-bar merged" />
                          </div>
                          <span className="bar-label">{selectedRange.points[index]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="chart-insight"><TrendingUp size={17} aria-hidden="true" /><span><strong>Commit volume is {selectedRange.change}% higher.</strong> {repository.attention.reviews} pull requests are still waiting for review, including one for {repository.attention.oldestReview}.</span></p>
              <table className="sr-only"><caption>Repository activity for {selectedRange.label}</caption><thead><tr><th>Period</th><th>Commits</th><th>Merged pull requests</th></tr></thead><tbody>{activityValues.map((value, index) => <tr key={selectedRange.points[index]}><td>{selectedRange.points[index]}</td><td>{value}</td><td>{mergedValues[index]}</td></tr>)}</tbody></table>
            </article>

            <div className="overview-side">
              <article className="panel freshness-panel" aria-labelledby="freshness-title">
                <div className="freshness-heading"><span className="freshness-icon"><ShieldCheck size={22} aria-hidden="true" /></span><div><span>Data freshness</span><h2 id="freshness-title">All data is current</h2></div><span className="status-label"><i />Up to date</span></div>
                <dl><div><dt>Source</dt><dd>GitHub App</dd></div><div><dt>Default branch</dt><dd>{repository.branch}</dd></div><div><dt>Import mode</dt><dd>Manual</dd></div><div><dt>Last sync</dt><dd>{lastSynced}</dd></div></dl>
              </article>

              <article id="insights" className="panel insights-panel" aria-labelledby="insights-title" tabIndex={-1}>
                <div className="panel-header compact"><div><span>Prioritized signals</span><h2 id="insights-title">Insights & actions</h2><p>Open a signal for evidence and next steps.</p></div><span className="section-count">3</span></div>
                <div className="insight-list">
                  {insights.map(({ id, tone, eyebrow, title, signal, summary, impact, action, target, cta, icon: Icon }) => {
                    const expanded = expandedInsight === id;
                    return (
                      <div className={`insight-item ${tone}`} key={id}>
                        <button id={`insight-trigger-${id}`} type="button" aria-expanded={expanded} aria-controls={`insight-panel-${id}`} onClick={() => setExpandedInsight(expanded ? null : id)}>
                          <span className="insight-icon"><Icon size={17} aria-hidden="true" /></span>
                          <span className="insight-copy"><small>{eyebrow}</small><strong>{title}</strong><span>{signal}</span></span>
                          <ChevronDown size={17} className={expanded ? "rotated" : ""} aria-hidden="true" />
                        </button>
                        <div id={`insight-panel-${id}`} className="insight-expansion" role="region" aria-labelledby={`insight-trigger-${id}`} hidden={!expanded}>
                          <p>{summary}</p>
                          <dl><div><dt>Why it matters</dt><dd>{impact}</dd></div><div><dt>Recommended action</dt><dd>{action}</dd></div></dl>
                          <a href={`#${target}`} onClick={() => followAnchor(target)}>{cta}<ArrowRight size={15} aria-hidden="true" /></a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>
          </section>

          <div className="detail-divider"><span>Explore the details</span><p>Continue scrolling or use the overview signals to jump to a specific workflow.</p></div>

          <section id="pull-requests" className="detail-section" aria-labelledby="pull-title" tabIndex={-1}>
            <div className="detail-section-header"><div><span>Delivery flow</span><h2 id="pull-title">Pull request performance</h2><p>Unblock reviews while preserving the faster merge pattern.</p></div><span className="count-badge warning">{repository.pullRequests.open} open</span></div>
            <div className="evidence-grid">
              <article className="evidence-card critical"><span><AlertTriangle size={18} aria-hidden="true" />Review bottleneck</span><strong>{repository.attention.reviews} waiting</strong><p>The oldest pull request has waited {repository.attention.oldestReview} for feedback.</p><dl><div><dt>Why it matters</dt><dd>Waiting interrupts delivery and increases context switching.</dd></div><div><dt>Next action</dt><dd>Assign a reviewer to #{repository.pullRequests.queue[0].number} first.</dd></div></dl></article>
              <article className="evidence-card positive"><span><Sparkles size={18} aria-hidden="true" />Healthy pattern</span><strong>{repository.pullRequests.median} median</strong><p>Merge time improved {repository.attention.mergeImprovement}% compared with the previous period.</p><dl><div><dt>Why it matters</dt><dd>Shorter loops reduce work in progress.</dd></div><div><dt>Next action</dt><dd>Document the review pattern behind recent fast merges.</dd></div></dl></article>
            </div>
            <article className="panel queue-panel">
              <div className="panel-header compact"><div><span>Action queue</span><h3>Pull requests to review</h3></div><span className="period-label">Oldest first</span></div>
              <div className="performance-summary"><div><span>Merged in period</span><strong>{metrics.mergedPulls}</strong></div><div><span>Current median merge time</span><strong>{repository.pullRequests.median}</strong></div><div><span>Waiting for review now</span><strong>{repository.attention.reviews}</strong></div></div>
              <ol className="queue-list">{repository.pullRequests.queue.map((item) => <li key={item.number}><span className="queue-icon"><GitPullRequest size={17} aria-hidden="true" /></span><div><strong>{item.title}</strong><p>#{item.number} <span /> {item.status}</p></div><time>{item.age}</time></li>)}</ol>
            </article>
          </section>

          <section id="issues" className="detail-section" aria-labelledby="issues-title" tabIndex={-1}>
            <div className="detail-section-header"><div><span>Planning hygiene</span><h2 id="issues-title">Issue triage</h2><p>Restore ownership and priority before the next planning session.</p></div><span className="count-badge neutral">{repository.issues.backlog} open</span></div>
            <div className="issue-detail-grid">
              <article className="evidence-card warning"><span><CircleDot size={18} aria-hidden="true" />Triage risk</span><strong>{repository.attention.untriaged} need attention</strong><p>{repository.attention.untriaged} of {repository.metrics.openIssues} open issues are missing an owner, priority, or label.</p><dl><div><dt>Why it matters</dt><dd>Unclear work makes planning less reliable.</dd></div><div><dt>Next action</dt><dd>Complete ownership and priority before planning.</dd></div></dl></article>
              <article className="panel queue-panel">
                <div className="panel-header compact"><div><span>Action queue</span><h3>Issues to triage</h3></div><span className="period-label">Needs metadata</span></div>
                <div className="performance-summary"><div><span>Closed in period</span><strong>{periodIssues.closed}</strong></div><div><span>Opened in period</span><strong>{periodIssues.opened}</strong></div><div><span>Needs triage now</span><strong>{repository.attention.untriaged}</strong></div></div>
                <ol className="queue-list issue-queue">{repository.issues.queue.map((item) => <li key={item.number}><span className="queue-icon"><CircleDot size={17} aria-hidden="true" /></span><div><strong>{item.title}</strong><p>#{item.number} <span /> {item.label}</p></div><time>{item.age}</time></li>)}</ol>
              </article>
            </div>
          </section>

          <section id="contributors" className="detail-section" aria-labelledby="contributors-title" tabIndex={-1}>
            <div className="detail-section-header"><div><span>Team context</span><h2 id="contributors-title">Contributor activity</h2><p>Understand participation without turning activity volume into a performance score.</p></div><span className="period-label">{selectedRange.label}</span></div>
            <div className="contributors-grid">
              <article className="panel concentration-panel">
                <div className="panel-header compact"><div><span>Ownership distribution</span><h3>Contribution concentration</h3></div><Info size={17} aria-label="Commit share is context, not an individual performance score" /></div>
                <div className="concentration-summary"><strong>{topContributorShare}%</strong><span>of listed commits come from the top contributor</span></div>
                <ol className="contributor-bars">{visibleContributors.map((person) => { const share = visibleContributorTotal > 0 ? Math.round((person.commits / visibleContributorTotal) * 100) : 0; return <li key={person.handle}><span className="contributor-avatar">{person.initials}</span><span className="bar-person"><strong>{person.name}</strong><i><b style={{ width: `${share}%` }} /></i></span><span>{share}%</span></li>; })}</ol>
              </article>
              <article className="panel contributors-panel">
                <div className="panel-header compact"><div><span>Contributor detail</span><h3>Activity by contributor</h3></div><span className="period-label">{selectedRange.label}</span></div>
                <div className="table-scroll"><table className="data-table"><thead><tr><th>Contributor</th><th>Commits</th><th>Merged PRs</th><th>Last active</th></tr></thead><tbody>{visibleContributors.map((person) => <tr key={person.handle}><td><span className="contributor"><i>{person.initials}</i><span><strong>{person.name}</strong><small>{person.handle}</small></span></span></td><td className="number-cell">{person.commits}</td><td className="number-cell">{person.pullRequests}</td><td>{person.lastActive}</td></tr>)}</tbody></table></div>
              </article>
            </div>
          </section>

          <section className="panel recent-panel" aria-labelledby="recent-title">
            <div className="panel-header compact"><div><span>Repository timeline</span><h2 id="recent-title">Recent activity</h2></div><span className="fresh-indicator"><i />Live context</span></div>
            <ol className="activity-list">{repository.activity.map((item, index) => <li key={`${item.title}-${index}`}><span className={`activity-kind ${item.kind}`}>{item.kind === "pull" ? <GitPullRequest size={16} aria-hidden="true" /> : item.kind === "issue" ? <CircleDot size={16} aria-hidden="true" /> : <GitBranch size={16} aria-hidden="true" />}</span><div><strong>{item.title}</strong><p>{item.detail}</p><time>{item.time}</time></div></li>)}</ol>
          </section>
        </main>
      </div>

      {setupOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSetupOpen(false); }}>
          <section ref={setupModalRef} className="setup-modal" role="dialog" aria-modal="true" aria-labelledby="setup-title" tabIndex={-1}>
            <div className="modal-header"><div><span>Repository setup</span><h2 id="setup-title">Connect repositories</h2></div><button className="icon-button" type="button" onClick={() => setSetupOpen(false)} aria-label="Close setup"><X size={20} /></button></div>
            <ol className="setup-steps" aria-label="Setup progress">{["GitHub account", "Permissions", "Repositories"].map((label, index) => <li key={label} className={setupStep === index + 1 ? "current" : setupStep > index + 1 ? "complete" : ""}><span>{setupStep > index + 1 ? <Check size={15} /> : index + 1}</span>{label}</li>)}</ol>

            {setupStep === 1 && <div className="setup-body"><div className="connection-card"><span className="large-avatar">NS</span><div><strong>nicosimoncinii</strong><p>GitHub account connected</p></div><span className="verified-label"><CheckCircle2 size={15} />Verified</span></div><p className="setup-copy">DevInsight uses a GitHub App. Access stays limited to repositories you select and can be revoked at any time.</p></div>}
            {setupStep === 2 && <div className="setup-body"><h3>Review read-only access</h3><p className="setup-copy">Only the data needed for repository analytics is requested.</p><ul className="permission-list"><li><span><GitBranch size={18} /></span><div><strong>Repository metadata and code</strong><p>Read commit history, branches, and contributor activity.</p></div></li><li><span><GitPullRequest size={18} /></span><div><strong>Pull requests and issues</strong><p>Read lifecycle events, reviews, labels, and state.</p></div></li><li><span><LockKeyhole size={18} /></span><div><strong>No write permission</strong><p>DevInsight cannot edit code, issues, or repository settings.</p></div></li></ul></div>}
            {setupStep === 3 && <div className="setup-body"><h3>Select repositories</h3><p className="setup-copy">Choose which repositories DevInsight should import.</p><div className="repository-options"><label htmlFor="repo-portfolio" aria-label="Select nicosimoncinii portfolio"><input id="repo-portfolio" type="checkbox" defaultChecked /><span><strong>nicosimoncinii/portfolio</strong><small>Public - TypeScript</small></span></label><label htmlFor="repo-learning" aria-label="Select nicosimoncinii learning lab"><input id="repo-learning" type="checkbox" defaultChecked /><span><strong>nicosimoncinii/learning-lab</strong><small>Private - Python</small></span></label><label htmlFor="repo-internal" aria-label="Select acme internal tools"><input id="repo-internal" type="checkbox" /><span><strong>acme/internal-tools</strong><small>Private - TypeScript</small></span></label></div></div>}

            <div className="modal-footer"><button className="button-secondary" type="button" onClick={() => setupStep === 1 ? setSetupOpen(false) : setSetupStep((step) => step - 1)}>{setupStep === 1 ? "Cancel" : "Back"}</button><button className="button-primary" type="button" onClick={() => { if (setupStep < 3) setSetupStep((step) => step + 1); else { setSetupOpen(false); setNotice("2 repositories queued for their first import"); } }}>{setupStep === 1 ? "Continue" : setupStep === 2 ? "Approve read-only access" : "Import 2 repositories"}<ArrowRight size={17} /></button></div>
          </section>
        </div>
      )}

      {notice && <div className="toast" role="status"><CheckCircle2 size={18} />{notice}</div>}
    </div>
  );
}
