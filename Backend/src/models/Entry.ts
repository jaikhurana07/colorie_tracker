// src/models/Entry.ts
import mongoose, { Document, Types } from 'mongoose';
import { IUser } from './User';
import { IActivity } from './Activity';
import { deserialize } from 'v8';

interface IFoodEntry {
  food: Types.ObjectId;
  portion: number;
  time: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface IActivityEntry {
  activity: Types.ObjectId | IActivity; // 🔥 Allow for populated object
  durationInMinutes: number;
}

export interface IEntry extends Document {
  user: Types.ObjectId | IUser;  // 🔥 this is key
  date: Date;
  foods: IFoodEntry[];
  activities: IActivityEntry[];
}


const entrySchema = new mongoose.Schema<IEntry>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  foods: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      portion: Number,
      time: { type: String, enum: ['breakfast', 'lunch', 'dinner'] }
    }
  ],
  activities: [
    {
      activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
      durationInMinutes: Number,
      description: String

    }
  ]
});

export const Entry = mongoose.model<IEntry>('Entry', entrySchema);
