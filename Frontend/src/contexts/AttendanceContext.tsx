import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AttendanceData } from '../types';
import { mockAttendanceData } from '../data/mockData';

interface AttendanceContextType {
  attendanceData: AttendanceData;
  saveAttendance: (date: string, attendance: { [studentId: string]: 'present' | 'absent' }) => void;
  getStudentAttendance: (studentId: string, fromDate: string, toDate: string) => Array<{date: string, status: 'present' | 'absent'}>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

interface AttendanceProviderProps {
  children: ReactNode;
}

export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({ children }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData>(mockAttendanceData);

  const saveAttendance = (date: string, attendance: { [studentId: string]: 'present' | 'absent' }) => {
    setAttendanceData(prev => ({
      ...prev,
      [date]: attendance
    }));
  };

  const getStudentAttendance = (studentId: string, fromDate: string, toDate: string) => {
    const records: Array<{date: string, status: 'present' | 'absent'}> = [];
    const from = new Date(fromDate);
    const to = new Date(toDate);

    Object.entries(attendanceData).forEach(([date, dayAttendance]) => {
      const currentDate = new Date(date);
      if (currentDate >= from && currentDate <= to && dayAttendance[studentId]) {
        records.push({
          date,
          status: dayAttendance[studentId]
        });
      }
    });

    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <AttendanceContext.Provider value={{ attendanceData, saveAttendance, getStudentAttendance }}>
      {children}
    </AttendanceContext.Provider>
  );
};