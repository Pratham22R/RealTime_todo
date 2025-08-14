import express from 'express';
import { createGroup, getMyGroups, joinGroup } from '../controllers/groupController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

router.post('/', authenticateToken, createGroup);
router.get('/my', authenticateToken, getMyGroups);
router.post('/join', authenticateToken, joinGroup);

export default router;
