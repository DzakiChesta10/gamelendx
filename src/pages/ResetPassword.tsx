import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const passwordSchema = z.string().min(6, "Min 6 characters").max(72);

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [valid, setValid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    document.title = "Reset password · GameLendX";

    // Supabase redirects with tokens in URL hash (#access_token=...&type=recovery)
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(hash);
    const type = params.get("type");

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValid(true);
        setReady(true);
      }
    });

    // Fallback: if there's already a session from recovery link
    supabase.auth.getSession().then(({ data }) => {
      if (type === "recovery" || data.session) {
        setValid(true);
      }
      setReady(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      passwordSchema.parse(pw);
    } catch (err: any) {
      return toast.error(err.errors?.[0]?.message ?? "Invalid password");
    }
    if (pw !== confirm) return toast.error("Passwords do not match");

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);

    toast.success("Password updated — please sign in again");
    await supabase.auth.signOut();
    navigate("/auth");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link to="/auth" className="flex items-center justify-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-md bg-gradient-primary shadow-neon flex items-center justify-center">
            <Gamepad2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="font-display font-black text-xl tracking-wider text-glow">GAMELENDX</div>
        </Link>

        <div className="rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-xl p-6 shadow-neon">
          <h1 className="font-display font-bold tracking-widest text-lg mb-6 text-center">
            SET NEW PASSWORD
          </h1>

          {!ready ? (
            <p className="text-sm text-muted-foreground text-center">Verifying link…</p>
          ) : !valid ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                This recovery link is invalid or has expired.
              </p>
              <Button asChild className="w-full h-11 bg-gradient-primary text-primary-foreground font-display font-bold tracking-widest shadow-neon">
                <Link to="/auth">BACK TO LOGIN</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-display tracking-widest text-muted-foreground">New password</Label>
                <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="bg-muted/30 border-border focus-visible:ring-primary" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-display tracking-widest text-muted-foreground">Confirm password</Label>
                <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="bg-muted/30 border-border focus-visible:ring-primary" />
              </div>
              <Button disabled={busy} className="w-full h-11 bg-gradient-primary text-primary-foreground font-display font-bold tracking-widest shadow-neon">
                {busy ? "UPDATING…" : "UPDATE PASSWORD"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
