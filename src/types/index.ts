// user types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

// user profile (extended)
export interface UserProfile extends User {
  currentWeight?: number;
  height?: number;
  gender?: string;
  age?: number;
  fitnessLevel?: string;
  primaryGoal?: string;
  preferredDaysPerWeek?: number;
  preferredSessionDuration?: number;
  availableEquipment?: string;
  totalWorkouts?: number;
  totalHours?: number;
  updatedAt?: string;
}

// auth response
export interface AuthResponse {
  user: User;
  token: string;
}

// api response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// api error
export interface ApiError {
  error?: string;
  message?: string;
}
