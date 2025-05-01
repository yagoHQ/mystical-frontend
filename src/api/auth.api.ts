// src/api/auth.api.ts

import { handleApiError } from './handleApiError';
import apiClient from './interceptors';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    const { data } = await apiClient.post<LoginResponse>(
      '/api/auth/login',
      credentials
    );
    // Persist token for future requests
    localStorage.setItem('token', data.token);

    return data.user;
  } catch (err) {
    // handleApiError returns a string message
    const message = handleApiError(err);
    throw new Error(message);
  }
}

/**
 * Remove stored auth data and (optionally) redirect to login page.
 */
export function logout(redirect = true) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  if (redirect) {
    window.location.href = '/auth/login';
  }
}
