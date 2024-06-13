import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute: React.FC<any> = () => {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
