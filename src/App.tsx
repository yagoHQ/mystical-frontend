import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardLayout from './layout/DashboardLayout';
import { JSX } from 'react';
import DashboardPage from './pages/Dashboard';
import Environment from './components/environment/Environment';
import EnvironmentDetail from './components/environment/details/EnvironmentDetail';
import EnvironmentEditPage from './pages/EnvironmentEdit';
import EnvironmentLayout from './components/environment/edit/EnvironmentLayout';

const isAuthenticated = localStorage.getItem('token') !== null;

const RedirectRoute = () => {
  return isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />;
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated ? children : <Navigate to="/auth/login" />;
};

const appRouter = createBrowserRouter([
  {
    path: '/auth/login',
    element: <RedirectRoute />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '/environment',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Environment />,
      },
      {
        path: ':id',
        element: <EnvironmentDetail />,
      },
    ],
  },
  {
    path: '/environment/:id/edit',
    element: (
      <ProtectedRoute>
        <EnvironmentLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <EnvironmentEditPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/auth/login" />,
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
