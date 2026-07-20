import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Music4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

const searchSchema = z.object({ mode: z.enum(["login", "signup", "forgot"]).catch("login") });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Sign in — NFS Music Academy" }, { name: "description", content: "Login or create your free NFS Music Academy account." }] }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>(mode);
  useEffect(() => setTab(mode), [mode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
      <div className="hidden md:block">
        <div className="rounded-3xl border border-border bg-noise p-10">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-brand-foreground"><Music4 className="h-5 w-5" /></span>
          <h2 className="mt-6 font-display text-3xl font-bold">Your musical journey starts here.</h2>
          <p className="mt-3 text-muted-foreground">Track lessons, earn certificates and pick up where you left off — on any device.</p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">
        <Tabs value={tab} onValueChange={(v) => navigate({ to: "/auth", search: { mode: v as "login" | "signup" | "forgot" } })}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="forgot">Forgot</TabsTrigger>
          </TabsList>
          <TabsContent value="login"><LoginForm /></TabsContent>
          <TabsContent value="signup"><SignupForm /></TabsContent>
          <TabsContent value="forgot"><ForgotForm /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function GoogleButton({ label }: { label: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <Button type="button" variant="outline" className="w-full rounded-full" disabled={loading} onClick={async () => {
      setLoading(true);
      const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (res.error) { toast.error(res.error.message ?? "Sign-in failed"); setLoading(false); return; }
      if (res.redirected) return;
      window.location.href = "/dashboard";
    }}>
      <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.29 9.14 5.38 12 5.38z"/></svg>
      {label}
    </Button>
  );
}

function LoginForm() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    window.location.href = "/dashboard";
  };
  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
      <h1 className="font-display text-2xl font-bold">Welcome back</h1>
      <GoogleButton label="Continue with Google" />
      <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div>
      <div><Label htmlFor="e">Email</Label><Input id="e" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
      <div><Label htmlFor="p">Password</Label><Input id="p" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" /></div>
      <Button type="submit" disabled={loading} className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90">{loading ? "Signing in…" : "Login"}</Button>
      <p className="text-center text-sm text-muted-foreground">No account? <Link to="/auth" search={{ mode: "signup" }} className="font-medium text-brand hover:underline">Sign up</Link></p>
    </form>
  );
}

function SignupForm() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: name } },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created!");
    window.location.href = "/dashboard";
  };
  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
      <h1 className="font-display text-2xl font-bold">Create your free account</h1>
      <GoogleButton label="Sign up with Google" />
      <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div>
      <div><Label htmlFor="n">Full name</Label><Input id="n" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
      <div><Label htmlFor="se">Email</Label><Input id="se" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
      <div><Label htmlFor="sp">Password</Label><Input id="sp" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" /></div>
      <Button type="submit" disabled={loading} className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90">{loading ? "Creating…" : "Create Account"}</Button>
    </form>
  );
}

function ForgotForm() {
  const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password reset link sent — check your email.");
  };
  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
      <h1 className="font-display text-2xl font-bold">Reset your password</h1>
      <p className="text-sm text-muted-foreground">Enter the email you signed up with and we'll send a reset link.</p>
      <div><Label htmlFor="fe">Email</Label><Input id="fe" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
      <Button type="submit" disabled={loading} className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90">{loading ? "Sending…" : "Send reset link"}</Button>
    </form>
  );
}
