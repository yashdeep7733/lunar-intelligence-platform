import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  LineChart,
  Images,
  FileText,
  Settings,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  X,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analysis", label: "Analysis", icon: LineChart },
  { to: "/library", label: "Image Library", icon: Images },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          collapsed ? "lg:w-[84px]" : "lg:w-[260px]",
          mobileOpen ? "w-[260px] translate-x-0" : "w-[260px] -translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-6">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 shadow-[var(--shadow-glow)]">
            <Moon className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-lg font-bold leading-none tracking-tight">LIP</div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Lunar Intelligence
              </div>
            </div>
          )}
          <button
            aria-label="Close menu"
            onClick={onCloseMobile}
            className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavItem
              key={to}
              to={to}
              label={label}
              icon={<Icon className="h-4.5 w-4.5" />}
              collapsed={collapsed}
              onClick={onCloseMobile}
            />
          ))}
        </nav>

        {/* Bottom */}
        <div className="space-y-3 border-t border-sidebar-border p-4">
          {!collapsed ? (
            <div className="card-surface rounded-2xl p-4 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div className="mt-3 text-sm font-semibold">Upload Lunar Image</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">PNG, JPG up to 20MB</div>
              <Link
                to="/analysis"
                className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Upload Image
              </Link>
            </div>
          ) : (
            <Link
              to="/analysis"
              className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label="Upload"
            >
              <UploadCloud className="h-4 w-4" />
            </Link>
          )}
          {!collapsed && (
            <div className="text-center text-[11px] text-muted-foreground">
              <div className="font-medium text-foreground/80">LIP v1.0</div>
              <div>AI-Powered Surface Analysis</div>
            </div>
          )}
          <button
            onClick={onToggleCollapsed}
            className="hidden w-full items-center justify-center gap-2 rounded-lg border border-border/60 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:inline-flex"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /> Collapse</>}
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  to,
  label,
  icon,
  collapsed,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  collapsed: boolean;
  onClick: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary/15 text-foreground"
          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 -z-0 rounded-xl ring-1 ring-primary/40"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span className={cn("relative z-10 grid h-8 w-8 place-items-center rounded-lg", active ? "bg-primary text-primary-foreground" : "bg-accent/40")}>
        {icon}
      </span>
      {!collapsed && <span className="relative z-10 truncate">{label}</span>}
    </Link>
  );
}
