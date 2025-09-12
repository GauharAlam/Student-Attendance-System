import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Import the teacher service functions
import { getAttendance as getAttendanceService, saveAttendance as saveAttendanceService } from '../service/teacherService';

interface AttendanceRecord {
    [studentId: string]: 'present' | 'absent';
}

interface AttendanceData {
    [date: string]: AttendanceRecord;
}

interface AttendanceContextType {
    attendanceData: AttendanceData;
    fetchAttendance: () => void;
    // Add the saveAttendance function signature here
    saveAttendance: (date: string, records: AttendanceRecord) => Promise<void>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [attendanceData, setAttendanceData] = useState<AttendanceData>({});

    const fetchAttendance = async () => {
        try {
            const data = await getAttendanceService();
            const formattedData: AttendanceData = {};
            data.forEach((item: any) => {
                const record: AttendanceRecord = {};
                item.records.forEach((rec: any) => {
                    record[rec.studentId._id] = rec.status;
                });
                formattedData[item.date] = record;
            });
            setAttendanceData(formattedData);
        } catch (error) {
            console.error('Failed to fetch attendance data:', error);
        }
    };

    // ✅ FIX: Implement the saveAttendance function
    const saveAttendance = async (date: string, records: AttendanceRecord) => {
        try {
            // Convert the records object back to an array for the API
            const recordsArray = Object.entries(records).map(([studentId, status]) => ({
                studentId,
                status,
            }));

            // Call the service to save the data to the backend
            await saveAttendanceService(date, recordsArray);

            // Update the local context state on success
            setAttendanceData(prev => ({
                ...prev,
                [date]: records,
            }));
        } catch (error) {
            console.error("Failed to save attendance:", error);
            // Re-throw the error so the component can catch it and show a toast
            throw error;
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const value = {
        attendanceData,
        fetchAttendance,
        saveAttendance, // Expose the new function
    };

    return (
        <AttendanceContext.Provider value={value}>
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