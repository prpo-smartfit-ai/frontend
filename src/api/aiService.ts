import { API_ENDPOINTS, apiClient } from './client';

export interface WorkoutPlanRequest {
  weeks: number;
  focusArea?: string;
}

export interface WorkoutPlanResponse {
  weeks: number;
  focusArea: string;
  plan?: string;
  description?: string;
  title?: string;
}

export interface MotivationalMessageRequest {
  context: string;
}

export interface ExerciseExplanationRequest {
  exerciseName: string;
  difficulty?: string;
}

export interface ProgressAnalysisRequest {
  weeksBack: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

class AIService {
  /**
   * Generate a personalized workout plan
   */
  async generateWorkoutPlan(weeks: number, focusArea?: string): Promise<WorkoutPlanResponse> {
    const request: WorkoutPlanRequest = {
      weeks,
      focusArea,
    };
    
    const response = await apiClient.post<ApiResponse<WorkoutPlanResponse>>(
      `${API_ENDPOINTS.ai}/workout-plans`,
      request
    );
    
    return response.data;
  }

  /**
   * Generate a motivational message
   */
  async generateMotivationalMessage(context: string): Promise<string> {
    const request: MotivationalMessageRequest = {
      context,
    };
    
    const response = await apiClient.post<ApiResponse<string>>(
      `${API_ENDPOINTS.ai}/motivation`,
      request
    );
    
    return response.data;
  }

  /**
   * Get exercise tips and form guidance
   */
  async getExerciseTips(exerciseName: string, difficulty?: string): Promise<string> {
    const request: ExerciseExplanationRequest = {
      exerciseName,
      difficulty,
    };
    
    const response = await apiClient.post<ApiResponse<string>>(
      `${API_ENDPOINTS.ai}/exercise-tips`,
      request
    );
    
    return response.data;
  }

  /**
   * Analyze user progress and get recommendations
   */
  async analyzeProgress(weeksBack: number): Promise<string> {
    const request: ProgressAnalysisRequest = {
      weeksBack,
    };
    
    const response = await apiClient.post<ApiResponse<string>>(
      `${API_ENDPOINTS.ai}/progress-analysis`,
      request
    );
    
    return response.data;
  }

  /**
   * Check AI service health
   */
  async healthCheck(): Promise<{ status: string; service: string }> {
    return apiClient.get<{ status: string; service: string }>(`${API_ENDPOINTS.ai}/health`);
  }
}

export const aiService = new AIService();
