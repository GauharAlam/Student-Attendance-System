import React, { useState, useEffect } from 'react';
import { getUnapprovedStudents, approveStudent } from '@/service/teacherService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Student {
  _id: string;
  name: string;
  email: string;
}

const TeacherDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const unapprovedStudents = await getUnapprovedStudents();
        setStudents(unapprovedStudents);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };
    fetchStudents();
  }, []);

  const handleApprove = async (studentId: string) => {
    try {
      await approveStudent(studentId);
      setStudents(students.filter(student => student._id !== studentId));
      toast({
        title: "Student Approved",
        description: "The student has been successfully verified.",
      });
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Could not approve the student. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Pending Student Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p>No students are currently pending approval.</p>
          ) : (
            <ul className="space-y-4">
              {students.map(student => (
                <li key={student._id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <Button onClick={() => handleApprove(student._id)}>Approve</Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;