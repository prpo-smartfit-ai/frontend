import { API_ENDPOINTS, apiClient } from './client';

export interface WorkoutPlan {
  id?: string;
  userId?: string;
  name: string;
  description?: string;
  duration?: number;
  exercises?: Exercise[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment?: string;
  instructions?: string;
}

export interface StartSessionRequest {
  workoutPlanId: string;
  notes?: string;
}

export interface SessionResponse {
  id: string;
  workoutPlanId: string;
  userId: string;
  startDate: string;
  endDate?: string;
  duration?: number;
  notes?: string;
  exercisesCompleted?: number;
  totalExercises?: number;
}

export interface LogExerciseRequest {
  exerciseId: string;
  setsCompleted: number;
  repsCompleted: string;
  notes?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

class WorkoutService {
  /**
   * Create a new workout plan
   */
  async createWorkoutPlan(plan: WorkoutPlan): Promise<WorkoutPlan> {
    const response = await apiClient.post<ApiResponse<WorkoutPlan>>(
      `${API_ENDPOINTS.workouts}/plans`,
      plan
    );
    
    return response.data;
  }

  /**
   * Get all workout plans for current user
   */
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    const response = await apiClient.get<ApiResponse<WorkoutPlan[]>>(
      `${API_ENDPOINTS.workouts}/plans`
    );
    
    return response.data || [];
  }

  /**
   * Get a specific workout plan
   */
  async getWorkoutPlan(planId: string): Promise<WorkoutPlan> {
    const response = await apiClient.get<ApiResponse<WorkoutPlan>>(
      `${API_ENDPOINTS.workouts}/plans/${planId}`
    );
    
    return response.data;
  }

  /**
   * Delete a workout plan
   */
  async deleteWorkoutPlan(planId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.workouts}/plans/${planId}`);
  }

  /**
   * Start a new workout session
   */
  async startSession(workoutPlanId: string, notes?: string): Promise<SessionResponse> {
    const request: StartSessionRequest = {
      workoutPlanId,
      notes,
    };
    
    const response = await apiClient.post<ApiResponse<SessionResponse>>(
      `${API_ENDPOINTS.workouts}/sessions`,
      request
    );
    
    return response.data;
  }

  /**
   * Get session history
   */
  async getSessionHistory(): Promise<SessionResponse[]> {
    const response = await apiClient.get<ApiResponse<SessionResponse[]>>(
      `${API_ENDPOINTS.workouts}/sessions`
    );
    
    return response.data || [];
  }

  /**
   * Get a specific session
   */
  async getSession(sessionId: string): Promise<SessionResponse> {
    const response = await apiClient.get<ApiResponse<SessionResponse>>(
      `${API_ENDPOINTS.workouts}/sessions/${sessionId}`
    );
    
    return response.data;
  }

  /**
   * Log exercise completion
   */
  async logExerciseCompletion(
    sessionId: string,
    exerciseId: string,
    setsCompleted: number,
    repsCompleted: string,
    notes?: string
  ): Promise<void> {
    const request: LogExerciseRequest = {
      exerciseId,
      setsCompleted,
      repsCompleted,
      notes,
    };
    
    await apiClient.post(
      `${API_ENDPOINTS.workouts}/sessions/${sessionId}/exercises`,
      request
    );
  }

  /**
   * End a workout session
   */
  async endSession(sessionId: string, notes?: string): Promise<SessionResponse> {
    const request = { notes };
    
    const response = await apiClient.put<ApiResponse<SessionResponse>>(
      `${API_ENDPOINTS.workouts}/sessions/${sessionId}/end`,
      request
    );
    
    return response.data;
  }

  /**
   * Get session history for the current user
   */
  async getSessions(): Promise<SessionResponse[]> {
    const response = await apiClient.get<ApiResponse<SessionResponse[]>>(
      `${API_ENDPOINTS.workouts}/sessions`
    );
    return response.data;
  }

  /**
   * Check service health
   */
  async healthCheck(): Promise<{ status: string; service: string }> {
    return apiClient.get<{ status: string; service: string }>(`${API_ENDPOINTS.workouts}/health`);
  }
}

export const workoutService = new WorkoutService();
