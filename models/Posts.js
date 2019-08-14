import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
  postID: Number,
  displayUrl: String,
  text: String,
  isVideo: Boolean,
  timestamp: Date,
  user: { type: Schema.Types.ObjectId, ref: 'user' }
});

export default mongoose.model('posts', postSchema);
