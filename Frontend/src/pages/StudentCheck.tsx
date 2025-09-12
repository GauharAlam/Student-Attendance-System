import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { getStudentAttendance } from '../service/studentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the AttendanceRecord type directly in the file for clarity
interface AttendanceRecord {
    date: string;
    status: 'present' | 'absent';
}

const StudentCheck: React.FC = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const data = await getStudentAttendance();
                setAttendance(data);
            } catch (err) {
                setError('Failed to fetch attendance data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []); 

    const totalClasses = attendance.length;
    const presentCount = attendance.filter(record => record.status === 'present').length;
    const absentCount = totalClasses - presentCount;
    const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
    const circumference = 2 * Math.PI * 52; // For the progress circle

    return (
        <Layout title="Student Dashboard">
            <div className="space-y-8">
                {/* ====== Student Info Card with Gradient Header ====== */}
                <Card className="card-shadow overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6">
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <User className="w-8 h-8" />
                            <span>Student Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                        <div><strong>Name:</strong> {user?.name}</div>
                        <div><strong>Email:</strong> {user?.email}</div>
                        <div><strong>Roll No:</strong> {user?.rollNo || <span className="text-orange-500">N/A (Pending Approval)</span>}</div>
                    </CardContent>
                </Card>

                {/* ====== Colorful Stat Cards ====== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Attendance Percentage Circle */}
                    <Card className="card-shadow col-span-1 md:col-span-2 lg:col-auto flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-slate-800 to-gray-900 text-white">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="#4A5568" strokeWidth="8" />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="52"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference - (attendancePercentage / 100) * circumference}
                                    transform="rotate(-90 60 60)"
                                />
                                <defs>
                                    <linearGradient id="gradient">
                                        <stop offset="0%" stopColor="#8B5CF6" />
                                        <stop offset="100%" stopColor="#3B82F6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                                {attendancePercentage}<span className="text-xl">%</span>
                            </div>
                        </div>
                        <p className="mt-4 text-lg font-medium text-gray-300">Attendance</p>
                    </Card>

                    <Card className="card-shadow bg-gradient-to-r from-blue-500 to-sky-500 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                            <Calendar className="h-5 w-5 text-blue-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalClasses}</div>
                        </CardContent>
                    </Card>
                    <Card className="card-shadow bg-gradient-to-r from-green-500 to-teal-500 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Present</CardTitle>
                            <CheckCircle className="h-5 w-5 text-green-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{presentCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="card-shadow bg-gradient-to-r from-red-500 to-orange-500 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Absent</CardTitle>
                            <XCircle className="h-5 w-5 text-red-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{absentCount}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* ====== Attendance History Table ====== */}
                <Card className="card-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-700">Attendance History</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {loading ? (
                            <p className="text-center py-4">Loading attendance...</p>
                        ) : error ? (
                            <p className="text-center py-4 text-destructive">{error}</p>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-slate-100">
                                        <TableRow>
                                            <TableHead className="font-semibold text-slate-600 uppercase text-sm">Date</TableHead>
                                            <TableHead className="text-center font-semibold text-slate-600 uppercase text-sm">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendance.length > 0 ? (
                                            attendance.map((record, index) => (
                                                <TableRow key={record.date} className={cn("transition-colors", index % 2 === 0 ? "bg-white" : "bg-slate-50", "hover:bg-violet-50")}>
                                                    <TableCell>{new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className={cn("text-xs font-semibold", record.status === 'present' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                                                            {record.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                                                    No attendance recorded yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default StudentCheck;