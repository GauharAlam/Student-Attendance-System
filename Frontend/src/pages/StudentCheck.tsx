import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { getStudentAttendance } from '../service/studentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    const circumference = 2 * Math.PI * 52;

    return (
        <Layout title="Student Dashboard">
            <div className="space-y-10 p-4 md:p-6 lg:p-8">
                {/* ====== Student Info Card ====== */}
                <Card className="rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                    <CardHeader className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white p-6">
                        <CardTitle className="flex items-center gap-3 text-2xl font-bold tracking-wide">
                            <User className="w-8 h-8" />
                            <span>Student Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-700">
                        <div className="p-3 rounded-lg bg-slate-50 shadow-sm">
                            <strong className="block text-slate-600">Name</strong>
                            <span className="text-lg font-medium">{user?.name}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50 shadow-sm">
                            <strong className="block text-slate-600">Email</strong>
                            <span className="text-lg font-medium">{user?.email}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50 shadow-sm">
                            <strong className="block text-slate-600">Roll No</strong>
                            {user?.rollNo ? (
                                <span className="text-lg font-medium">{user?.rollNo}</span>
                            ) : (
                                <span className="text-orange-500 font-semibold">N/A (Pending Approval)</span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ====== Stat Cards ====== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Attendance Circle */}
                    <Card className="rounded-2xl shadow-lg col-span-1 md:col-span-2 lg:col-auto flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white">
                        <div className="relative w-36 h-36">
                            <svg className="w-full h-full" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="#374151" strokeWidth="10" />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="52"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference - (attendancePercentage / 100) * circumference}
                                    transform="rotate(-90 60 60)"
                                />
                                <defs>
                                    <linearGradient id="gradient">
                                        <stop offset="0%" stopColor="#a78bfa" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold">
                                {attendancePercentage}<span className="text-xl">%</span>
                            </div>
                        </div>
                        <p className="mt-4 text-lg font-medium text-indigo-200">Attendance</p>
                    </Card>

                    {/* Total Classes */}
                    <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-blue-500 to-sky-500 hover:scale-105 transform transition-all text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-semibold tracking-wide">Total Classes</CardTitle>
                            <Calendar className="h-5 w-5 text-blue-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalClasses}</div>
                        </CardContent>
                    </Card>

                    {/* Present */}
                    <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transform transition-all text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-semibold tracking-wide">Present</CardTitle>
                            <CheckCircle className="h-5 w-5 text-green-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{presentCount}</div>
                        </CardContent>
                    </Card>

                    {/* Absent */}
                    <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-red-500 to-orange-500 hover:scale-105 transform transition-all text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-semibold tracking-wide">Absent</CardTitle>
                            <XCircle className="h-5 w-5 text-red-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{absentCount}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* ====== Attendance History ====== */}
                <Card className="rounded-2xl shadow-lg border border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-800">Attendance History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p className="text-center py-6 animate-pulse">Loading attendance...</p>
                        ) : error ? (
                            <p className="text-center py-6 text-red-500">{error}</p>
                        ) : (
                            <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-200 shadow-inner">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-gradient-to-r from-slate-100 to-slate-200 shadow-sm">
                                        <TableRow>
                                            <TableHead className="font-bold text-slate-700 uppercase text-xs">Date</TableHead>
                                            <TableHead className="text-center font-bold text-slate-700 uppercase text-xs">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendance.length > 0 ? (
                                            attendance.map((record, index) => (
                                                <TableRow
                                                    key={record.date}
                                                    className={cn(
                                                        "transition-colors duration-200",
                                                        index % 2 === 0 ? "bg-white" : "bg-slate-50",
                                                        "hover:bg-violet-50/70"
                                                    )}
                                                >
                                                    <TableCell>
                                                        {new Date(record.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge
                                                            className={cn(
                                                                "px-3 py-1 rounded-full text-xs font-semibold shadow-sm",
                                                                record.status === 'present'
                                                                    ? "bg-green-100 text-green-700 border border-green-300"
                                                                    : "bg-red-100 text-red-700 border border-red-300"
                                                            )}
                                                        >
                                                            {record.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center py-10 text-slate-500">
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
