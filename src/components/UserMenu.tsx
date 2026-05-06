import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    return (
      <Button onClick={() => navigate("/auth")} className="bg-gradient-primary text-primary-foreground font-display font-bold tracking-widest shadow-neon">
        Sign In
      </Button>
    );
  }
  const label = (user.user_metadata?.display_name ?? user.user_metadata?.username ?? user.email ?? "").toString();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
          <span className={`h-2 w-2 rounded-full mr-2 animate-pulse ${isAdmin ? "bg-accent" : "bg-[hsl(var(--neon-lime))]"}`} />
          <span className="max-w-[140px] truncate">{label}</span>
          {isAdmin && <span className="ml-2 text-[10px] font-display tracking-widest text-accent">ADMIN</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem disabled>
          <User className="h-4 w-4 mr-2" /> {user.email}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut().then(() => navigate("/auth"))}>
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
