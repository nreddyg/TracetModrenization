
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableButton } from '@/components/ui/reusable-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Lock, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dummy credentials for testing
  const DUMMY_CREDENTIALS = [
    { userId: 'admin', password: 'admin123', role: 'Administrator' },
    { userId: 'user1', password: 'user123', role: 'User' },
    { userId: 'manager', password: 'manager123', role: 'Manager' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check dummy credentials
    const validUser = DUMMY_CREDENTIALS.find(
      cred => cred.userId === credentials.userId && cred.password === credentials.password
    );

    if (validUser) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${validUser.role}!`,
      });
      
      // Store user info in localStorage (in real app, use proper auth)
      localStorage.setItem('user', JSON.stringify(validUser));
      navigate('/');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid User ID or Password",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleSSO = () => {
    toast({
      title: "SSO Login",
      description: "SSO integration would be implemented here",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tracet</h1>
            <p className="text-muted-foreground mt-1">Asset Management System</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Welcome Back</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <ReusableInput
                label="User ID"
                type="text"
                value={credentials.userId}
                onChange={(e) => setCredentials({ ...credentials, userId: e.target.value })}
                prefixIcon={<User className="h-4 w-4" />}
                placeholder="Enter your User ID"
                required
              />
              
              <ReusableInput
                label="Password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                prefixIcon={<Lock className="h-4 w-4" />}
                placeholder="Enter your password"
                showPasswordToggle
                required
              />

              <ReusableButton
                type="submit"
                className="w-full"
                loading={loading}
              >
                Sign In
              </ReusableButton>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <ReusableButton
              variant="outline"
              className="w-full"
              onClick={handleSSO}
            >
              <Building2 className="h-4 w-4 mr-2" />
              SSO Login
            </ReusableButton>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Demo Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {DUMMY_CREDENTIALS.map((cred, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="font-mono">{cred.userId} / {cred.password}</span>
                <Badge variant="outline" className="text-xs">
                  {cred.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © 2024 Tracet. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
