import { Request, Response } from 'express';
import { Entry } from '../models/Entry';
import { User } from '../models/User';
import { calculateBMR, calculateActivityCalories } from '../utils/calculations';
import { IUser } from '../models/User';
import { IActivity } from '../models/Activity';


export const createOrUpdateEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, date, foods = [], activities = [] } = req.body;

    const entryDate = new Date(date);

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }

    const existingEntry = await Entry.findOne({ user: userId, date: entryDate });

    if (existingEntry) {
      existingEntry.foods.push(...foods);
      existingEntry.activities.push(...activities);
      await existingEntry.save();
      res.status(200).json({ message: 'Entry updated', entry: existingEntry });
    } else {
      const newEntry = new Entry({
        user: userId,
        date: entryDate,
        foods,
        activities,
      });

      await newEntry.save();
      res.status(201).json({ message: 'Entry created', entry: newEntry });
    }
  } catch (error) {
    console.error('Error in createOrUpdateEntry:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getEntryByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    console.log(date, userId);


    const entryDate = new Date(date as string);
    console.log(entryDate);


    const entry = await Entry.findOne({ user: userId, date: entryDate })
      .populate('foods.food')
      .populate('activities.activity')
      .populate('user');

    console.log(entry);


    if (!entry) {
      res.status(404).json({ message: 'Entry not found' });
      return
    }

    const caloriesIn = entry?.foods.reduce((acc, item: any) => {
      return acc + (item.food?.calories * item.portion);
    }, 0);

    console.log(caloriesIn);

    const user = entry?.user as IUser;

    const bmr = Math.round(calculateBMR(user?.gender, user?.weight, user?.height, user?.age));
    console.log(bmr);


    const activityCaloriesOut = entry?.activities.reduce((acc, item) => {
      const activity = item.activity as IActivity;
      return acc + calculateActivityCalories(
        activity?.metValue,
        user.weight,
        item.durationInMinutes
      );
    }, 0);
    console.log(activityCaloriesOut);


    const netCalories = Math.round(caloriesIn! - (activityCaloriesOut! + bmr));

    console.log(netCalories);

    res.json({
      entry,
      caloriesIn,
      activityCaloriesOut,
      bmr,
      netCalories
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: 'Something went wrong', error: err });
  }
};


export const getentriesByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Fetching entries for user');
    // console.log(req.params);
    const { userId } = req.params;
    console.log('Fetching entries for user:', userId);

    const entries = await Entry.find({ user: userId })
      .populate('foods.food')
      .populate('activities.activity')
      .populate('user');

    if (!entries || entries.length === 0) {
      res.status(404).json({ message: 'No entries found for this user' });
      return;
    }

    const user = entries[0].user as IUser;

    const bmr = calculateBMR(user.gender, user.weight, user.height, user.age);

    const entrySummaries = entries.map(entry => {
      const caloriesIn = entry.foods.reduce((acc, item: any) => {
        return acc + (item.food?.calories || 0) * item.portion;
      }, 0);

      const activityCaloriesOut = entry.activities.reduce((acc, item) => {
        const activity = item.activity as IActivity;
        return acc + calculateActivityCalories(
          activity?.metValue,
          user.weight,
          item.durationInMinutes
        );
      }, 0);

      const netCalories = caloriesIn - (activityCaloriesOut + bmr);

      return {
        entry,
        caloriesIn,
        activityCaloriesOut,
        bmr,
        netCalories
      };
    });

    res.json(entrySummaries);
  } catch (err) {
    console.error('❌ Error fetching user entries:', err);
    res.status(500).json({ message: 'Something went wrong', error: err });
  }
};



