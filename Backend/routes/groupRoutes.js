import express from 'express';
import { createGroup, getMyGroups, joinGroup, leaveGroup } from '../controllers/groupController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

router.post('/', authenticateToken, createGroup);
router.get('/my', authenticateToken, getMyGroups);
router.post('/join', authenticateToken, joinGroup);
router.delete('/:groupId', authenticateToken, leaveGroup);

export default router;
