import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import useUser from "@/hooks/useUser";
import { Outlet } from "react-router-dom";

export interface DashboardContextType {
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

// Create context with a null default to catch errors if used outside provider
export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

function DashboardProvider({ children }: { children?: React.ReactNode }) {
  const { needsProfileCompletion } = useUser();
  
  // Default to false to avoid "flashing" modals on load
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync with backend flag
  useEffect(() => {
    if (needsProfileCompletion) {
      setIsProfileModalOpen(true);
    }
  }, [needsProfileCompletion]);

  // Use useCallback to maintain referential integrity of functions
  const openProfileModal = useCallback(() => setIsProfileModalOpen(true), []);
  const closeProfileModal = useCallback(() => setIsProfileModalOpen(false), []);

  // Memoize the value object so consumers only re-render when state actually changes
  const value = useMemo(() => ({
    isProfileModalOpen,
    openProfileModal,
    closeProfileModal,
  }), [isProfileModalOpen, openProfileModal, closeProfileModal ]);

  return (
    <DashboardContext.Provider value={value}>
      {children ? children : <Outlet />}
    </DashboardContext.Provider>
  );
}

export default DashboardProvider;