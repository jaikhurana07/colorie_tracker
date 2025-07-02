import mongoose, { Document } from 'mongoose';

export interface IFood extends Document {
  name: string;
  serving: string;
  calories: number;
  foodGroup: string;
}

const foodSchema = new mongoose.Schema<IFood>({
  name: { type: String, required: true },
  serving: { type: String, required: true },
  calories: { type: Number, required: true },
  foodGroup: { type: String, required: true }
});

export const Food = mongoose.model<IFood>('Food', foodSchema);
