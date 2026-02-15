import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export const RoleRoute = ({ allow, children }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner full />;
  }

  if (!role || !allow.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
