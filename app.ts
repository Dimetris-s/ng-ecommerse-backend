import morgan from 'morgan';
import { config } from 'dotenv';
import path from 'path';
import express, { Express } from 'express';

import cors from 'cors';
import { db } from './db';
import { router } from './routes';
import authJwt from './helpers/jwt';
import errorHandler from './helpers/errorHandler';

config();
const PORT = process.env.PORT || 5000;
const API = process.env.API_URL || '/api/v1';
const app: Express = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.use(authJwt());
app.use(
    '/public/uploads',
    express.static(path.join(__dirname, '../public/uploads'))
);
app.use(API, router);
app.use(errorHandler);

const start = async () => {
    await db();

    app.listen(PORT, () => {
        console.log('Server has been started at port ' + PORT);
    });
};

start().catch((e: Error) => console.log(e.message));
