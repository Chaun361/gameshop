import dotenv from 'dotenv';
dotenv.config();

import express, { urlencoded } from 'express';
import cors from 'cors';
import corsOption from './config/corsOptions.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import fetchCartRouter from './routes/fetchCart.js';

import cookieParser from 'cookie-parser';
import logger from './middlewares/logger.js';
import refreshRouter from './routes/refreshToken.js'
import logoutRouter from './routes/logout.js';
import productRouter from './routes/products.js';
import addProductRouter from './routes/addToCart.js'
import decreaseProductRouter from './routes/decreaseFromCart.js'
import setCartRoute from './routes/setCartItem.js'

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(urlencoded({ extended: false }));

app.use(cors(corsOption));

app.use(logger);

app.use('/login', loginRouter);

app.use('/register', registerRouter);

app.use('/token', refreshRouter);

app.use('/logout', logoutRouter);

app.use('/products', productRouter);

app.use('/add', addProductRouter);

app.use('/decrease', decreaseProductRouter);

app.use('/setcart', setCartRoute);

app.use('/fetchcart' , fetchCartRouter);

app.listen(3000, () => console.log("server running on port 3000"));