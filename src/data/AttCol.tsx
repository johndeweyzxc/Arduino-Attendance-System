import { initializeApp } from "firebase/app";
import { Unsubscribe } from "firebase/auth";
import {
  FirestoreError,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { ColAttendance, ColStudents, firebaseConfig } from "../DBConfig";
import { AttendanceData, UniqueAttendanceData } from "../models/Models";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default class AttCol {
  static ListenAtt(
    studentId: string,
    studentName: string,
    month: string,
    cb: (attendances: Object[] | null) => void
  ): Unsubscribe {
    // TODO: Implementation
    const monthStart = new Date(`2024-${month}-01T00:00:00Z`);
    const monthEnd = new Date(`2024-${month}-30T23:59:59Z`);

    // * QUERY BASED ON MONTH
    const q = query(
      collection(db, ColStudents, studentId, ColAttendance),
      where("TimeIn", ">=", monthStart),
      where("TimeIn", "<=", monthEnd)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const attendance: Object[] = [];

        snapshot.forEach((doc) => {
          const s = doc.data() as AttendanceData;
          const attendanceObject: UniqueAttendanceData = {
            AttendanceId: doc.id,
            TimeIn: s.TimeIn,
          };

          attendance.push(attendanceObject);
        });

        console.log(
          `AttCol.ListenAtt: Fetched ${attendance.length} attendance record from ${studentName}`
        );
        cb(attendance);
      },
      (error: FirestoreError) => {
        console.log(error.message);
        console.log(
          "AttCol.ListenAtt: There is an error fetching student data"
        );
      }
    );
  }

  static async DelAtt(
    studentId: string,
    attId: string,
    cb: (success: boolean) => void
  ) {
    await deleteDoc(doc(db, ColStudents, studentId, ColAttendance, attId))
      .then(() => {
        console.log(
          `AttCol.DelAtt: Successfully deleted attendance with id ${attId} from student with id ${studentId}`
        );
        cb(true);
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            `AttCol.DelAtt: There is an error deleting attendance data where student id is ${studentId} and the attendance id is ${attId}`
          );
          cb(false);
        }
      });
  }
}
