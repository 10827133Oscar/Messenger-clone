import mongoose, { Schema, models } from 'mongoose';

const MessageSchema = new Schema({
  body: {
    type: String,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  seenIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Message = models.Message || mongoose.model('Message', MessageSchema);

export default Message;
