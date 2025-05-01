// File: components/environment/edit/EnvironmentLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/layout/Navbar';

const EnvironmentLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default EnvironmentLayout;
