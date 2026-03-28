import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
  } from "react";
  
  export type TaskHeaderControls = {
    view: "list" | "board";
    setView: (view: "list" | "board") => void;
    onNewTask: () => void;
  };
  
  type DashboardLayoutContextValue = {
    setTaskHeaderControls: (controls: TaskHeaderControls | null) => void;
    taskHeaderControls: TaskHeaderControls | null;
  };
  
  const DashboardLayoutContext = createContext<DashboardLayoutContextValue | null>(null);
  
  export function DashboardLayoutProvider({ children }: { children: ReactNode }) {
    const [taskHeaderControls, setTaskHeaderControlsState] = useState<TaskHeaderControls | null>(null);
  
    const setTaskHeaderControls = useCallback((controls: TaskHeaderControls | null) => {
      setTaskHeaderControlsState(controls);
    }, []);
  
    const value = useMemo(
      () => ({ setTaskHeaderControls, taskHeaderControls }),
      [setTaskHeaderControls, taskHeaderControls],
    );
  
    return (
      <DashboardLayoutContext.Provider value={value}>{children}</DashboardLayoutContext.Provider>
    );
  }
  
  export function useDashboardLayout(): DashboardLayoutContextValue {
    const ctx = useContext(DashboardLayoutContext);
    if (!ctx) {
      throw new Error("useDashboardLayout must be used within DashboardLayoutProvider");
    }
    return ctx;
  }
  