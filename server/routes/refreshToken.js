import express from 'express';
const router = express.Router();
import handleRefreshToken from '../controllers/refreshTokenController.js';

router.route('/')
    .get(handleRefreshToken)

export default router;