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

// Leave a group
export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (!group.members.includes(req.user.userId)) {
      return res.status(400).json({ error: 'You are not a member of this group' });
    }

    // Remove user from group members
    group.members = group.members.filter(memberId => memberId.toString() !== req.user.userId);
    
    // If no members left, delete the group
    if (group.members.length === 0) {
      await Group.findByIdAndDelete(groupId);
      return res.json({ message: 'Group deleted as no members remain' });
    }

    // If user was the creator, transfer ownership to first remaining member
    if (group.creator.toString() === req.user.userId) {
      group.creator = group.members[0];
    }

    await group.save();
    res.json({ message: 'Successfully left the group' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
