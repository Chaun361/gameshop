import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../config/database.js';

dotenv.config();


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(400).json({ err: 'Invalid request' });
    const refreshToken = cookies.jwt;

    const client = await pool.connect();
    try {
        //validate refreshToken
        const foundUser = await client.query(
            'SELECT * FROM Users WHERE refresh_token = $1',
            [refreshToken]
        )
        if (!foundUser?.rows[0]) return res.status(403).json({ err: 'forbidden' });

        //verify token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, encoded) => {
            if (err || foundUser.rows[0].username !== encoded.username) {
                console.error(err);
                return res.status(403).json({ err: "forbidden" });
            }

            const accessToken = jwt.sign(
                {
                    username: encoded.username
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15s' }
            );

            return res.json({ accessToken: accessToken, username: encoded.username });

        })

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error during RefreshToken" });
    }
    finally {
        client.release();
    }
}

export default handleRefreshToken;