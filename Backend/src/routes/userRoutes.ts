import express from 'express';
import { createUser, getUsers,getUser, deleteUser } from '../controllers/userController';

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);

export default router;
