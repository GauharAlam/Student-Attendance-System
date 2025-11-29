import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// DUMMY DATA: Define a student type (align with your 'types/index.ts')
interface Student {
  _id: string;
  rollNo: string;
  name: string;
}

// DUMMY DATA: Replace with API call result
const dummyStudents: Student[] = [
  { _id: "s1", rollNo: "101", name: "Amit Singh" },
  { _id: "s2", rollNo: "102", name: "Priya Jain" },
  { _id: "s3", rollNo: "103", name: "Rohan Gupta" },
  { _id: "s4", rollNo: "104", name: "Sneha Reddy" },
  { _id: "s5", rollNo: "105", name: "Vikram Mehra" },
];

const MarkAttendance: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, boolean>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleLoadStudents = () => {
    // TODO: Replace with actual API call to fetch students for 'date'
    // e.g., const data = await getStudentsForDate(date);
    setIsLoading(true);
    setTimeout(() => {
      setStudents(dummyStudents);
      // Initialize attendance map (all false by default)
      const newAttendance = new Map<string, boolean>();
      dummyStudents.forEach((s) => newAttendance.set(s._id, false));
      setAttendance(newAttendance);
      setIsLoading(false);
    }, 1000);
  };

  const handleToggleAttendance = (studentId: string) => {
    setAttendance((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(studentId, !newMap.get(studentId));
      return newMap;
    });
  };

  const handleSaveAttendance = () => {
    // TODO: Replace with actual API call to save attendance
    // const attendanceData = Array.from(attendance.entries()).map(([studentId, isPresent]) => ({ studentId, isPresent }));
    // await saveAttendance({ date, attendance: attendanceData });
    setIsSaving(true);
    console.log("Saving Attendance:", Array.from(attendance.entries()));
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Attendance Saved",
        description: `Attendance for ${format(
          date || new Date(),
          "PPP"
        )} has been saved.`,
      });
    }, 1500);
  };

  const isPresent = (studentId: string) => {
    return attendance.get(studentId) || false;
  };

  return (
    <div className="flex h-full flex-col p-4 pt-6 md:p-8">
      {/* 1. Page Title */}
      <h2 className="text-3xl font-bold tracking-tight">Mark Attendance</h2>

      {/* 2. Controls Card */}
      <Card className="my-6">
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
          <CardDescription>
            Choose a date to load the student list for attendance.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal sm:w-[280px]",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={handleLoadStudents}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "Loading..." : "Load Students"}
          </Button>
        </CardContent>
      </Card>

      {/* 3. Students Table
        - flex-1 and min-h-0 on the parent allow the table wrapper to scroll
      */}
      <div className="relative flex-1 rounded-lg border shadow-sm">
        {/* Table container with scrolling */}
        <div className="relative h-full overflow-y-auto rounded-lg">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
              <TableRow>
                <TableHead className="w-[100px]">Roll No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px] text-center">Present</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">
                      {student.rollNo}
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          isPresent(student._id) ? "default" : "outline"
                        }
                        className={
                          isPresent(student._id)
                            ? "border-transparent bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {isPresent(student._id) ? "Present" : "Absent"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={isPresent(student._id)}
                        onCheckedChange={() =>
                          handleToggleAttendance(student._id)
                        }
                        aria-label={`Mark ${student.name} as present`}
                        className="h-5 w-5"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Empty state for table
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-48 text-center text-muted-foreground"
                  >
                    {isLoading
                      ? "Loading students..."
                      : "No students loaded. Please select a date and click 'Load Students'."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 4. Sticky Save Button Footer */}
      <div className="sticky bottom-0 z-20 mt-4 rounded-lg border bg-background/95 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] backdrop-blur-sm">
        <Button
          size="lg"
          className="w-full sm:w-auto"
          disabled={students.length === 0 || isSaving}
          onClick={handleSaveAttendance}
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isSaving ? "Saving..." : "Save Attendance"}
        </Button>
      </div>
    </div>
  );
};

export default MarkAttendance;