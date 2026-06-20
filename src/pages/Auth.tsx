import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Gamepad2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

const emailSchema = z.string().trim().email("Invalid email").max(255);
const passwordSchema = z.string().min(6, "Min 6 characters").max(72);
const usernameSchema = z.string().trim().min(3, "Min 3 chars").max(30);

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [busy, setBusy] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [form, setForm] = useState({ email: "", password: "", username: "", display_name: "" });

  useEffect(() => { document.title = "Sign in · GameLendX"; }, []);
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  async function login(e: React.FormEvent) {
    e.preventDefault();
    try {
      emailSchema.parse(form.email);
      passwordSchema.parse(form.password);
    } catch (err: any) { return toast.error(err.errors?.[0]?.message ?? "Invalid input"); }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate("/");
  }

  async function signup(e: React.FormEvent) {
    e.preventDefault();
    try {
      emailSchema.parse(form.email);
      passwordSchema.parse(form.password);
      usernameSchema.parse(form.username);
    } catch (err: any) { return toast.error(err.errors?.[0]?.message ?? "Invalid input"); }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { username: form.username, display_name: form.display_name || form.username },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — you're in!");
    navigate("/");
  }

  async function sendReset(e: React.FormEvent) {
    e.preventDefault();
    try { emailSchema.parse(forgotEmail); }
    catch (err: any) { return toast.error(err.errors?.[0]?.message ?? "Invalid email"); }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Recovery link sent — check your email");
    setForgotOpen(false);
    setForgotEmail("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-md bg-gradient-primary shadow-neon flex items-center justify-center">
            <Gamepad2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="font-display font-black text-xl tracking-wider text-glow">GAMELENDX</div>
        </Link>

        <div className="rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-xl p-6 shadow-neon">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-2 w-full bg-muted/30 mb-6">
              <TabsTrigger value="login" className="font-display tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">LOGIN</TabsTrigger>
              <TabsTrigger value="signup" className="font-display tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">SIGN UP</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {!forgotOpen ? (
                <form onSubmit={login} className="space-y-4">
                  <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
                  <div className="flex justify-end -mt-2">
                    <button type="button" onClick={() => { setForgotEmail(form.email); setForgotOpen(true); }} className="text-xs font-display tracking-widest text-primary hover:text-glow">
                      FORGOT PASSWORD?
                    </button>
                  </div>
                  <Button disabled={busy} className="w-full h-11 bg-gradient-primary text-primary-foreground font-display font-bold tracking-widest shadow-neon">
                    {busy ? "SIGNING IN…" : "SIGN IN"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={sendReset} className="space-y-4">
                  <p className="text-xs text-muted-foreground font-display tracking-wider">
                    Enter your account email. We'll send a recovery link.
                  </p>
                  <Field label="Email" type="email" value={forgotEmail} onChange={setForgotEmail} />
                  <Button disabled={busy} className="w-full h-11 bg-gradient-primary text-primary-foreground font-display font-bold tracking-widest shadow-neon">
                    {busy ? "SENDING…" : "SEND RECOVERY LINK"}
                  </Button>
                  <button type="button" onClick={() => setForgotOpen(false)} className="w-full text-xs font-display tracking-widest text-muted-foreground hover:text-primary">
                    ← BACK TO LOGIN
                  </button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={signup} className="space-y-4">
                <Field label="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} />
                <Field label="Display name (optional)" value={form.display_name} onChange={(v) => setForm({ ...form, display_name: v })} />
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
                <Button disabled={busy} className="w-full h-11 bg-gradient-primary text-primary-foreground font-display font-bold tracking-widest shadow-neon">
                  {busy ? "CREATING…" : "CREATE ACCOUNT"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-display tracking-widest">
          ERC-4907 RENTAL PROTOCOL · POLYGON
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-display tracking-widest text-muted-foreground">{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="bg-muted/30 border-border focus-visible:ring-primary" />
    </div>
  );
}
