import React from 'react';
import { useServices } from '@/contexts/ServicesContext';
import Loader from '@/components/Loader';

interface ServicesGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ServicesGuard: React.FC<ServicesGuardProps> = ({ 
  children, 
  fallback = <Loader loaderStyle={{ color: '#ffffff' }}>Loading services...</Loader>
}) => {
  const { isInitialized } = useServices();

  if (!isInitialized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}; 