import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const client = new Client({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.PORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

client.connect().catch(err => {
    console.error('Failed to connect to database', err);
    process.exit(1);
});

const updatedCart = async (req, res) => {
    let user_id;
    if (req?.query?.user_id) {
        user_id = req.query.user_id;
    }
    else {
        user_id = req.body.user_id
    }

    try {
        const cartQuery = await client.query(
            'SELECT c.cart_item_id, c.product_id, p.name, p.price, c.quantity FROM cartitems c LEFT JOIN products p ON c.product_id = p.product_id WHERE c.user_id = $1',
            [user_id]
        );
        return res.status(200).json({ successMessage: res.successMessage, updatedCart: cartQuery.rows })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error during query items in user cart' });
    }
}

export default updatedCart;