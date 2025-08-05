import express from 'express';
const router = express.Router();
import decreaseCartProductHandler from '../controllers/decreaseCartProduct.js';
import updatedCart from '../middlewares/updatedCart.js';

router.route('/')
    .post(decreaseCartProductHandler, updatedCart)

export default router;