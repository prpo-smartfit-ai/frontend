// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// api error
export interface ApiError {
  error?: string;
  message?: string;
}
