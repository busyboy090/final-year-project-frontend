import React, { createContext, useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { Outlet } from "react-router-dom";

export interface DashboardContextType {
  isProfileModalOpen: boolean;
  isVenueModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openVenueModal: () => void;
  closeVenueModal: () => void;
}

export const DashboardContext = createContext<DashboardContextType>({
  isProfileModalOpen: false,
  isVenueModalOpen: false,
  openProfileModal: () => {},
  closeProfileModal: () => {},
  openVenueModal: () => {},
  closeVenueModal: () => {},
});

function DashboardProvider({ children }: { children?: React.ReactNode }) {
  const { needsProfileCompletion } = useUser(); //
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(true);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(true);

  // Automatically trigger modal if backend flag is true
  useEffect(() => {
    if (needsProfileCompletion) {
      setIsProfileModalOpen(true);
    }
  }, [needsProfileCompletion]);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const openVenueModal = () => setIsVenueModalOpen(true);
  const closeVenueModal = () => setIsVenueModalOpen(false);

  return (
    <DashboardContext.Provider 
      value={{ isProfileModalOpen, openProfileModal, closeProfileModal, isVenueModalOpen, openVenueModal, closeVenueModal }}
    >
      {children ? children : <Outlet />}
    </DashboardContext.Provider>
  );
}

export default DashboardProvider