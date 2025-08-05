import dotenv from 'dotenv';
import pool from '../config/database.js';

dotenv.config();


const addToCartHandler = async (req, res, next) => {
    const { user_id, product_id, quantity } = req.body;
    if (!user_id || !product_id || !quantity || quantity <= 0) return res.status(400).json({ message: 'Invalid request' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const foundItem = await client.query(
            'SELECT * FROM CartItems WHERE user_id = $1 AND product_id = $2 FOR UPDATE',
            [user_id, product_id]
        );
        if (foundItem.rows.length === 0) {
            await client.query(
                'INSERT INTO CartItems ( user_id , product_id , quantity) VALUES( $1 , $2 , $3)',
                [user_id, product_id, quantity]
            );
        }
        else {
            const existedQuantity = foundItem.rows[0].quantity;
            await client.query(
                'UPDATE Cartitems SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
                [existedQuantity + quantity, user_id, product_id]
            )
        }

        await client.query('COMMIT');
        const successMessage = { message: 'Cart updated successfully', action: 'added' };
        res.successMessage = successMessage;
        next();
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        return res.status(500).json({ message: "Server error during getProduct" });
    }
    finally {
        client.release();
    }
}
export default addToCartHandler;