import ActionLog from '../models/ActionLog.js';
import { getIO } from '../socket/index.js';

export const logAction = async (userId, action, taskId = null, groupId, details = '') => {
  try {
    const log = new ActionLog({ user: userId, action, taskId, group: groupId, details });
    await log.save();

    const logs = await ActionLog.find().sort({ timestamp: -1 }).limit(20);
    if (logs.length > 20) {
      await ActionLog.deleteMany({ _id: { $nin: logs.map(l => l._id) } });
    }

    // Emit socket event to group room only
    const io = getIO();
    io.to(groupId.toString()).emit('activity_log_updated', log);
    
    return log;
  } catch (err) {
    console.error('❌ Error logging action:', err.message);
  }
};
