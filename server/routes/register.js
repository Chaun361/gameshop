import express from 'express';
const router = express.Router();
import handleRegister from '../controllers/registerController.js';

router.route('/')
    .post(handleRegister)

export default router;