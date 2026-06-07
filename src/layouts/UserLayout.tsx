import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser"
import { useEffect, type ReactNode } from "react";
import { Outlet } from "react-router-dom";

function UserLayout({ children }: { children?: ReactNode }) {
    const { loading, fetchUserProfile, profile } = useUser();
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        if (isAuthenticated && !profile) fetchUserProfile()
    }, [fetchUserProfile, isAuthenticated, profile])

    if (loading || !profile) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F4F6F9]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return children ? children : <Outlet />
}

export default UserLayout
