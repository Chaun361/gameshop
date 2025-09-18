
import axios from "../api/axios";

export const handleLogout =  async (setAuth) => {
    try {
        await axios.post(
            "/logout",
            { 
                withCredentials : true
            }
        );
        setAuth({});
        return true;
    }
    catch (err) {
        console.error("Logout failed:" , err);
        return false;
    }
    
}