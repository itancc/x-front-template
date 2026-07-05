import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno()],
  shortcuts: {
    // ─── Layout shell ──────────────────────────────────────────
    "app-shell":
      "grid min-h-screen [grid-template-columns:auto_minmax(0,1fr)]",

    // ─── Sidebar ───────────────────────────────────────────────
    "app-sidebar":
      "flex flex-col gap-[18px] w-[280px] px-[14px] py-[18px] border-r border-[var(--app-border)] " +
      "bg-[linear-gradient(180deg,rgba(10,14,25,.92),rgba(12,16,31,.86))] text-slate-100 overflow-hidden",
    "app-sidebar-collapsed": "w-[94px]",

    // ─── Header ────────────────────────────────────────────────
    "app-header":
      "flex justify-between items-center gap-5 px-6 pt-[22px] pb-4 border-b border-[var(--app-border)] " +
      "bg-[rgba(247,250,252,.72)] backdrop-blur-md",

    // ─── App switcher ──────────────────────────────────────────
    "app-switcher":
      "flex items-center gap-3 min-h-[52px] px-[10px] py-2 rounded-[14px] cursor-pointer " +
      "text-slate-100 hover:bg-[rgba(255,255,255,.08)] transition-colors duration-200 select-none",
    "app-switcher-mark":
      "grid place-items-center w-[42px] h-[42px] shrink-0 rounded-[14px] " +
      "bg-[var(--app-gradient-primary)] text-[#04111f] font-extrabold " +
      "shadow-[0_14px_28px_var(--app-accent-ring)]",

    // ─── Nav ───────────────────────────────────────────────────
    "nav-group-title":
      "m-0 mb-[2px] px-3 text-[rgba(148,163,184,.9)] text-[12px] tracking-[.16em] uppercase",
    "nav-item":
      "flex items-center gap-[10px] min-h-[44px] px-[14px] rounded-[14px] " +
      "text-[rgba(226,232,240,.88)] no-underline transition-all duration-200",
    "nav-item-active":
      "text-slate-50 bg-[var(--app-accent-soft)] translate-x-[2px]",

    // ─── Panel / Card ──────────────────────────────────────────
    "panel":
      "border border-[var(--app-border)] rounded-[24px] bg-[var(--app-surface)] " +
      "shadow-[var(--app-shadow)]",
    "panel-head":
      "px-[26px] py-[24px] border-b border-[var(--app-border)]",

    // ─── Table shell ───────────────────────────────────────────
    "table-shell":
      "border border-[var(--app-border)] rounded-[24px] bg-[var(--app-surface)] " +
      "shadow-[var(--app-shadow)]",

    // ─── Buttons ───────────────────────────────────────────────
    "toolbar-btn":
      "min-h-[40px] px-[14px] rounded-full border border-[var(--app-border)] " +
      "bg-[rgba(255,255,255,.78)] text-[var(--app-text-main)] cursor-pointer transition-all duration-200 " +
      "hover:border-[var(--app-accent-ring)] hover:bg-[var(--app-accent-soft)]",
    "toolbar-btn-danger":
      "border-[rgba(248,113,113,.24)] text-[#be123c] hover:bg-[rgba(254,242,242,.9)]",
    "icon-btn":
      "grid place-items-center w-9 h-9 rounded-full border border-[var(--app-border)] " +
      "bg-[rgba(255,255,255,.78)] cursor-pointer transition-all duration-200 " +
      "hover:border-[var(--app-accent-ring)]",
    "action-btn-primary":
      "min-h-[42px] px-4 rounded-full border-0 text-white cursor-pointer " +
      "bg-[linear-gradient(135deg,#0f766e,#14b8a6)] shadow-[0_12px_24px_rgba(20,184,166,.24)] " +
      "transition-transform duration-200 hover:-translate-y-px",
    "action-btn-ghost":
      "min-h-[42px] px-4 rounded-full border border-[var(--app-border)] " +
      "bg-[rgba(255,255,255,.8)] text-[var(--app-text-main)] cursor-pointer transition-all duration-200 " +
      "hover:border-[rgba(20,184,166,.3)] hover:text-[var(--app-accent-strong)] hover:bg-[rgba(20,184,166,.08)]",

    // ─── Form fields ───────────────────────────────────────────
    "field-label":
      "flex flex-col gap-2 text-[var(--app-text-muted)] text-[14px]",
    "field-input":
      "w-full min-h-[44px] px-[14px] border border-[var(--app-border)] rounded-[12px] " +
      "bg-[rgba(255,255,255,.86)] text-[var(--app-text-main)] font-[inherit]",

    // ─── State cards ───────────────────────────────────────────
    "state-card":
      "flex flex-col justify-between px-[18px] py-4 rounded-[20px] " +
      "border border-[var(--app-border)] bg-[linear-gradient(180deg,rgba(255,255,255,.82),rgba(240,253,250,.96))]",
    "state-card-success":
      "bg-[linear-gradient(180deg,rgba(220,252,231,.9),rgba(240,253,250,.96))]",
    "state-card-warning":
      "bg-[linear-gradient(180deg,rgba(254,243,199,.96),rgba(255,251,235,.96))]",

    // ─── Eyebrow / hero text ───────────────────────────────────
    "eyebrow":
      "m-0 text-[var(--app-accent-strong)] text-[13px] tracking-[.18em] uppercase",

    // ─── Route tabs ────────────────────────────────────────────
    "route-tab":
      "inline-flex items-center gap-2 min-h-[36px] px-[14px] border border-[var(--app-border)] " +
      "rounded-full bg-[rgba(255,255,255,.72)] text-[var(--app-text-main)] whitespace-nowrap cursor-pointer",
    "route-tab-active":
      "border-[var(--app-accent-ring)] bg-[linear-gradient(135deg,var(--app-accent-soft),var(--app-accent-soft-strong))] " +
      "text-[var(--app-accent-strong)]",
  },
  rules: [],
});

