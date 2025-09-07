import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { registerUser, verifyOtp } from '@/service/authService';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [isOtpSent, setIsOtpSent] = useState(false);
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
            // ✅ **FIX: Added the 'role' to the registration data payload**
            await registerUser({ name, email, password, role });
            toast({
                title: "Registration Pending",
                description: "An OTP has been sent to your email. Please verify to continue.",
            });
            setIsOtpSent(true);
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

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!otp) {
            setError('Please enter the OTP');
            return;
        }
        setIsLoading(true);
        try {
            await verifyOtp({ email, otp });
            toast({
                title: "Verification Successful",
                description: "You can now log in with your credentials",
            });

            // Auto-login after OTP verification
            const success = await login(email, password);
            if (success) {
                // Navigate based on the role selected during registration
                navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-check');
            } else {
                // If auto-login fails, redirect to the login page
                navigate('/login');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'OTP verification failed';
            setError(errorMessage);
            toast({
                title: "Verification Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="card-shadow-lg">
                    <CardHeader className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="flex items-center justify-center w-16 h-16 gradient-primary rounded-xl">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            {isOtpSent ? "Verify Your Account" : "Register"}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            {isOtpSent
                                ? "Enter the OTP sent to your email"
                                : "Create your account to get started"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={isOtpSent ? handleVerifyOtp : handleRegister} className="space-y-4">
                            {!isOtpSent && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <select
                                            id="role"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                                            className="w-full border border-input rounded-md px-3 py-2 text-sm"
                                        >
                                            <option value="student">Student</option>
                                            <option value="teacher">Teacher</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {isOtpSent && (
                                <div className="space-y-2">
                                    <Label htmlFor="otp">OTP</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter the 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            )}

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                className="w-full btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {isOtpSent ? "Verifying..." : "Registering..."}
                                    </>
                                ) : (
                                    isOtpSent ? "Verify & Register" : "Register"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;