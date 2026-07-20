import { Link } from "@tanstack/react-router";
import { Menu, Music4, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/instruments", label: "Instruments" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-foreground">
            <Music4 className="h-4 w-4" />
          </span>
          <span>NFS <span className="text-brand">Music</span></span>
        </Link>
        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/dashboard">Dashboard</Link></Button>
              <Button size="sm" variant="outline" onClick={() => supabase.auth.signOut()}>Log out</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/auth" search={{ mode: "login" }}>Login</Link></Button>
              <Button asChild size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90"><Link to="/auth" search={{ mode: "signup" }}>Sign Up</Link></Button>
            </>
          )}
        </div>
        <button className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">{l.label}</Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm" onClick={() => setOpen(false)}><Link to="/dashboard">Dashboard</Link></Button>
                  <Button size="sm" variant="outline" onClick={() => { supabase.auth.signOut(); setOpen(false); }}>Log out</Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" onClick={() => setOpen(false)}><Link to="/auth" search={{ mode: "login" }}>Login</Link></Button>
                  <Button asChild size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90" onClick={() => setOpen(false)}><Link to="/auth" search={{ mode: "signup" }}>Sign Up</Link></Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
