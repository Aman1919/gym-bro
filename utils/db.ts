import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, UserProfile } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  WORKOUTS: '@workout_diary:workouts',
  CURRENT_WORKOUT: '@workout_diary:current_workout',
  USER_PROFILE: '@workout_diary:user_profile',
};

// Initialize database
export const setupDatabase = async () => {
  try {
    const workouts = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (workouts === null) {
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify([]));
    }

    const userProfile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (userProfile === null) {
      const defaultProfile: UserProfile = {
        name: '',
        dateOfBirth: '',
        weight: 0,
        weightUnit: 'kg',
        height: 0,
        heightUnit: 'cm',
        gender: 'other',
        workoutDaysPerWeek: 0,
        preferredTimeOfDay: '',
      };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultProfile));
    }
  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

// Get all workouts
export const getWorkouts = async (): Promise<Workout[]> => {
  try {
    const workouts = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return workouts ? JSON.parse(workouts) : [];
  } catch (error) {
    console.error('Error getting workouts:', error);
    return [];
  }
};

// Get current workout
export const getCurrentWorkout = async (): Promise<Workout | null> => {
  try {
    const workout = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT);
    return workout ? JSON.parse(workout) : null;
  } catch (error) {
    console.error('Error getting current workout:', error);
    return null;
  }
};

// Save current workout
export const saveCurrentWorkout = async (workout: Workout): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_WORKOUT, JSON.stringify(workout));
  } catch (error) {
    console.error('Error saving current workout:', error);
  }
};

// Add new workout
export const addWorkout = async (workout: Workout): Promise<void> => {
  try {
    const workouts = await getWorkouts();
    workouts.push(workout);
    await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  } catch (error) {
    console.error('Error adding workout:', error);
  }
};

// Complete current workout and move to history
export const completeWorkout = async (): Promise<void> => {
  try {
    const currentWorkout = await getCurrentWorkout();
    if (currentWorkout) {
      currentWorkout.completed = true;
      await addWorkout(currentWorkout);
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_WORKOUT);
    }
  } catch (error) {
    console.error('Error completing workout:', error);
  }
};

// Get user profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Save user profile
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};