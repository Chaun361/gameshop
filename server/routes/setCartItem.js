import express from 'express';
const router = express.Router();
import setCartItemHandler from '../controllers/setCartItemController.js';
import updatedCart from '../middlewares/updatedCart.js';

router.route('/')
    .post(setCartItemHandler, updatedCart)

export default router;