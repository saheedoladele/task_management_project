import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/auth-context";
import { DashboardLayoutProvider, useDashboardLayout } from "@/contexts/dashboard-layout-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ClipboardList,
  LayoutList,
  Columns3,
  User,
  History,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

function DashboardShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { taskHeaderControls } = useDashboardLayout();

  const isTasksPage = location.pathname === "/tasks";
  const showLiveTaskHeader = isTasksPage && taskHeaderControls !== null;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const goTasks = () => navigate("/tasks");

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-card-foreground">Task Management</h1>
          </div>
          <div className="flex items-center gap-2">
            {showLiveTaskHeader && taskHeaderControls ? (
              <>
                <div className="flex rounded-md border">
                  <Button
                    variant={taskHeaderControls.view === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    type="button"
                    onClick={() => taskHeaderControls.setView("list")}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={taskHeaderControls.view === "board" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    type="button"
                    onClick={() => taskHeaderControls.setView("board")}
                  >
                    <Columns3 className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle light and dark mode"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button type="button" onClick={taskHeaderControls.onNewTask} size="sm">
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </>
            ) : (
              <>
                <div className="flex rounded-md border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    type="button"
                    onClick={goTasks}
                    aria-label="List view (open dashboard)"
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    type="button"
                    onClick={goTasks}
                    aria-label="Board view (open dashboard)"
                  >
                    <Columns3 className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle light and dark mode"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button type="button" onClick={goTasks} size="sm">
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-6 overflow-hidden px-4 py-6 sm:px-6 lg:flex-row">
        <aside className="h-fit shrink-0 rounded-xl border bg-card/95 p-3 shadow-sm backdrop-blur-sm lg:sticky lg:top-6 lg:w-64">
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/tasks"
              end
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent/50",
                )
              }
            >
              <ClipboardList className="h-4 w-4 shrink-0" />
              Dashboard
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent/50",
                )
              }
            >
              <User className="h-4 w-4 shrink-0" />
              Profile
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent/50",
                )
              }
            >
              <History className="h-4 w-4 shrink-0" />
              History
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent/50",
                )
              }
            >
              <Settings className="h-4 w-4 shrink-0" />
              Settings
            </NavLink>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </aside>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      <footer className="border-t bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-sm text-muted-foreground sm:px-6">
          <p>Task Management Dashboard</p>
          <p>{new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/** Shell with persistent header, sidebar, footer; children via nested `<Outlet />`. */
export function DashboardLayout() {
  return (
    <DashboardLayoutProvider>
      <DashboardShell />
    </DashboardLayoutProvider>
  );
}
