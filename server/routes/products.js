import express from 'express';
const router = express.Router();
import getProduct from '../controllers/productsController.js';

router.route('/')
    .get(getProduct)

export default router;