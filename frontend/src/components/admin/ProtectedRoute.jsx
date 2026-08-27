import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian" data-testid="admin-loading">
        <Loader2 className="h-8 w-8 animate-spin text-champagne" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};
