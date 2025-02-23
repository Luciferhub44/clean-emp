const API_BASE_URL = '/api';  // Changed to use relative path for proxy

interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

class ApiService {
  private static getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  static async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  static async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  static async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}

export default ApiService; 