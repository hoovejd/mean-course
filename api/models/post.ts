import { Schema, model } from 'mongoose';

interface PostInterface {
  title: string;
  content: string;
  imagePath: string;
  creator: number;
}

const postSchema = new Schema<PostInterface>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const PostModel = model<PostInterface>('Post', postSchema);
