import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Send, User } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NFS Music Academy" },
      { name: "description", content: "Get in touch with Nhlamulo Fani Sibuyi at NFS Music Academy." },
      { property: "og:title", content: "Contact — NFS Music Academy" },
      { property: "og:description", content: "Phone, email and contact form for NFS Music Academy." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(1000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = schema.safeParse(form);
    if (!p.success) {
      toast.error(p.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", message: "" });
      toast.success("Message sent — we'll be in touch soon.");
    }, 700);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-brand">Contact</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Let's talk music.</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">Questions about lessons, private tuition or feedback? Reach out and Nhlamulo will get back to you.</p>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand"><User className="h-5 w-5" /></span><div><div className="text-xs text-muted-foreground">Instructor</div><div className="font-display text-lg font-semibold">Nhlamulo Fani Sibuyi</div></div></div>
          </div>
          <a href="tel:+27608414467" className="block rounded-2xl border border-border bg-card p-6 transition hover:border-brand">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand"><Phone className="h-5 w-5" /></span><div><div className="text-xs text-muted-foreground">Phone</div><div className="font-display text-lg font-semibold">060 841 4467</div></div></div>
          </a>
          <a href="mailto:nhlamulofani@gmail.com" className="block rounded-2xl border border-border bg-card p-6 transition hover:border-brand">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand"><Mail className="h-5 w-5" /></span><div><div className="text-xs text-muted-foreground">Email</div><div className="font-display text-lg font-semibold break-all">nhlamulofani@gmail.com</div></div></div>
          </a>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">Send a message</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
            </div>
            <div className="sm:col-span-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" required maxLength={1000} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1.5" />
            </div>
          </div>
          <Button type="submit" disabled={sending} className="mt-6 rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Send className="mr-2 h-4 w-4" /> {sending ? "Sending…" : "Send Button"}
          </Button>
        </form>
      </div>
    </div>
  );
}
