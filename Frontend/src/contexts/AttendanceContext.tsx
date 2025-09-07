import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AttendanceRecord {
  [studentId: string]: 'present' | 'absent';
}

interface AttendanceData {
  [date: string]: AttendanceRecord;
}

interface AttendanceContextType {
  attendanceData: AttendanceData;
  saveAttendance: (date: string, record: AttendanceRecord) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData>(() => {
    try {
      const savedData = localStorage.getItem('attendanceData');
      return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.error('Error parsing attendance data from localStorage', error);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
  }, [attendanceData]);

  const saveAttendance = (date: string, record: AttendanceRecord) => {
    setAttendanceData(prevData => ({
      ...prevData,
      [date]: record
    }));
  };

  return (
    <AttendanceContext.Provider value={{ attendanceData, saveAttendance }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};