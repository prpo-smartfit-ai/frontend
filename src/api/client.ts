// Service port configuration
const SERVICE_PORTS = {
  users: 8083,
  workouts: 8081,
  ai: 8082,
};

const API_BASE_HOST = 'http://localhost';

const buildServiceUrl = (service: keyof typeof SERVICE_PORTS): string => {
  if (import.meta.env.DEV) {
    return ''; // use Vite proxy in dev
  }
  // In Docker, use service-specific ports
  const port = SERVICE_PORTS[service];
  return `${API_BASE_HOST}:${port}`;
};

export const API_ENDPOINTS = {
  users: `${buildServiceUrl('users')}/v1/users`,
  workouts: `${buildServiceUrl('workouts')}/v1/workouts`,
  ai: `${buildServiceUrl('ai')}/v1/ai`,
};

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // check if this is a login or register endpoint
      const reqUrl = response.url || '';
      const isAuthEndpoint = reqUrl.includes('/login') || reqUrl.includes('/register');

      if (response.status === 401 && !isAuthEndpoint) {
        // only clear session and redirect for protected endpoints
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      // try to parse json error, then fallback to text, then fallback to status
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        }
      } catch (e) {
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch {}
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(url: string, data: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
