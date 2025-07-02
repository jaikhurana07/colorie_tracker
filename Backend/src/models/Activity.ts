import mongoose, { Document } from 'mongoose';

export interface IActivity extends Document {
  activityName: string;
  specificMotion: string;
  metValue: number;
}

const activitySchema = new mongoose.Schema<IActivity>({
  activityName: String,
  specificMotion: String,
  metValue: Number
});

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
