import express from 'express';
import { getAllActivities } from '../controllers/activityController';

const router = express.Router();

router.get('/', getAllActivities);

export default router;
