import dotenv from 'dotenv';
import pool from '../config/database.js';

dotenv.config();

const getProduct = async (req, res) => {
    const client = await pool.connect();
    try {
        const query = await client.query(
            'SELECT * FROM Products'
        );
        const productRows = query.rows;
        return res.json({ products: productRows });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error during getProduct" });
    }
    finally {
        client.release();
    }

}

export default getProduct;