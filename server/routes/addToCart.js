import express from 'express';
const router = express.Router();
import addToCartHandler from '../controllers/addToCartController.js';
import updatedCart from '../middlewares/updatedCart.js';

router.route('/')
    .post(addToCartHandler, updatedCart)

export default router;