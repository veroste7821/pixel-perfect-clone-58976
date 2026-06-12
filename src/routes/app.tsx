import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right text-xs leading-tight sm:block">
                <p className="font-medium">Estudio Demo</p>
                <p className="text-muted-foreground">Plan Profesional</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary">D</div>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden"><Outlet /></main>
        </div>
      </div>
    </SidebarProvider>
  );
}
