import { useContext , useState , useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import useRefreshToken from "../hooks/useRefreshToken";
import { Outlet } from "react-router-dom";
 

const PersistLogin = () => {
    const {auth , setAuth , persist} = useContext(AuthContext);
    const [isLoading , setIsLoading] = useState(true);
    
    const refresh = useRefreshToken();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
                setAuth({});
            } 
            finally {
                setIsLoading(false);
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    } , [])

    useEffect(() => {
        console.log(`isLoading : ${isLoading}`);
        //console.log(`aT : ${auth?.accessToken}`);
    } , [isLoading])

    return(
        <>
            {!persist ? <Outlet></Outlet>
                :   isLoading ? <p>loading...</p> 
                    : <Outlet></Outlet>
            }
        </>
    );
}


export default PersistLogin;