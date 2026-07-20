import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set a new password — NFS Music Academy" }, { name: "robots", content: "noindex" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. Please log in.");
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { mode: "login" } });
  };
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h1 className="font-display text-2xl font-bold">Set a new password</h1>
        <p className="text-sm text-muted-foreground">Choose a new password for your account.</p>
        <div><Label htmlFor="np">New password</Label><Input id="np" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" /></div>
        <Button type="submit" disabled={loading} className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90">{loading ? "Updating…" : "Update password"}</Button>
      </form>
    </div>
  );
}
