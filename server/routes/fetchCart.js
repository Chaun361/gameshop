import express from 'express';
const router = express.Router();
import updatedCart from '../middlewares/updatedCart.js';

router.route('/')
    .get(updatedCart)

export default router;