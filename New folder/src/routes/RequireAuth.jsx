import { Navigate, Route, RouteProps, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext";


export default function RequireAuth({children}) {
  const { user } = useAuth();

    if(!user) {
        return <Navigate to="/login" />
    }

  return children;
}