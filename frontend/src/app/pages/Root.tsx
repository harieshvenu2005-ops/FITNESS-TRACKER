import { Outlet, Link, useLocation } from 'react-router';
import { Activity, Apple, Heart, LayoutDashboard, Settings, Pill, MessageSquare, ChefHat, BarChart3 } from 'lucide-react';
import { HealthProvider } from '../contexts/HealthContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { Toaster } from '../components/ui/sonner';

export default function Root() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/fitness', label: 'Fitness', icon: Activity },
    { path: '/diet', label: 'Diet', icon: Apple },
    { path: '/healthcare', label: 'Healthcare', icon: Heart },
    { path: '/medications', label: 'Medications', icon: Pill },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
    { path: '/recipes', label: 'Recipes', icon: ChefHat },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];


  function AuthControls() {
    const { user, logout } = useAuth();
    if (user) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">{user.name} ({user.role})</span>
          <button
            onClick={logout}
            className="text-xs text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      );
    }
    return (
      <Link
        to="/login"
        className="text-sm text-blue-600 hover:underline"
      >
        Login
      </Link>
    );
  }

  return (
    <AuthProvider>
      <HealthProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Activity className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-semibold text-gray-900">HealthTracker Pro</span>
              </div>
              
              <nav className="flex gap-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="flex items-center gap-4">
                <AuthControls />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
      <Toaster />
      </HealthProvider>
    </AuthProvider>
  );
}