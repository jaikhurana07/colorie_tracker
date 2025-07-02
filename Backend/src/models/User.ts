import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  weight: number;
  height: number;
  dob: Date;
  age: number;
  gender: 'male' | 'female';
}

const userSchema = new mongoose.Schema<IUser>({
  name: String,
  weight: Number,
  height: Number,
  dob: { type: Date, required: true },
  age: Number,
  gender: { type: String, enum: ['male', 'female'], required: true }
});

export const User = mongoose.model<IUser>('User', userSchema);
