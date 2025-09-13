import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authApi, setAuthToken, getAuthToken } from '@/lib/api';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Custom setUser function with debugging
  const setUser = (newUser: User | null) => {
    console.log('setUser called with:', newUser);
    console.log('Current user state before update:', user);
    setUserState(newUser);
    console.log('setUser state update dispatched');
  };

  // Debug user state changes
  useEffect(() => {
    console.log('User state changed in AuthProvider:', user);
  }, [user]);

  useEffect(() => {
    console.log('Loading state changed in AuthProvider:', loading);
  }, [loading]);

  useEffect(() => {
    // Check if user is already logged in
    const token = getAuthToken();
    console.log('Auth initialization - Token found:', !!token); // Debug log
    
    if (token) {
      console.log('Auth initialization - Fetching current user'); // Debug log
      fetchCurrentUser();
    } else {
      console.log('Auth initialization - No token, setting loading to false'); // Debug log
      setLoading(false);
    }
  }, []);

  // Separate effect for periodic auth validation to avoid infinite loop
  useEffect(() => {
    // Only set up interval if user is logged in
    if (!user) return;

    // Set up periodic auth validation (every 15 minutes to reduce server load and false logouts)
    const authCheckInterval = setInterval(() => {
      const currentToken = getAuthToken();
      if (currentToken) {
        // Validate token is still valid by trying to fetch current user
        // Only logout on actual auth failures, not network issues
        fetchCurrentUser().catch((error) => {
          console.log('Auth validation failed:', error);
          
          // Only logout if it's an actual authentication error (401/403)
          // Don't logout for network issues or temporary server problems
          if (error.message && (
            error.message.includes('401') || 
            error.message.includes('403') || 
            error.message.includes('Unauthorized') ||
            error.message.includes('Forbidden')
          )) {
            console.log('Authentication error detected, logging out user');
            setAuthToken(null);
            setUser(null);
          } else {
            console.log('Network/server error during auth check, keeping user logged in');
          }
        });
      }
    }, 900000); // 15 minutes instead of 5 minutes

    return () => clearInterval(authCheckInterval);
  }, [user?.id]); // Only re-run when user ID changes, not the entire user object

  const fetchCurrentUser = async () => {
    try {
      console.log('Fetching current user...'); // Debug log
      const userData = await authApi.getCurrentUser();
      console.log('Current user fetched:', userData); // Debug log
      setUser(userData);
    } catch (error) {
      console.error('Error fetching current user:', error);
      
      // Only clear token and user on actual authentication errors
      // Don't logout for network/server issues
      if (error instanceof Error && (
        error.message.includes('401') || 
        error.message.includes('403') || 
        error.message.includes('Unauthorized') ||
        error.message.includes('Forbidden')
      )) {
        console.log('Authentication error detected, clearing auth state');
        setAuthToken(null);
        setUser(null);
      } else {
        console.log('Network/server error, keeping auth state intact');
        // Don't clear user state for network issues
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('SignIn called with:', { email, password: '***' }); // Debug log
    
    try {
      console.log('Making API call to login...'); // Debug log
      const loginResponse = await authApi.login(email, password);
      
      console.log('Login response received:', loginResponse); // Debug log
      console.log('Response keys:', Object.keys(loginResponse)); // Debug log
      console.log('Access token exists:', !!loginResponse.access_token); // Debug log
      
      // Validate response structure
      if (!loginResponse.access_token) {
        throw new Error('No access token in response');
      }
      
      // Set the auth token first
      console.log('Setting auth token...'); // Debug log
      setAuthToken(loginResponse.access_token);
      
      // Verify token was set
      const storedToken = getAuthToken();
      console.log('Token stored successfully:', !!storedToken); // Debug log
      console.log('Stored token length:', storedToken?.length); // Debug log
      
      // Force a small delay to ensure token is properly set in the API client
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now fetch the current user with the token
      console.log('Fetching current user...'); // Debug log
      const userData = await authApi.getCurrentUser();
      console.log('User data fetched:', userData); // Debug log
      
      if (!userData) {
        throw new Error('Failed to fetch user data');
      }
      
      // Set the user state
      console.log('Setting user state...'); // Debug log
      setUser(userData);
      
      console.log('User state set, current user:', userData); // Debug log
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      
      // Force a small delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('SignIn completed successfully'); // Debug log
      
    } catch (error: any) {
      console.error('Login error details:', error); // Debug log
      console.error('Error message:', error.message); // Debug log
      console.error('Error stack:', error.stack); // Debug log
      
      // Clear any stored token on error
      setAuthToken(null);
      setUser(null);
      
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear the auth token
      setAuthToken(null);
      
      // Clear the user
      setUser(null);
      
      // Clear CMS module state to start fresh on next login
      localStorage.removeItem('cms_active_module');
      
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Logout failed",
        variant: "destructive",
      });
    }
  };

  const hasRole = (role: string) => {
    return user?.role === role || user?.role === 'super_admin';
  };

  const isAdmin = () => {
    return user?.role === 'super_admin';
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
