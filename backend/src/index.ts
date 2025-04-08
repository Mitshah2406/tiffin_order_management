import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/router';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './swagger/swagger';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use("/", router);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});