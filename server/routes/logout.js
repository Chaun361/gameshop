import express from 'express';
const router = express.Router();
import logoutHandler from '../controllers/logoutController.js';

router.route('/')
    .post(logoutHandler)

export default router;