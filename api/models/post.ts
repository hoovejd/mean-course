import { Schema, model } from 'mongoose';

interface Post {
  title: string;
  content: string;
}

const postSchema = new Schema<Post>({ title: { type: String, required: true }, content: { type: String, required: true } });

export const PostModel = model<Post>('Post', postSchema);
