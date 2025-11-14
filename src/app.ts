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
        origin: [
            // 'http://localhost:5173',
            'https://localhost:5173',
        ],
        credentials: true,
    }),
);
app.use('/api/v1', router);

router.post('/test-body', (req, res) => {
    console.log('=== TEST BODY ENDPOINT ===');
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Request Body:', req.body);
    console.log('Body Type:', typeof req.body);
    console.log('Body Keys:', Object.keys(req.body || {}));
    console.log('========================');

    res.json({
        success: true,
        message: 'Body received successfully',
        receivedBody: req.body,
        headers: req.headers,
    });
});

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({message: 'Rydora backend is up and running'});
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
