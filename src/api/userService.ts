import { apiClient, API_ENDPOINTS } from './client';
import type { User, ApiResponse } from '../types';

export const userService = {
  // Authentication
  async register(email: string, password: string, firstName: string, lastName: string): Promise<ApiResponse<User>> {
    return apiClient.post(`${API_ENDPOINTS.users}/register`, {
      email,
      password,
      firstName,
      lastName,
    });
  },

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiClient.post(`${API_ENDPOINTS.users}/login`, { email, password });
  },
};
