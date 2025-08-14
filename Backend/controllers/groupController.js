import Group from '../models/Group.js';
import crypto from 'crypto';

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const token = crypto.randomBytes(8).toString('hex');
    const group = await Group.create({
      name: req.body.name,
      creator: req.user.userId,
      members: [req.user.userId],
      inviteToken: token
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all groups of logged-in user
export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.userId });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Join group via token
export const joinGroup = async (req, res) => {
  try {
    const group = await Group.findOne({ inviteToken: req.body.token });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!group.members.includes(req.user.userId)) {
      group.members.push(req.user.userId);
      await group.save();
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
