import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function Login() {
  const { login, register, user } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isRegister ? 'Register' : 'Login'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRegister && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            {isRegister ? 'Create account' : 'Log in'}
          </Button>
          <p className="text-sm text-center mt-2">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-600 hover:underline"
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
