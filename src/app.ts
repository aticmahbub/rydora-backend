import express, {Request, Response} from 'express';
import {router} from './app/routes';
import {globalErrorHandler} from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '10mb'}));
app.use(cookieParser());
app.use(
    cors({
        origin: ['https://rydora-frontend.vercel.app', 'http://localhost:5173'],
        credentials: true,
    }),
);

app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Rydora backend is up and running on server',
    });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
