import { useContext } from "react";
import AuthContext from "../context/AuthProvider.jsx";
import { useLocation , Navigate , Outlet } from "react-router-dom";


const RequireAuth = () => {
    const {auth} = useContext(AuthContext);
    const location = useLocation();

    return(
        auth?.accessToken ?
            <Outlet></Outlet>
            :
            <Navigate to="/login" state={{from : location}} replace></Navigate>
    );
}

export default RequireAuth;