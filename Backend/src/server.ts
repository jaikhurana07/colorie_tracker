import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './utils/connect';
import userRoutes from './routes/userRoutes';
import foodRoutes from './routes/foodRoutes';
import activityRoutes from './routes/activityRoutes';
import entryRoutes from './routes/entryRoutes';
import { importActivityData } from './scripts/metXls'; 
import { importFoodData } from './scripts/foodXls'; 

dotenv.config();

const app = express();
const Port = process.env.PORT || 5000;

connectDb();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/entries', entryRoutes);

if (process.env.NODE_ENV === 'development') {
  // importActivityData(); 
  // importFoodData();
}


app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
