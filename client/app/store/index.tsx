import { create } from 'zustand';

interface UserDetails {
  gender: string;
  name: string;
  age: string;
  weight: string;
  height: string;
  exerciseExperience: string;
  equipmentType: string;
  workoutFrequency: string;
  bmi: string;
}

interface UserDetailsState {
  userDetails: UserDetails;
  setUserDetails: (details: UserDetails) => void;
}

export const useUserDetailsStore = create<UserDetailsState>((set:any) => ({
  userDetails: {
    gender: "",
    name: "",
    age: "",
    weight: "",
    height: "",
    exerciseExperience: "",
    equipmentType: "",
    workoutFrequency: "",
    bmi: "",
  },
  setUserDetails: (details:any) => set({ userDetails: details }),
}));