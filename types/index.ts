export type UserProfile = {
  name: string;
  dateOfBirth: string;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft';
  gender: 'male' | 'female' | 'other';
  workoutDaysPerWeek: number;
  preferredTimeOfDay: string;
};

export type Exercise = {
  id: string;
  name: string;
  type: 'set' | 'timer';
  sets?: Set[];
  duration?: number; // in seconds
  notes?: string;
};

export type Set = {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  timestamp?: number;
};

export type Workout = {
  id: string;
  title: string;
  date: string;
  exercises: Exercise[];
  completed: boolean;
};