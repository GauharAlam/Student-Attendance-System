import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAttendance } from '../contexts/AttendanceContext';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const StudentCheck: React.FC = () => {
    const { user, isLoading } = useAuth(); // Destructure isLoading
    const { attendanceData } = useAttendance();

    // 1. Handle the loading state
    if (isLoading) {
        return (
            <Layout title="Loading...">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </Layout>
        );
    }

    // 2. Handle the case where there is no user after loading
    if (!user) {
        return (
            <Layout title="Student Attendance">
                <div className="text-center">
                    <p>Could not load student data. Please try logging in again.</p>
                </div>
            </Layout>
        );
    }

    // Calculate attendance percentage using the logged-in user's ID
    let totalDays = 0;
    let presentCount = 0;

    Object.values(attendanceData).forEach(dayAttendance => {
        // This line is now safe because we've already checked for isLoading and user
        if (dayAttendance[user.id]) {
            totalDays++;
            if (dayAttendance[user.id] === 'present') {
                presentCount++;
            }
        }
    });

    const attendancePercentage = totalDays > 0 ? (presentCount / totalDays) * 100 : 0;

    return (
        <Layout title="Your Attendance">
            <div className="space-y-6">
                <Card className="card-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl">Welcome, {user.name}!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Roll No</p>
                                <p className="text-lg font-bold">{user.rollNo || 'Not Assigned'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Classes</p>
                                <p className="text-lg font-bold">{totalDays}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Classes Attended</p>
                                <p className="text-lg font-bold text-success">{presentCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-shadow">
                    <CardHeader>
                        <CardTitle>Attendance Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-primary">Attendance</span>
                                <span className="text-sm font-medium text-primary">{attendancePercentage.toFixed(1)}%</span>
                            </div>
                            <Progress value={attendancePercentage} className="w-full" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            You were present for {presentCount} out of {totalDays} classes. Keep it up!
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Daily Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium">Date</th>
                                        <th className="text-center py-3 px-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(attendanceData)
                                        .map(([date, dayAttendance]) => {
                                            const status = dayAttendance[user.id];
                                            if (!status) return null;

                                            return (
                                                <tr key={date} className="border-b hover:bg-muted/50">
                                                    <td className="py-3 px-4">{date}</td>
                                                    <td className={cn(
                                                        "py-3 px-4 text-center font-medium",
                                                        status === 'present' ? 'text-success' : 'text-destructive'
                                                    )}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                        .reverse()}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default StudentCheck;