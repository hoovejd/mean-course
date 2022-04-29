import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface UserInterface {
  email: string;
  password: string;
}

const userSchema = new Schema<UserInterface>({ email: { type: String, required: true, unique: true }, password: { type: String, required: true } });

userSchema.plugin(uniqueValidator);

export const UserModel = model<UserInterface>('User', userSchema);
