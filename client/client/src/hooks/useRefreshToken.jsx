import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

const useRefreshToken = () => {

    const {setAuth} = useContext(AuthContext);

    const refresh = async () => {
        
        try {
            const response = await axios.get('/token' , {
                withCredentials : true
            })

            setAuth(prev => {
                return {...prev , accessToken : response.data.accessToken , username : response.data.username , user_id: response.data.id}
            });
        }
        catch (err) {
            console.error(err);
        }
    }

    return refresh;
}

export default useRefreshToken;