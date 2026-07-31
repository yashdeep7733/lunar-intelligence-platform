import { Bell, Calendar, Menu, Moon, Search, Sun, User } from "lucide-react";
import { useState } from "react";

export function Navbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const [dark, setDark] = useState(true);
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur md:px-6 lg:px-8">
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
          placeholder="Search missions, images, reports…"
          className="w-full rounded-xl border border-border/60 bg-card/60 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle theme"
          className="hidden rounded-xl border border-border/60 bg-card/60 p-2.5 text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          aria-label="Notifications"
          className="relative rounded-xl border border-border/60 bg-card/60 p-2.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <button className="hidden items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex">
          <Calendar className="h-4 w-4" />
          <span>May 6 – May 12, 2026</span>
        </button>
        <button
          aria-label="Profile"
          className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
