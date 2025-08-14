import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  inviteToken: { type: String, unique: true }, // for shareable URL
}, { timestamps: true });

export default mongoose.model('Group', groupSchema);
