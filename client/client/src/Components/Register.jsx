import { useEffect, useRef, useState } from "react";
import {Link , useNavigate} from 'react-router-dom'
import axios from '../api/axios';

const Register = () => {
    const [username  , setUsername] = useState('');
    const [password , setPassword] = useState('');
    const [confirmPassword , setConfirmPassword] = useState('');

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
    } , [username , password , confirmPassword]);

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            if (password !== confirmPassword) {
                throw new Error('Password not match');
            }
            const response = await axios.post(
                '/register',
                {
                    "inputUsername" : username,
                    "inputPassword": password
                },
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setSuccess(true);
            navigate('/login' , {replace : true});
        }
        catch (err) {
            const message = err?.response?.data?.message;
            setErrMsg(message);
        }

    };

    return(
        <section>
            <h1>Sign up</h1>
            {errMsg ? <span ref={errRef}>{errMsg}</span> : <></>}
            <form onSubmit={handleRegister}>
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
                <label htmlFor="confirm_password">Confirm Password: </label>
                <input 
                    type="password"
                    id="confirm_password"
                    autoComplete="off"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                />
                <button>Sign up</button>
            </form>
        </section>
    );
}

export default Register;