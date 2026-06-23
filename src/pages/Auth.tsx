import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Gamepad2, Shield, User as UserIcon, Lock } from "lucide-react";
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

const DEMO = {
  admin: { email: "admin@gamelendx.com", password: "admin123456", label: "ADMIN", desc: "Akses penuh: lihat semua penyewa, durasi sewa & history" },
  user: { email: "user@gamelendx.com", password: "user123456", label: "USER", desc: "Jelajah katalog, lihat harga & sewa asset game" },
} as const;

type Role = keyof typeof DEMO;

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("demo");
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState<Role>("user");
  const [form, setForm] = useState({ email: "", password: "", username: "", display_name: "" });

  useEffect(() => { document.title = "Sign in · GameLendX"; }, []);
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  async function demoLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const creds = DEMO[role];
    const { error } = await supabase.auth.signInWithPassword(creds);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Masuk sebagai ${creds.label}`);
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
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
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
              <form onSubmit={demoLogin} className="space-y-5">
                <div className="text-center">
                  <h2 className="font-display font-bold tracking-widest text-sm text-glow">PILIH MODE DEMO</h2>
                  <p className="text-xs text-muted-foreground mt-1">Kredensial sudah terisi otomatis — klik submit untuk masuk</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(DEMO) as Role[]).map((r) => {
                    const active = role === r;
                    const Icon = r === "admin" ? Shield : UserIcon;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`group relative rounded-xl border p-4 text-left transition-all ${
                          active
                            ? "border-primary bg-primary/10 shadow-neon"
                            : "border-border bg-muted/20 hover:border-primary/50"
                        }`}
                      >
                        <div className={`h-9 w-9 rounded-md flex items-center justify-center mb-2 ${active ? "bg-gradient-primary" : "bg-muted/40"}`}>
                          <Icon className={`h-4 w-4 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        </div>
                        <div className="font-display font-bold tracking-widest text-sm">{DEMO[r].label}</div>
                        <p className="text-[10px] leading-tight text-muted-foreground mt-1">{DEMO[r].desc}</p>
                        {active && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />}
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-display tracking-widest">
                    <span className="text-muted-foreground">EMAIL</span>
                    <span className="text-foreground">{DEMO[role].email}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-display tracking-widest">
                    <span className="text-muted-foreground">PASSWORD</span>
                    <span className="inline-flex items-center gap-1.5 text-foreground">
                      <Lock className="h-3 w-3" /> ••••••••
                    </span>
                  </div>
                </div>

                <Button disabled={busy} className="w-full h-11 bg-gradient-primary text-primary-foreground font-display font-bold tracking-widest shadow-neon">
                  {busy ? "SIGNING IN…" : `SUBMIT — MASUK SEBAGAI ${DEMO[role].label}`}
                </Button>
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

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-display tracking-widest text-muted-foreground">{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="bg-muted/30 border-border focus-visible:ring-primary" />
    </div>
  );
}
