import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — NFS Music Academy" }, { name: "robots", content: "noindex" }] }),
  component: Profile,
});

function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).maybeSingle().then(({ data }) => {
      setFullName(data?.full_name ?? "");
      setAvatarUrl(data?.avatar_url ?? "");
    });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, full_name: fullName, avatar_url: avatarUrl });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-brand">Profile settings</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Your profile</h1>
      <form onSubmit={save} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
        <div><Label htmlFor="em">Email</Label><Input id="em" value={user?.email ?? ""} readOnly className="mt-1.5" /></div>
        <div><Label htmlFor="fn">Full name</Label><Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5" /></div>
        <div><Label htmlFor="av">Avatar URL</Label><Input id="av" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="mt-1.5" placeholder="https://…" /></div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">{saving ? "Saving…" : "Save changes"}</Button>
          <Button type="button" variant="outline" className="rounded-full" onClick={() => supabase.auth.signOut()}>Logout</Button>
        </div>
      </form>
    </div>
  );
}
