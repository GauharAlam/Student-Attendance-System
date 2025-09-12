import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';
import { useAttendance } from '../contexts/AttendanceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, Save, Users, UserCheck, UserX, UserRound } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getUnapprovedStudents, approveStudent, getApprovedStudents } from '../service/teacherService';
import { User } from '../types';
import { Label } from '@/components/ui/label';

const TeacherDashboard: React.FC = () => {
    // States & context
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [attendance, setAttendance] = useState<{ [studentId: string]: boolean }>({});
    const [unapprovedStudents, setUnapprovedStudents] = useState<User[]>([]);
    const [approvedStudents, setApprovedStudents] = useState<User[]>([]);
    const { attendanceData, saveAttendance } = useAttendance();
    const { toast } = useToast();
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    // Fetch students
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
                title: "Error ❌",
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

    // Attendance handlers
    const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
        setAttendance(prev => ({ ...prev, [studentId]: isPresent }));
    };

    const handleSaveAttendance = async () => {
        const recordsToSave: { [studentId: string]: 'present' | 'absent' } = {};
        Object.entries(attendance).forEach(([studentId, isPresent]) => {
            recordsToSave[studentId] = isPresent ? "present" : "absent";
        });

        try {
            await saveAttendance(dateString, recordsToSave);
            toast({
                title: "✅ Attendance Saved",
                description: `Attendance for ${format(selectedDate, "PPP")} has been saved successfully.`,
            });
        } catch (err: any) {
            toast({
                title: "Error ❌",
                description: err.response?.data?.error || "Something went wrong while saving attendance",
                variant: "destructive",
            });
        }
    };

    const handleApproveStudent = async (studentId: string) => {
        try {
            const { student: approvedStudent } = await approveStudent(studentId);
            toast({
                title: "🎉 Student Approved",
                description: "The student has been successfully approved.",
            });
            setUnapprovedStudents(prev => prev.filter(student => student._id !== studentId));
            setApprovedStudents(prev => [...prev, approvedStudent]);
        } catch {
            toast({
                title: "Error ❌",
                description: "Failed to approve the student.",
                variant: "destructive",
            });
        }
    };

    // CSV Report
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
            title: "📥 Report Downloaded",
            description: "Attendance report has been downloaded successfully.",
        });
    };

    const presentCount = Object.values(attendance).filter(Boolean).length;
    const totalStudents = approvedStudents.length;

    return (
        <Layout title="Teacher Dashboard">
            <div className="space-y-10">

                {/* ====== Stats Section with Modern Gradient Cards ====== */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="card-shadow bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white hover:scale-105 transition-transform duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100">Total Students</CardTitle>
                            <UserRound className="h-6 w-6 text-blue-200" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{totalStudents}</div>
                        </CardContent>
                    </Card>

                    <Card className="card-shadow bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 text-white hover:scale-105 transition-transform duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-green-100">Present Today</CardTitle>
                            <UserCheck className="h-6 w-6 text-green-200" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{presentCount}</div>
                        </CardContent>
                    </Card>

                    <Card className="card-shadow bg-gradient-to-br from-red-400 via-pink-500 to-orange-500 text-white hover:scale-105 transition-transform duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-red-100">Absent Today</CardTitle>
                            <UserX className="h-6 w-6 text-red-200" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{totalStudents - presentCount}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* ====== Approve Students ====== */}
                <Card className="card-shadow hover:shadow-xl transition duration-300">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-indigo-700">Approve New Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {unapprovedStudents.length > 0 ? (
                            <div className="overflow-x-auto rounded-lg">
                                <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gradient-to-r from-slate-200 to-slate-100">
                                        <tr>
                                            <th className="py-3 px-4 text-left font-semibold text-slate-700 uppercase text-sm">Student Name</th>
                                            <th className="py-3 px-4 text-left font-semibold text-slate-700 uppercase text-sm">Email</th>
                                            <th className="py-3 px-4 text-center font-semibold text-slate-700 uppercase text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {unapprovedStudents.map((student, i) => (
                                            <tr key={student._id} className={cn("transition-colors", i % 2 === 0 ? "bg-white" : "bg-slate-50", "hover:bg-indigo-50")}>
                                                <td className="py-3 px-4">{student.name}</td>
                                                <td className="py-3 px-4">{student.email}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <Button
                                                        onClick={() => handleApproveStudent(student._id)}
                                                        size="sm"
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
                            <p className="text-center py-6 text-gray-500">No students are currently pending approval 🎉</p>
                        )}
                    </CardContent>
                </Card>

                {/* ====== Attendance Controls ====== */}
                <Card className="card-shadow hover:shadow-xl transition duration-300">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-indigo-700">Attendance Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <div className="space-y-2">
                                <Label className="font-semibold text-gray-700">Select Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-[240px] justify-start text-left font-medium bg-white hover:bg-slate-100 border"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 shadow-lg" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => date && setSelectedDate(date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="flex gap-3 pt-2 sm:pt-7">
                                <Button onClick={handleSaveAttendance} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <Save className="w-4 h-4 mr-2" /> Save Attendance
                                </Button>
                                <Button onClick={generateReport} variant="outline" className="bg-white border hover:bg-slate-100">
                                    <Download className="w-4 h-4 mr-2" /> Download Report
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ====== Attendance Sheet ====== */}
                <Card className="card-shadow hover:shadow-xl transition duration-300">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-indigo-700">
                            Attendance Sheet - <span className="text-indigo-500">{format(selectedDate, 'PPP')}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-lg">
                            <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
                                <thead className="bg-gradient-to-r from-slate-200 to-slate-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left font-semibold text-slate-700 uppercase text-sm">Roll No</th>
                                        <th className="py-3 px-4 text-left font-semibold text-slate-700 uppercase text-sm">Student Name</th>
                                        <th className="py-3 px-4 text-center font-semibold text-slate-700 uppercase text-sm">Present</th>
                                        <th className="py-3 px-4 text-center font-semibold text-slate-700 uppercase text-sm">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {approvedStudents.map((student, i) => {
                                        const isPresent = attendance[student._id] || false;
                                        return (
                                            <tr key={student._id} className={cn("transition-colors", i % 2 === 0 ? "bg-white" : "bg-slate-50", "hover:bg-indigo-50")}>
                                                <td className="py-3 px-4 font-medium">{student.rollNo || 'N/A'}</td>
                                                <td className="py-3 px-4">{student.name}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <Checkbox
                                                        checked={isPresent}
                                                        onCheckedChange={(checked) => handleAttendanceChange(student._id, checked === true)}
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", isPresent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
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
