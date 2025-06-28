import { supabase } from './supabase';
import { AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export async function signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { success: false, error: getErrorMessage(error) };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: getErrorMessage(error) };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, error: getErrorMessage(error) };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return { success: false, error: getErrorMessage(error) };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

function getErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'Email not confirmed':
      return 'Please check your email and click the confirmation link before signing in.';
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.';
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.';
    case 'Signup is disabled':
      return 'Account registration is currently disabled. Please contact support.';
    case 'Email rate limit exceeded':
      return 'Too many emails sent. Please wait a few minutes before trying again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}