import { initializeApp } from "firebase/app";
import { ColAttendance, ColStudents, firebaseConfig } from "../DBConfig";
import {
  FirestoreError,
  Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  AttendanceData,
  StudentData,
  UniqueAttendanceData,
  UniqueStudentAttendanceData,
  UniqueStudentData,
} from "../models/Models";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default class StudentDB {
  static ProcessStudentAttendance(
    attendances: UniqueAttendanceData[],
    uniqueStudentData: UniqueStudentData,
    cb: (student: UniqueStudentAttendanceData) => void
  ): UniqueStudentAttendanceData[] {
    const attendanceRowData: UniqueStudentAttendanceData[] = [];

    attendances.forEach((attendance) => {
      const copyStudAttObj: UniqueStudentAttendanceData = {
        ...uniqueStudentData,
        id: attendance.AttendanceId + uniqueStudentData.StudentId,
        AttendanceId: attendance.AttendanceId,
        TimeIn: attendance.TimeIn,
        TimeInStr: "",
      };

      cb(copyStudAttObj);
    });

    return attendanceRowData;
  }

  static async GetStudentAttendance(
    cb: (student: UniqueStudentAttendanceData | null) => void
  ) {
    const q = query(collection(db, ColStudents));

    await getDocs(q)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const s = doc.data() as StudentData;

          const onReceivedAttendanceRecords = (
            attendances: UniqueAttendanceData[] | null
          ) => {
            if (attendances === null) {
              cb(null);
              return;
            }

            const studentAttendanceObject: UniqueStudentData = {
              StudentId: doc.id,
              StudentName: s.StudentName,
              Section: s.Section,
              GradeLevel: s.GradeLevel,
              Strand: s.Strand,
              RFIDCode: s.RFIDCode,
              AccountCreatedAt: s.AccountCreatedAt,
            };

            this.ProcessStudentAttendance(
              attendances,
              studentAttendanceObject,
              cb
            );
          };

          // Get the attendance record of each student
          this.GetAttendance(
            doc.id,
            s.StudentName,
            onReceivedAttendanceRecords
          );
        });
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            "StudentDB.GetStudentAttendance: There is an error fetching student data"
          );
          cb(null);
        }
      });
  }

  static async GetAttendance(
    studentId: string,
    studentName: string,
    cb: (attendances: UniqueAttendanceData[] | null) => void
  ) {
    const q = query(collection(db, ColStudents, studentId, ColAttendance));

    await getDocs(q)
      .then((snapshot) => {
        const attendance: UniqueAttendanceData[] = [];

        snapshot.forEach((doc) => {
          const s = doc.data() as AttendanceData;
          const attendanceObject: UniqueAttendanceData = {
            AttendanceId: doc.id,
            TimeIn: s.TimeIn,
          };

          attendance.push(attendanceObject);
        });

        console.log(
          `StudentDB.GetAttendance: Fetched ${attendance.length} attendance record from ${studentName}`
        );
        cb(attendance);
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            `StudentDB.GetAttendance: There is an error fetching student attendance data where student id is ${studentId}`
          );
          cb(null);
        }
      });
  }

  static async DeleteAttendance(
    studentId: string,
    attendanceId: string,
    cb: (isSuccess: boolean) => void
  ) {
    await deleteDoc(
      doc(db, ColStudents, studentId, ColAttendance, attendanceId)
    )
      .then(() => {
        console.log(
          `StudentDB.DeleteAttendance: Successfully deleted attendance with id ${attendanceId} from student with id ${studentId}`
        );
        cb(true);
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            `StudentDB.DeleteAttendance: There is an error deleting attendance data where student id is ${studentId} and the attendance id is ${attendanceId}`
          );
          cb(false);
        }
      });
  }

  static async GetStudent(cb: (students: Object[] | null) => void) {
    const q = query(collection(db, ColStudents));

    await getDocs(q)
      .then((snapshot) => {
        const studentList: Object[] = [];

        snapshot.forEach((doc) => {
          const s = doc.data() as StudentData;

          const studentObject = {
            id: doc.id,
            StudentName: s.StudentName,
            Section: s.Section,
            GradeLevel: s.GradeLevel,
            Strand: s.Strand,
            RFIDCode: s.RFIDCode,
          };
          studentList.push(studentObject);
        });

        console.log(
          `StudentDB.GetStudent: Fetched ${studentList.length} student data`
        );
        cb(studentList);
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            "StudentDB.GetStudent: There is an error fetching student data"
          );
          cb(null);
        }
      });
  }

  static ListenStudent(cb: (students: Object[] | null) => void): Unsubscribe {
    const q = query(collection(db, ColStudents));

    return onSnapshot(
      q,
      (snapshot) => {
        const studentList: Object[] = [];

        snapshot.forEach((doc) => {
          const s = doc.data() as StudentData;
          const studentObject = {
            id: doc.id,
            StudentName: s.StudentName,
            Section: s.Section,
            GradeLevel: s.GradeLevel,
            Strand: s.Strand,
            RFIDCode: s.RFIDCode,
          };
          studentList.push(studentObject);
        });

        console.log(
          `StudentDB.ListenStudent: Fetched ${studentList.length} student data`
        );
        cb(studentList);
      },
      (error: FirestoreError) => {
        console.log(error.message);
        console.log(
          "StudentDB.ListenStudent: There is an error fetching student data"
        );
      }
    );
  }

  static async UploadStudent(
    student: StudentData,
    cb: (isSuccess: boolean, message: string) => void
  ) {
    const findByRFID = query(
      collection(db, ColStudents),
      where("RFIDCode", "==", student.RFIDCode)
    );
    await getDocs(findByRFID)
      .then((snapshot) => {
        if (snapshot.size > 0) {
          // RFID code has already been taken
          console.log(
            `StudentDB.UploadStudent: RFID code ${student.RFIDCode} has already been taken`
          );
          cb(false, "RFID has already been taken");
          return;
        }

        // Upload student data
        addDoc(collection(db, ColStudents), student)
          .then((value) => {
            console.log(
              `StudentDB.UploadStudent: Successfully uploaded student with id ${value.id}`
            );
            cb(true, "Successfully uploaded student data");
          })
          .catch((reason) => {
            if (reason !== null || reason !== undefined) {
              console.log(reason);
              console.log(
                `StudentDB.UploadStudent: There is an error uploading student ${student.StudentName}`
              );
              cb(false, "Error uploading student data");
            }
          });
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            "StudentDB.UploadStudent: There is an error fetching student "
          );
          cb(false, "Error fetching student data");
        }
      });
  }

  static async UpdateStudent(
    student: StudentData,
    id: string,
    cb: (isSuccess: boolean) => void
  ) {
    const studentRef = doc(db, ColStudents, id);

    await updateDoc(studentRef, {
      StudentName: student.StudentName,
      Section: student.Section,
      GradeLevel: student.GradeLevel,
      Strand: student.Strand,
      RFIDCode: student.RFIDCode,
    })
      .then(() => {
        console.log(
          `StudentDB.UpdateStudent: Successfully updated student with id ${id}`
        );
        cb(true);
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            `StudentDB.UpdateStudent: There is an error updating student with id ${id}`
          );
          cb(false);
        }
      });
  }

  static async DeleteStudent(id: string, cb: (isSuccess: boolean) => void) {
    await deleteDoc(doc(db, ColStudents, id))
      .then(() => {
        console.log(
          `StudentDB.DeleteStudent: Successfully deleted student with id ${id}`
        );
        cb(true);
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            `StudentDB.DeleteStudent: There is an error deleting student with id ${id}`
          );
          cb(false);
        }
      });
  }
}
