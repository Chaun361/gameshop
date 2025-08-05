import pool from '../config/database.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const handleRegister = async (req, res) => {
    const { inputUsername, inputPassword } = req.body;
    if (!inputUsername || !inputPassword) return res.status(400).json({ err: "Invalid request" });

    const client = await pool.connect();
    try {
        const checkDuplicateUsername = await client.query(
            'SELECT * FROM Users WHERE username = $1',
            [inputUsername]
        );
        if (checkDuplicateUsername?.rows[0]) return res.status(409).json({ err: "Username already taken" });
        console.log(checkDuplicateUsername?.rows[0]);
        //hash password
        const saltRounds = 10
        const hashedPwd = await bcrypt.hash(inputPassword, saltRounds);

        //update DB
        await client.query(
            'INSERT INTO Users ( username , password_hash ) VALUES ( $1 , $2 )',
            [inputUsername, hashedPwd]
        );

        return res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Server error during register' });
    }
    finally {
        client.release();
    }
}

export default handleRegister;