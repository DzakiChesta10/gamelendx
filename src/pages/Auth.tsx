import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Gamepad2, ShieldCheck, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const emailSchema = z.string().trim().email("Invalid email").max(255);
const passwordSchema = z.string().min(6, "Min 6 characters").max(72);
const usernameSchema = z.string().trim().min(3, "Min 3 chars").max(30);

const DEMO = {
  admin: { email: "admin@gamelendx.com", password: "admin123" },
  user: { email: "user@gamelendx.com", password: "user1234" },
} as const;

type DemoRole = keyof typeof DEMO;

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("demo");
  const [busy, setBusy] = useState(false);
  const [demoRole, setDemoRole] = useState<DemoRole>("admin");
  const [form, setForm] = useState({ email: "", password: "", username: "", display_name: "" });

  useEffect(() => { document.title = "Sign in · GameLendX"; }, []);
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  async function demoSubmit(e: React.FormEvent) {
    e.preventDefault();
    const creds = DEMO[demoRole];
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(creds);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(demoRole === "admin" ? "Masuk sebagai Admin" : "Masuk sebagai User");
    navigate("/");
  }

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
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
            <TabsList className="grid grid-cols-3 w-full bg-muted/30 mb-6">
              <TabsTrigger value="demo" className="font-display tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">DEMO</TabsTrigger>
              <TabsTrigger value="login" className="font-display tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">LOGIN</TabsTrigger>
              <TabsTrigger value="signup" className="font-display tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">SIGN UP</TabsTrigger>
            </TabsList>

            <TabsContent value="demo">
              <form onSubmit={demoSubmit} className="space-y-5">
                <div>
                  <Label className="text-xs font-display tracking-widest text-muted-foreground">PILIH PERAN</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <RoleCard
                      active={demoRole === "admin"}
                      onClick={() => setDemoRole("admin")}
                      icon={<ShieldCheck className="h-5 w-5" />}
                      label="ADMIN"
                      sub="Kelola rental & user"
                    />
                    <RoleCard
                      active={demoRole === "user"}
                      onClick={() => setDemoRole("user")}
                      icon={<UserIcon className="h-5 w-5" />}
                      label="USER"
                      sub="Sewa game"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">email</span>
                    <span className="text-foreground truncate">{DEMO[demoRole].email}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">password</span>
                    <span className="text-foreground">{DEMO[demoRole].password}</span>
                  </div>
                </div>

                <Button disabled={busy} className="w-full h-11 bg-gradient-primary text-primary-foreground font-display font-bold tracking-widest shadow-neon">
                  {busy ? "MASUK…" : `SUBMIT — ${demoRole.toUpperCase()}`}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground font-display tracking-widest">
                  AKUN DEMO • UNTUK PRESENTASI DOSEN
                </p>
              </form>
            </TabsContent>

            <TabsContent value="login">
              <form onSubmit={login} className="space-y-4">
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
                <Button disabled={busy} className="w-full h-11 bg-gradient-primary text-primary-foreground font-display font-bold tracking-widest shadow-neon">
                  {busy ? "SIGNING IN…" : "SIGN IN"}
                </Button>
              </form>
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

function RoleCard({ active, onClick, icon, label, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border p-3 text-left transition-all",
        active
          ? "border-primary bg-primary/10 shadow-neon"
          : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/30"
      )}
    >
      <div className={cn("flex items-center gap-2 mb-1", active ? "text-primary" : "text-foreground")}>
        {icon}
        <span className="font-display font-bold tracking-widest text-sm">{label}</span>
      </div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </button>
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
