import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const postSchema = Schema({ title: { type: String, required: true }, content: { type: String, required: true } });

module.exports = mongoose.model('Post', postSchema);
