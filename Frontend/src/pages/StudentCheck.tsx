import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { getStudentAttendance, AttendanceRecord } from '../service/studentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, CheckCircle, XCircle } from 'lucide-react';

const StudentCheck: React.FC = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // ✅ CHANGE: Removed the approval check to fetch attendance for all students.
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
    }, []); // useEffect will run once when the component mounts

    const totalClasses = attendance.length;
    const presentCount = attendance.filter(record => record.status === 'present').length;
    const absentCount = totalClasses - presentCount;
    const attendancePercentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : '0.0';

    return (
        <Layout title="Student Dashboard">
            <div className="space-y-6">
                <Card className="card-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-6 h-6" />
                            Student Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><strong>Name:</strong> {user?.name}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Roll No:</strong> {user?.rollNo || 'N/A (Pending Approval)'}</p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="card-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalClasses}</div>
                        </CardContent>
                    </Card>
                    <Card className="card-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Present</CardTitle>
                            <CheckCircle className="h-4 w-4 text-success" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-success">{presentCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="card-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Absent</CardTitle>
                            <XCircle className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{absentCount}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="card-shadow">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Attendance History</CardTitle>
                            <Badge variant="outline">
                                Attendance: {attendancePercentage}%
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                         {loading ? (
                            <p>Loading attendance...</p>
                        ) : error ? (
                            <p className="text-destructive">{error}</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendance.length > 0 ? (
                                        attendance.map((record) => (
                                            <TableRow key={record.date}>
                                                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={record.status === 'present' ? 'success' : 'destructive'}>
                                                        {record.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center">
                                                No attendance recorded yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default StudentCheck;