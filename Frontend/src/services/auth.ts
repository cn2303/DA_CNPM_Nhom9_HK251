// Auth service for managing authentication state
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_ROLE_KEY = 'auth_role';
const AUTH_USER_ID_KEY = 'auth_user_id';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  authenticated: boolean;
  userId: number;
  role: string;
}

export interface AuthState {
  token: string | null;
  role: string | null;
  userId: number | null;
  isAuthenticated: boolean;
}

class AuthService {
  // Save auth data to localStorage
  saveAuth(data: LoginResponse): void {
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_ROLE_KEY, data.role);
    localStorage.setItem(AUTH_USER_ID_KEY, data.userId.toString());
    console.log('✅ Auth saved:', { role: data.role, userId: data.userId });
  }

  // Get auth state from localStorage
  getAuthState(): AuthState {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const role = localStorage.getItem(AUTH_ROLE_KEY);
    const userIdStr = localStorage.getItem(AUTH_USER_ID_KEY);
    const userId = userIdStr ? parseInt(userIdStr, 10) : null;

    return {
      token,
      role,
      userId,
      isAuthenticated: !!token && !!role && !!userId
    };
  }

  // Get token for API calls
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  // Get role
  getRole(): string | null {
    return localStorage.getItem(AUTH_ROLE_KEY);
  }

  // Get userId
  getUserId(): number | null {
    const userIdStr = localStorage.getItem(AUTH_USER_ID_KEY);
    return userIdStr ? parseInt(userIdStr, 10) : null;
  }

  // Clear auth data (logout)
  clearAuth(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_ROLE_KEY);
    localStorage.removeItem(AUTH_USER_ID_KEY);
    console.log('🔓 Auth cleared');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Check if user is admin
  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ADMIN';
  }

  // Check if user is customer
  isCustomer(): boolean {
    const role = this.getRole();
    return role === 'CUSTOMER';
  }
}

export const authService = new AuthService();
