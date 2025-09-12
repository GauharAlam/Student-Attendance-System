import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, GraduationCap } from 'lucide-react';

const Login: React.FC = () => {
    // --- All your existing logic remains unchanged ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading, user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (!success) {
            setError('Invalid email or password, or your account is not yet approved by a teacher.');
        }
    };
    
    React.useEffect(() => {
        if (user) {
            if (user.role === 'teacher') {
                navigate('/teacher-dashboard');
            } else {
                navigate('/student-check');
            }
        }
    }, [user, navigate]);


    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto grid w-full max-w-sm gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full btn-primary h-11 text-base font-semibold" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="underline text-primary font-semibold hover:text-indigo-800">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-10">
                 <div className="text-center">
                    <GraduationCap className="mx-auto h-24 w-24 text-indigo-600 mb-6" />
                    {/* ====== Text Changed Here ====== */}
                    <h2 className="text-4xl font-bold text-gray-800">Smart Attendance System</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
                        Welcome back! Your unified platform for effortless attendance management.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;