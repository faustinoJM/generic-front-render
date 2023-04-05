import { Navigate, Route, RouteProps, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import jwt_decode from "jwt-decode";


export default function RouterAuth({children, isPrivate = false}) {
  const { user, } = useAuth();
  const navigate = useNavigate();

  
  const location = useLocation();
  
  // const  decodedToken = jwt_decode(localStorage.getItem('@ConsulPayroll:refresh_token'));
  // let lala = (decodedToken.exp / 1000) < Date.now() ? true : false

  // if (decodedToken) {
  //   if (decodedToken.exp * 1000 < Date.now()) {
  //     localStorage.clear();
  //     user = false
  //    return <Navigate to='/login' state={{ from: location }} replace/> 
  //   }
 
  // }
  return (
      !!user ? (
        children
      ) : (
        <Navigate to='/login' state={{ from: location }} replace/> 
      )
  )
}