import express from 'express';
import { getAllFoods } from '../controllers/foodController';

const router = express.Router();

router.get('/', getAllFoods);

export default router;
