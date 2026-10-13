import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { HealthProvider } from './contexts/HealthContext';

export default function App() {
  return (
    <AuthProvider>
      <HealthProvider>
        <RouterProvider router={router} />
      </HealthProvider>
    </AuthProvider>
  );
}