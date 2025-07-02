import { Request, Response } from 'express';
import { User } from '../models/User';
import { calculateBMR } from '../utils/calculations';


const calculateAgeFromDOB = (dob: Date): number => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, weight, height, dob, gender } = req.body;

    const age = calculateAgeFromDOB(dob);

    const newUser = new User({
      name,
      weight,
      height,
      dob,
      age,
      gender
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();

    const usersWithBMR = users.map(user => {
      const bmr = calculateBMR(user.gender, user.weight, user.height, user.age);
      return {
        ...user.toObject(),
        bmr: Math.round(bmr)
      };
    });

    res.json(usersWithBMR);
  } catch (error) {
    console.error('❌ Failed to fetch users with BMR:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.json(user);
}


export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: 'User deleted' });
};
