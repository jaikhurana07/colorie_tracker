import { Request, Response } from 'express';
import { Food } from '../models/Food';

export const getAllFoods = async (_req: Request, res: Response) => {
try {
    const search = _req.query.search?.toString() || '';
    const page = parseInt(_req.query.page as string) || 1;
    const limit = 30;
    const skip = (page - 1) * limit;

    const regex = new RegExp(search, 'i'); // case-insensitive

    const total = await Food.countDocuments({ name: { $regex: regex } });
    const foods = await Food.find({ name: { $regex: regex } }).limit(limit);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: foods,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
