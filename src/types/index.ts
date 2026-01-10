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

// workout types
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g., "8-12", "3x5"
  duration?: number; // in seconds
  instructions?: string;
  equipment?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  focusAreas: string[]; // e.g., ['chest', 'triceps', 'cardio']
  date?: string;
  completed?: boolean;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  exercisesCompleted: number;
  notes?: string;
}
