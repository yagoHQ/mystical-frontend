import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { login } from '@/api/auth.api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);

  const handleTogglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Card Container */}
      <div className="bg-gray-100 p-20 rounded-xl shadow-md max-w-md w-full space-y-6">
        {/* Heading */}
        <h1 className="text-xl font-bold text-center">Welcome</h1>

        {/* Email Address */}
        <div>
          <Label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email address
          </Label>
          <div className="relative">
            <Input
              type="email"
              id="email"
              placeholder="example@mail.com"
              className="pr-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {isEmailValid && (
              <CheckCircle2 className="absolute right-2 top-2 w-4 h-4 text-green-500" />
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="********"
              type={isPasswordVisible ? 'text' : 'password'}
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isPasswordVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Password requirements */}
        <p className="text-xs text-gray-500">
          Use at least 8 characters with 1 number, and one special character
        </p>

        {/* Error Message */}
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Logging in…' : 'LOGIN'}
        </Button>

        {/* Forgot Password */}
        <div className="text-center">
          <a href="#" className="text-sm text-gray-500 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}
