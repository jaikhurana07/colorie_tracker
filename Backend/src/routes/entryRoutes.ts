import express from 'express';
import { createOrUpdateEntry, getEntryByDate,getentriesByUser } from '../controllers/entryController';

const router = express.Router();

router.post('/', createOrUpdateEntry);
router.get('/:userId', getEntryByDate); // ?date=YYYY-MM-DD
router.get('/user/:userId', getentriesByUser);

export default router;
    