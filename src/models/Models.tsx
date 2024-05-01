import { Timestamp } from "firebase/firestore";

export interface AttendanceData {
  TimeIn: Timestamp;
}

export interface StudentData {
  StudentName: string;
  Section: string;
  GradeLevel: number;
  Strand: string;
  RFIDCode: string;
  AccountCreatedAt: Date;
}

export interface UniqueAttendanceData extends AttendanceData {
  AttendanceId: string;
}

export interface UniqueStudentData extends StudentData {
  StudentId: string;
}

// Use as individual row attendance data
export interface UniqueStudentAttendanceData extends UniqueStudentData {
  id: string;
  AttendanceId: string;
  TimeIn: Timestamp;
  TimeInStr: string;
}

// Use as individual row student data
export interface UniqueRowStudentData extends StudentData {
  id: string;
}
