import { useEffect, useRef, useState } from "react";
import {Link , useNavigate} from 'react-router-dom'
import axios from '../api/axios';

const Login = () => {
    const [ username , setUsername] = useState("");
    const [password , setPassword] = useState('')

    const userRef = useRef();
    const errRef = useRef();

    const navigate = useNavigate();

    const [errMsg , setErrMsg] = useState('');
    const [success , setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    } , []);

    useEffect(() => {
        setErrMsg('');
    } , [username]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                '/login',
                {
                    "inputUsername" : username,
                    "inputPassword": password
                },
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );

            const accessToken = response.data.accessToken;
            setUsername('');
            setPassword('');
            setSuccess(true);
            navigate('/' , {replace : true});
            
        }   
        catch (err) {
            if (!err?.response) setErrMsg('No server response.');
            console.log(err);
        }
    }

    return(
        <section>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username: </label>
                <input 
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    value={username}
                    onChange={e => setUsername(e.target.value.trim())}
                    required
                />
                <label htmlFor="password">Password: </label>
                <input 
                    type="password"
                    id="password"
                    autoComplete="off"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button>Sign In</button>
            </form>
            <p>Need account?</p>
            <Link to="/register">
                <span>Sign up</span>
            </Link>
        </section>
    );
}

export default Login;