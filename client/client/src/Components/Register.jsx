import { useState } from "react";
import axios from "../api/axios";

const Register = () => {
    const [username  , setUsername] = useState('');
    const [password , setPassword] = useState('');
    const [confirmPassword , setConfirmPassword] = useState('');
    return(
        <section>
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
            </form>
        </section>
    );
}

export default Register;