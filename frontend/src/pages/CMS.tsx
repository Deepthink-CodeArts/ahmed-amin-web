import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/cms/LoginForm';
import CMSLayout from '@/components/cms/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const CMS = () => {
  const { user, loading } = useAuth();
  const [renderKey, setRenderKey] = useState(0);

  // Debug user state changes
  useEffect(() => {
    console.log('CMS component - User state changed:', user);
    console.log('CMS component - Loading state:', loading);
    
    // Force re-render when user state changes
    if (user && !loading) {
      setRenderKey(prev => prev + 1);
    }
  }, [user, loading]);

  if (loading) {
    console.log('CMS: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-aro-primary"></div>
      </div>
    );
  }

  // Show login form if user is not authenticated
  if (!user) {
    console.log('CMS: Showing login form - authentication required');
    return <LoginForm key={`login-${renderKey}`} />;
  }

  console.log('CMS: User authenticated, showing CMS layout');
  return (
    <ProtectedRoute>
      <CMSLayout key={`cms-${renderKey}`} />
    </ProtectedRoute>
  );
};

export default CMS;
