import mongoose, { Schema, models } from 'mongoose';

const ConversationSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  messagesIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
  userIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const Conversation = models.Conversation || mongoose.model('Conversation', ConversationSchema);

export default Conversation;
