import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';
import { useAttendance } from '../contexts/AttendanceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, Save, Users, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getUnapprovedStudents, approveStudent, getApprovedStudents } from '../service/teacherService';
import { User } from '../types';
import { Label } from '@/components/ui/label';

const TeacherDashboard: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [attendance, setAttendance] = useState<{ [studentId: string]: boolean }>({});
    const [unapprovedStudents, setUnapprovedStudents] = useState<User[]>([]);
    const [approvedStudents, setApprovedStudents] = useState<User[]>([]);
    const { saveAttendance, attendanceData } = useAttendance();
    const { toast } = useToast();
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    const fetchStudents = async () => {
        try {
            const [unapproved, approved] = await Promise.all([
                getUnapprovedStudents(),
                getApprovedStudents()
            ]);
            setUnapprovedStudents(unapproved);
            setApprovedStudents(approved);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            toast({
                title: "Error",
                description: "Failed to fetch student lists.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        const existingAttendance = attendanceData[dateString] || {};
        const loadedAttendance: { [studentId: string]: boolean } = {};
        approvedStudents.forEach(student => {
            loadedAttendance[student._id] = existingAttendance[student._id] === 'present';
        });
        setAttendance(loadedAttendance);
    }, [selectedDate, attendanceData, dateString, approvedStudents]);

    const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
        setAttendance(prev => ({ ...prev, [studentId]: isPresent }));
    };

    const handleSaveAttendance = () => {
        const attendanceRecord: { [studentId: string]: 'present' | 'absent' } = {};
        Object.entries(attendance).forEach(([studentId, isPresent]) => {
            attendanceRecord[studentId] = isPresent ? 'present' : 'absent';
        });
        saveAttendance(dateString, attendanceRecord);
        toast({
            title: "Attendance Saved",
            description: `Attendance for ${format(selectedDate, 'PPP')} has been saved successfully.`,
        });
    };

    const handleApproveStudent = async (studentId: string) => {
        try {
            await approveStudent(studentId);
            toast({
                title: "Student Approved",
                description: "The student has been successfully approved.",
            });
            fetchStudents(); // Refresh both lists
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve the student.",
                variant: "destructive",
            });
        }
    };

    const generateReport = () => {
        const reportData = approvedStudents.map(student => {
            let totalDays = 0;
            let presentCount = 0;

            Object.entries(attendanceData).forEach(([, dayAttendance]) => {
                if (dayAttendance[student._id]) {
                    totalDays++;
                    if (dayAttendance[student._id] === 'present') {
                        presentCount++;
                    }
                }
            });

            const percentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(1) : '0.0';

            return {
                rollNo: student.rollNo || 'N/A',
                name: student.name,
                totalDays,
                presentCount,
                absentCount: totalDays - presentCount,
                percentage: `${percentage}%`
            };
        });

        const headers = ['Roll No', 'Name', 'Total Days', 'Present', 'Absent', 'Attendance %'];
        const csvContent = [
            headers.join(','),
            ...reportData.map(row => [
                row.rollNo,
                `"${row.name}"`,
                row.totalDays,
                row.presentCount,
                row.absentCount,
                row.percentage
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `attendance-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);

        toast({
            title: "Report Downloaded",
            description: "Attendance report has been downloaded successfully.",
        });
    };

    const presentCount = Object.values(attendance).filter(Boolean).length;
    const totalStudents = approvedStudents.length;

    return (
        <Layout title="Teacher Dashboard">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="card-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalStudents}</div>
                        </CardContent>
                    </Card>
                    <Card className="card-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                            <div className="h-4 w-4 bg-success rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-success">{presentCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="card-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
                            <div className="h-4 w-4 bg-destructive rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{totalStudents - presentCount}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="card-shadow">
                    <CardHeader><CardTitle>Approve Students</CardTitle></CardHeader>
                    <CardContent>
                        {unapprovedStudents.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium">Student Name</th>
                                            <th className="text-left py-3 px-4 font-medium">Email</th>
                                            <th className="text-center py-3 px-4 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {unapprovedStudents.map((student) => (
                                            <tr key={student._id} className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-4">{student.name}</td>
                                                <td className="py-3 px-4">{student.email}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <Button
                                                        onClick={() => handleApproveStudent(student._id)}
                                                        size="sm"
                                                        className="btn-primary"
                                                    >
                                                        <UserCheck className="w-4 h-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No students are currently pending approval.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="card-shadow">
                    <CardHeader>
                        <CardTitle>Mark Attendance & Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                            <div className="space-y-2">
                                <Label>Select Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !selectedDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => date && setSelectedDate(date)}
                                            initialFocus
                                            className="pointer-events-auto"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSaveAttendance} className="btn-primary">
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Attendance
                                </Button>
                                <Button onClick={generateReport} variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Report
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="card-shadow">
                    <CardHeader><CardTitle>Attendance Sheet - {format(selectedDate, 'PPP')}</CardTitle></CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium">Roll No</th>
                                        <th className="text-left py-3 px-4 font-medium">Student Name</th>
                                        <th className="text-center py-3 px-4 font-medium">Present</th>
                                        <th className="text-center py-3 px-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {approvedStudents.map((student) => {
                                        const isPresent = attendance[student._id] || false;
                                        return (
                                            <tr key={student._id} className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-4 font-medium">{student.rollNo || 'N/A'}</td>
                                                <td className="py-3 px-4">{student.name}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <Checkbox
                                                        checked={isPresent}
                                                        onCheckedChange={(checked) => handleAttendanceChange(student._id, checked === true)}
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", isPresent ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                                                        {isPresent ? 'Present' : 'Absent'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default TeacherDashboard;