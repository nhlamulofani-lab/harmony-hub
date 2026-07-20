import { Link } from "@tanstack/react-router";
import { Mail, Music4, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-foreground">
              <Music4 className="h-4 w-4" />
            </span>
            NFS Music Academy
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Learn a musical instrument from beginner to advanced with step-by-step lessons crafted by Nhlamulo Fani Sibuyi.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/courses" className="hover:text-foreground">Courses</Link></li>
            <li><Link to="/instruments" className="hover:text-foreground">Instruments</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Get in touch</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 060 841 4467</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> <a href="mailto:nhlamulofani@gmail.com" className="hover:text-foreground">nhlamulofani@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 NFS Music Academy — Created by Nhlamulo Fani Sibuyi</p>
          <p>nhlamulofani@gmail.com · 060 841 4467</p>
        </div>
      </div>
    </footer>
  );
}
