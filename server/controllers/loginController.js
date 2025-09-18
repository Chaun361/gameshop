import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../config/database.js';

dotenv.config();

const handleLogin = async (req, res) => {
    const { inputUsername, inputPassword } = req.body;

    if (!inputUsername || !inputPassword) return res.status(400).json({ message: "Invalid request" });

    const client = await pool.connect();
    try {

        const databaseResult = await client.query(
            `SELECT * FROM Users WHERE username = $1`,
            [inputUsername]
        );

        const foundUser = databaseResult.rows[0]
        if (!foundUser) return res.status(404).json({ message: 'User not found.' });
        console.log(foundUser);

        const storedHashPassword = foundUser.password_hash;
        const isPwdMatch = await bcrypt.compare(inputPassword, storedHashPassword);
        if (!isPwdMatch) return res.status(401).json({ message: "Invalid password" });

        //create JWT
        const accessToken = jwt.sign(
            {
                username: foundUser.username ,
                id: foundUser.user_id
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15s' }
        );
        const refreshToken = jwt.sign(
            {
                username: foundUser.username,
                id: foundUser.user_id
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '600 s' }
        );

        //save refresh token to DB and cookie 
        //Update DB
        await client.query(
            'UPDATE Users SET refresh_token = $1 WHERE username = $2',
            [refreshToken, foundUser.username]
        )

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: false,       // Required if sameSite: 'none'
            sameSite: 'lax',   // Allows cross-domain cookie clearing
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.json({ accessToken: accessToken , id: foundUser.user_id });

    }
    catch (err) {
        console.err(err);
        return res.json({ message: "server error during login" });
    }
    finally {
        client.release();
    }

};

export default handleLogin;