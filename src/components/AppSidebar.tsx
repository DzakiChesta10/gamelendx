import { NavLink, useLocation } from "react-router-dom";
import { LayoutGrid, Timer, PackagePlus, History } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Catalog", url: "/", icon: LayoutGrid },
  { title: "My Rentals", url: "/rentals", icon: Timer },
  { title: "List Asset", url: "/list", icon: PackagePlus },
  { title: "History", url: "/history", icon: History },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-primary shadow-neon flex items-center justify-center font-display font-black text-primary-foreground">
              R
            </div>
            {!collapsed && (
              <div>
                <div className="font-display font-bold tracking-wider text-sm leading-none text-glow">RENTAL.4907</div>
                <div className="text-[9px] tracking-[0.25em] text-muted-foreground mt-1">DECENTRALIZED</div>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="font-display tracking-[0.2em] text-[10px]">PROTOCOL</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="font-display tracking-wide">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
