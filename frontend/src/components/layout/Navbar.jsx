import {
  Bell,
  Calendar,
  CheckCircle2,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTheme } from "@/hooks/useTheme";

const NOTIFICATIONS = [
  { id: 1, title: "Analysis complete", body: "LRO_NAC_M1097 finished processing.", time: "2m ago" },
  { id: 2, title: "New landing zone", body: "Zone A-3 scored 92 suitability.", time: "1h ago" },
  { id: 3, title: "Report ready", body: "Weekly hazard trend report exported.", time: "Yesterday" },
];

const SEARCHABLE = [
  { label: "Dashboard", to: "/" },
  { label: "Analysis", to: "/analysis" },
  { label: "Image Library", to: "/library" },
  { label: "Reports", to: "/reports" },
  { label: "Settings", to: "/settings" },
];

function Popover({ open, onClose, children, className = "" }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={`absolute right-0 top-full z-50 mt-2 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl ${className}`}
      >
        {children}
      </div>
    </>
  );
}

export function Navbar({ onOpenMobile }) {
  const { isDark, toggle } = useTheme();
  const [open, setOpen] = useState(null); // 'bell' | 'cal' | 'user' | null
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = query.trim()
    ? SEARCHABLE.filter((s) => s.label.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const cells = [
    ...Array(monthStart.getDay()).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <header
      ref={wrapRef}
      className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/60 bg-background/70 px-3 py-3 backdrop-blur md:gap-3 md:px-6 lg:px-8"
    >
      <button
        aria-label="Open menu"
        onClick={onOpenMobile}
        className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative min-w-0 flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search missions, images, reports…"
          className="w-full rounded-xl border border-border/60 bg-card/60 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {results.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl">
            {results.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                onClick={() => setQuery("")}
                className="block px-4 py-2.5 text-sm hover:bg-accent"
              >
                {r.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5 md:gap-2">
        {/* Theme toggle — always visible */}
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="inline-flex rounded-xl border border-border/60 bg-card/60 p-2.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            aria-label="Notifications"
            onClick={() => setOpen(open === "bell" ? null : "bell")}
            className="relative rounded-xl border border-border/60 bg-card/60 p-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          <Popover open={open === "bell"} onClose={() => setOpen(null)} className="w-72">
            <div className="border-b border-border px-4 py-2.5 text-sm font-semibold">
              Notifications
            </div>
            {NOTIFICATIONS.map((n) => (
              <div key={n.id} className="flex gap-3 border-b border-border/50 px-4 py-3 last:border-0">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                </div>
              </div>
            ))}
          </Popover>
        </div>

        {/* Calendar */}
        <div className="relative">
          <button
            aria-label="Calendar"
            onClick={() => setOpen(open === "cal" ? null : "cal")}
            className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:px-3"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">
              {today.toLocaleDateString(undefined, { month: "short", year: "numeric" })}
            </span>
          </button>
          <Popover open={open === "cal"} onClose={() => setOpen(null)} className="w-64 p-3">
            <p className="mb-2 text-sm font-semibold">
              {today.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </p>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
              {cells.map((d, i) => (
                <span
                  key={i}
                  className={`rounded-md py-1 ${
                    d === today.getDate()
                      ? "bg-primary text-primary-foreground font-semibold"
                      : d
                        ? "hover:bg-accent"
                        : ""
                  }`}
                >
                  {d ?? ""}
                </span>
              ))}
            </div>
          </Popover>
        </div>

        {/* Account */}
        <div className="relative">
          <button
            type="button"
            aria-label="Account"
            onClick={() => setOpen(open === "user" ? null : "user")}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground"
          >
            <User className="h-4 w-4" />
          </button>
          <Popover open={open === "user"} onClose={() => setOpen(null)} className="w-56">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">Mission Control</p>
              <p className="text-xs text-muted-foreground">operator@lip.space</p>
            </div>
            <Link
              to="/settings"
              onClick={() => setOpen(null)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent"
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
            <button
              onClick={() => setOpen(null)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-accent"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </Popover>
        </div>
      </div>
    </header>
  );
}
