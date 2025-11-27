import { apiClient, API_ENDPOINTS } from './client';
import type { User, ApiResponse, AuthResponse } from '../types';

export const userService = {
  // authentication
  async register(email: string, password: string, firstName: string, lastName: string): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post(`${API_ENDPOINTS.users}/register`, {
      email,
      password,
      firstName,
      lastName,
    });
  },

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post(`${API_ENDPOINTS.users}/login`, { email, password });
  },
};
