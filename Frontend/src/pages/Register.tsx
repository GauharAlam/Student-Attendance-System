import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User as UserIcon, Mail, Lock, Users, GraduationCap } from 'lucide-react'; // Removed KeyRound
import { useToast } from '@/hooks/use-toast';
import { registerUser } from '../service/authService'; // Removed verifyOtp

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [otp, setOtp] = useState(''); // REMOVED
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    // const [isOtpSent, setIsOtpSent] = useState(false); // REMOVED
    const [error, setError] = useState('');
    const { login, isLoading, setIsLoading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !role) {
            setError('Please fill in all fields');
            return;
        }
        setIsLoading(true);
        try {
            // Step 1: Call authService to register the user.
            // We're ignoring the 'response' since the backend now sends a simple success.
            await registerUser({ name, email, password, role });

            // Step 2: Show a success toast.
            toast({
                title: "Registration Successful",
                description: "Logging you in...",
            });

            // Step 3: Immediately log the user in.
            const success = await login(email, password);
            if (success) {
                // Step 4: Navigate to the correct dashboard.
                navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-check');
            } else {
                // This is an edge case (registration worked but login failed)
                setError('Registration successful, but login failed. Please go to the login page.');
                navigate('/login');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
            setError(errorMessage);
            toast({
                title: "Registration Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // const handleVerifyOtp = ... // ENTIRE FUNCTION DELETED

    const renderRegisterForm = () => (
        <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="pl-10" />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10"/>
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                 <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10"/>
                </div>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                 <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                        className="flex h-10 w-full appearance-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                </div>
            </div>
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <Button type="submit" className="w-full btn-primary h-11 text-base font-semibold" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create an account'}
            </Button>
        </form>
    );

    // const renderOtpForm = ... // ENTIRE FUNCTION DELETED

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto grid w-full max-w-sm gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your information to get started
                        </p>
                    </div>
                    
                    {renderRegisterForm()}
                    
                    <div className="mt-4 text-center text-sm">
                         <p className="text-muted-foreground">Already have an account?{' '}
                        <Link to="/login" className="underline text-primary font-semibold hover:text-indigo-800">
                            Login
                        </Link></p>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-10">
                 <div className="text-center">
                    <GraduationCap className="mx-auto h-24 w-24 text-indigo-600 mb-6" />
                    {/* ====== Text Changed Here ====== */}
                    <h2 className="text-4xl font-bold text-gray-800">Smart Attendance System</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
                       A unified platform for students and teachers to manage attendance effortlessly.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;