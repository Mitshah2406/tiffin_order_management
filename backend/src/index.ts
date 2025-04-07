import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/router';
import dotenv from 'dotenv';
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Database URL: ${process.env.DATABASE_URL}`);
});