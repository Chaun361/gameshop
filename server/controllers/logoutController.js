import dotenv from 'dotenv';
import pool from '../config/database.js';

dotenv.config();

const logoutHandler = async (req, res) => {
    const client = await pool.connect();
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204);
        const refreshToken = cookies.jwt;
        //validate refreshToken
        const foundUser = await client.query(
            'SELECT * FROM Users WHERE refresh_token = $1',
            [refreshToken]
        )
        if (!foundUser?.rows[0]) {
            res.clearCookie('jwt',
                {
                    httpOnly: true,
                    secure: true,       // Required if sameSite: 'none'
                    sameSite: 'none',   // Allows cross-domain cookie clearing
                }
            );
            return res.sendStatus(204);
        }

        //update DB
        await client.query(
            'UPDATE Users SET refresh_token = NULL WHERE username = $1',
            [foundUser.rows[0].username]
        );

        res.clearCookie('jwt',
            {
                httpOnly: true,
                secure: true,       // Required if sameSite: 'none'
                sameSite: 'none',   // Allows cross-domain cookie clearing
            }
        );

        return res.sendStatus(204);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "seerver error during logout" });
    }
    finally {
        client.release();
    }
}

export default logoutHandler;