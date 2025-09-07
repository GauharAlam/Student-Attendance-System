import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAttendance } from '../contexts/AttendanceContext';
import { mockStudents } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, User, Calendar as CalendarDays, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const StudentCheck: React.FC = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [attendanceRecords, setAttendanceRecords] = useState<Array<{date: string, status: 'present' | 'absent'}>>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const { getStudentAttendance } = useAttendance();
  const { toast } = useToast();

  const handleViewAttendance = () => {
    if (!rollNumber || !fromDate || !toDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in roll number and both dates.",
        variant: "destructive",
      });
      return;
    }

    const student = mockStudents.find(s => s.rollNo.toLowerCase() === rollNumber.toLowerCase());
    
    if (!student) {
      toast({
        title: "Student Not Found",
        description: "No student found with this roll number.",
        variant: "destructive",
      });
      setAttendanceRecords([]);
      setSelectedStudent(null);
      return;
    }

    const records = getStudentAttendance(
      student.id,
      format(fromDate, 'yyyy-MM-dd'),
      format(toDate, 'yyyy-MM-dd')
    );

    setAttendanceRecords(records);
    setSelectedStudent(student);

    toast({
      title: "Attendance Retrieved",
      description: `Found ${records.length} attendance records for ${student.name}.`,
    });
  };

  const calculateStats = () => {
    if (attendanceRecords.length === 0) return { present: 0, absent: 0, percentage: 0 };
    
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.length - present;
    const percentage = (present / attendanceRecords.length) * 100;
    
    return { present, absent, percentage };
  };

  const stats = calculateStats();

  return (
    <Layout title="Check Attendance">
      <div className="space-y-6">
        {/* Search Card */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search Attendance Records</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  placeholder="Enter roll number (e.g., CS001)"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : <span>Select from date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : <span>Select to date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button onClick={handleViewAttendance} className="btn-primary">
              <Search className="w-4 h-4 mr-2" />
              View Attendance
            </Button>
          </CardContent>
        </Card>

        {/* Student Info and Stats */}
        {selectedStudent && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="card-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Student</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{selectedStudent.name}</div>
                <p className="text-sm text-muted-foreground">{selectedStudent.rollNo}</p>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Days</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendanceRecords.length}</div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present Days</CardTitle>
                <div className="h-4 w-4 bg-success rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{stats.present}</div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance %</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-2xl font-bold",
                  stats.percentage >= 75 ? "text-success" : 
                  stats.percentage >= 50 ? "text-warning" : "text-destructive"
                )}>
                  {stats.percentage.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendance Records Table */}
        {attendanceRecords.length > 0 && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Day</th>
                      <th className="text-center py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record, index) => {
                      const date = new Date(record.date);
                      const dayName = format(date, 'EEEE');
                      
                      return (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">
                            {format(date, 'PPP')}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {dayName}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-sm font-medium",
                              record.status === 'present' 
                                ? "bg-success/10 text-success" 
                                : "bg-destructive/10 text-destructive"
                            )}>
                              {record.status === 'present' ? 'Present' : 'Absent'}
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
        )}

        {/* Empty State */}
        {rollNumber && fromDate && toDate && attendanceRecords.length === 0 && selectedStudent === null && (
          <Card className="card-shadow">
            <CardContent className="py-8 text-center">
              <div className="text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Records Found</p>
                <p>Please check the roll number and try again.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default StudentCheck;