import { Request, Response } from 'express';
import { Activity } from '../models/Activity';

export const getAllActivities = async (_req: Request, res: Response) => {
  try {
      const search = _req.query.search?.toString() || '';
      const page = parseInt(_req.query.page as string) || 1;
      const limit = 30;
      const skip = (page - 1) * limit;
  
      const regex = new RegExp(search, 'i'); // case-insensitive
  
      const total = await Activity.countDocuments({ name: { $regex: regex } });
      const activity = await Activity.find({ activityName: { $regex: regex } }).limit(limit);
  
      res.json({
        page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: activity,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
