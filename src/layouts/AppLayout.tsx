import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import { WalletButton } from "@/components/WalletButton";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-14 flex items-center justify-between gap-2 border-b border-border bg-background/70 backdrop-blur px-3 sm:px-4">
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger />
              <div className="hidden lg:flex items-center gap-2 text-[10px] font-display tracking-[0.3em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--neon-lime))] animate-pulse" />
                CHAIN: SOLANA · METAPLEX RENTAL
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <WalletButton />
              <UserMenu />
            </div>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
