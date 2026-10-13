import { useState, useEffect } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, Database, Trash2, Download, Upload, User, UserPlus, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { get, post } from '@/utils/api';
import { toast } from 'sonner';

export default function Settings() {
  const { workouts, meals, healthMetrics, appointments, dailyStats, clearAllData } = useHealth();
  const { user } = useAuth();
  const [users, setUsers] = useState<Array<{id:string;name:string;email:string;role:string}>>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user'|'admin'>('user');

  const handleExportData = () => {
    const data = {
      workouts,
      meals,
      healthMetrics,
      appointments,
      dailyStats,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `healthtracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Data exported successfully!');
  };

  const handleImportData = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const prefix = user?.id ? `${user.id}_` : '';
        
        if (data.workouts) localStorage.setItem(`${prefix}healthtracker_workouts`, JSON.stringify(data.workouts));
        if (data.meals) localStorage.setItem(`${prefix}healthtracker_meals`, JSON.stringify(data.meals));
        if (data.healthMetrics) localStorage.setItem(`${prefix}healthtracker_health_metrics`, JSON.stringify(data.healthMetrics));
        if (data.appointments) localStorage.setItem(`${prefix}healthtracker_appointments`, JSON.stringify(data.appointments));
        if (data.dailyStats) localStorage.setItem(`${prefix}healthtracker_daily_stats`, JSON.stringify(data.dailyStats));

        toast.success('Data imported successfully!');
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toast.error('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  input.click();
};

  const totalRecords = workouts.length + meals.length + healthMetrics.length + appointments.length + dailyStats.length;

  const handleCreateUser = async () => {
    try {
      await post('/users', {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole
      });
      toast.success('User created');
      handleCancelUserForm();
      const u = await get<Array<{id:string;name:string;email:string;role:string}>>('/users');
      setUsers(u);
    } catch (e) {
      toast.error('Failed to create user');
    }
  };

  const handleCancelUserForm = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRole('user');
    setShowUserForm(false);
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      get<Array<{id:string;name:string;email:string;role:string}>>('/users')
        .then(u => setUsers(u))
        .catch(() => {});
    }
  }, [user]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your data and application settings</p>
      </div>

      {/* User profile */}
      {user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Your profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </CardContent>
        </Card>
      )}

      {user?.role === 'admin' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-500" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setShowUserForm(!showUserForm)} variant="outline">
              {showUserForm ? 'Cancel' : 'Create new user'}
            </Button>
            {showUserForm && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="newName">Name</Label>
                  <Input id="newName" value={newUserName} onChange={e => setNewUserName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="newEmail">Email</Label>
                  <Input id="newEmail" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="newPassword">Password</Label>
                  <Input id="newPassword" type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="newRole">Role</Label>
                  <Select value={newUserRole} onValueChange={v => setNewUserRole(v as any)}>
                    <SelectTrigger id="newRole">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleCreateUser} className="flex-1 bg-green-600 hover:bg-green-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User
                  </Button>
                  <Button onClick={handleCancelUserForm} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {users.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Existing users</h4>
                <ul className="space-y-1">
                  {users.map(u => (
                    <li key={u.id} className="flex justify-between">
                      <span>{u.name} ({u.email}) - {u.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            Local Storage Statistics
          </CardTitle>
          <CardDescription>
            All your data is stored locally in your browser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-semibold mt-1 text-blue-600">{totalRecords}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Workouts Logged</p>
              <p className="text-2xl font-semibold mt-1 text-green-600">{workouts.length}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Meals Tracked</p>
              <p className="text-2xl font-semibold mt-1 text-purple-600">{meals.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Health Metrics</p>
              <p className="text-2xl font-semibold mt-1 text-orange-600">{healthMetrics.length}</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <p className="text-sm text-gray-600">Appointments</p>
              <p className="text-2xl font-semibold mt-1 text-pink-600">{appointments.length}</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-gray-600">Daily Stats</p>
              <p className="text-2xl font-semibold mt-1 text-indigo-600">{dailyStats.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Export, import, or clear your health data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <Download className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Export Data</h3>
              <p className="text-sm text-gray-600 mt-1">
                Download all your health data as a JSON file for backup or transfer
              </p>
              <Button onClick={handleExportData} className="mt-3" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <Upload className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Import Data</h3>
              <p className="text-sm text-gray-600 mt-1">
                Restore your health data from a previously exported JSON file
              </p>
              <Button onClick={handleImportData} className="mt-3" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="p-2 bg-red-100 rounded-full">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Clear All Data</h3>
              <p className="text-sm text-red-700 mt-1">
                Permanently delete all your health data. This action cannot be undone.
              </p>
              <Button onClick={clearAllData} className="mt-3" variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            About HealthTracker Pro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Version:</strong> 1.0.0
          </p>
          <p>
            <strong>Storage:</strong> Browser Local Storage
          </p>
          <p className="pt-2">
            HealthTracker Pro stores all your data locally in your browser. 
            Your data is private and never leaves your device. Make sure to 
            export your data regularly as a backup.
          </p>
          <p className="text-xs text-gray-500 pt-2">
            Note: Clearing browser data or cache will delete all stored information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
