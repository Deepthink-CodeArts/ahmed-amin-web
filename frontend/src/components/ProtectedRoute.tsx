import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'moderator';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and no user, redirect immediately
    if (!loading && !user) {
      console.log('ProtectedRoute: No user found, redirecting to CMS login');
      navigate('/cms', { replace: true });
      return;
    }

    // If user exists but doesn't have required role
    if (!loading && user && requiredRole) {
      const hasPermission = user.role === 'super_admin' || user.role === requiredRole;
      if (!hasPermission) {
        console.log('ProtectedRoute: Insufficient permissions, redirecting to CMS');
        navigate('/cms', { replace: true });
        return;
      }
    }
  }, [user, loading, navigate, requiredRole]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-aro-primary"></div>
      </div>
    );
  }

  // If no user, don't render children (will redirect)
  if (!user) {
    return null;
  }

  // If role required and user doesn't have it, don't render children
  if (requiredRole) {
    const hasPermission = user.role === 'super_admin' || user.role === requiredRole;
    if (!hasPermission) {
      return null;
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute; 