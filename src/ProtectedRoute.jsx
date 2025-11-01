import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

export default function ProtectedRoute() {
  const { user } = useAuthStore();
  // console.log(user.role);
  
  // agar user login nahi hai to login page par bhejo
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // agar user login hai to children components render karo
  return <Outlet />;
}
