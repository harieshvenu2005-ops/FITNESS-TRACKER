import { createBrowserRouter } from 'react-router';
import Root from './pages/Root';
import Dashboard from './pages/Dashboard';
import Fitness from './pages/Fitness';
import Diet from './pages/Diet';
import Healthcare from './pages/Healthcare';
import Settings from './pages/Settings';
import Medications from './pages/Medications';
import Messages from './pages/Messages';
import Recipes from './pages/Recipes';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import { useAuth } from './contexts/AuthContext';

import { Navigate } from 'react-router';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: () => <RequireAuth><Dashboard /></RequireAuth> },
      { path: 'fitness', Component: () => <RequireAuth><Fitness /></RequireAuth> },
      { path: 'diet', Component: () => <RequireAuth><Diet /></RequireAuth> },
      { path: 'healthcare', Component: () => <RequireAuth><Healthcare /></RequireAuth> },
      { path: 'medications', Component: () => <RequireAuth><Medications /></RequireAuth> },
      { path: 'messages', Component: () => <RequireAuth><Messages /></RequireAuth> },
      { path: 'recipes', Component: () => <RequireAuth><Recipes /></RequireAuth> },
      { path: 'analytics', Component: () => <RequireAuth><Analytics /></RequireAuth> },
      { path: 'settings', Component: () => <RequireAuth><Settings /></RequireAuth> },
      { path: 'login', Component: Login },
      { path: '*', Component: NotFound },
    ],
  },
]);