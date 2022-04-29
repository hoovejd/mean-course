import { Schema, model } from 'mongoose';

interface PostInterface {
  title: string;
  content: string;
  imagePath: string;
}

const postSchema = new Schema<PostInterface>({ title: { type: String, required: true }, content: { type: String, required: true }, imagePath: { type: String, required: true } });

export const PostModel = model<PostInterface>('Post', postSchema);
