import ActionLog from '../models/ActionLog.js';

export const getAllLogs = async (req, res) => {
  try {
    const { groupId } = req.query;
    const filter = groupId ? { group: groupId } : {};
    
    const logs = await ActionLog.find(filter)
      .populate('user', 'username')
      .populate('taskId', 'title')
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
