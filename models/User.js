import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  userID: Number,
  userName: String,
  fullName: String,
  posts: [{ type: Schema.Types.ObjectId, ref: 'posts' }]
});

export default mongoose.model('user', userSchema);
