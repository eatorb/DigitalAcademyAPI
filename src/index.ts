import dotenv from 'dotenv';
dotenv.config();

import express, {Express} from 'express';
import cors from 'cors';
import Routing from './routers/routing';
import bodyParser from "body-parser";


const app: Express = express();
const port: number = 3000;

app.use(express.json());
app.use(bodyParser.json({strict: false}));
app.use(cors());

const routing: Routing = new Routing(app);
routing.init();
app.listen(port, (): void => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});