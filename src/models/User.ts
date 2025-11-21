import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerified: {
    type: Date,
  },
  image: {
    type: String,
  },
  hashedPassword: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  conversationIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
  }],
  seenMessageIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
});

const User = models.User || mongoose.model('User', UserSchema);

export default User;
