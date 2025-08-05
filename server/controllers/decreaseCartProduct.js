import dotenv from 'dotenv';
import pool from '../config/database.js';

dotenv.config();

const decreaseCartProductHandler = async (req, res, next) => {
    const { user_id, product_id, quantity } = req.body;
    if (!user_id || !product_id || !quantity || quantity <= 0 || typeof quantity !== 'number') return res.status(400).json({ message: 'Invalid request' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const foundItem = await client.query(
            'SELECT * FROM CartItems WHERE user_id = $1 AND product_id = $2 FOR UPDATE',
            [user_id, product_id]
        );

        if (foundItem.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        const existedQuantity = foundItem.rows[0].quantity;
        const newQuantity = existedQuantity - quantity;
        if (newQuantity <= 0) {
            //delete item from cart
            await client.query(
                'DELETE FROM CartItems WHERE user_id = $1 AND product_id = $2',
                [user_id, product_id]
            )
        }
        else {
            await client.query(
                'UPDATE Cartitems SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
                [newQuantity, user_id, product_id]
            )
        }

        await client.query('COMMIT');
        const successMessage = { message: 'Cart updated successfully', action: newQuantity <= 0 ? 'deleted cart item from cart' : 'decreased' };
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


export default decreaseCartProductHandler;