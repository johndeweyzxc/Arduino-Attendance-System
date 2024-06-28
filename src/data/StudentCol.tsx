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
import { StudentData } from "../models/Models";
import { ColStudents, firebaseConfig } from "../DBConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default class StudentCol {
  static ListenStudent(
    level: number,
    strand: string,
    sec: string,
    cb: (students: Object[] | null) => void
  ): Unsubscribe {
    const q = query(
      collection(db, ColStudents),
      where("GradeLevel", "==", level),
      where("Strand", "==", strand),
      where("Section", "==", sec)
    );

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
          `StudentCol.ListenStudent: Fetched ${studentList.length} student data`
        );
        cb(studentList);
      },
      (error: FirestoreError) => {
        console.log(error.message);
        console.log(
          "StudentCol.ListenStudent: There is an error fetching student data"
        );
      }
    );
  }

  static ListenStudentAll(cb: (students: Object[] | null) => void) {
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
          `StudentCol.ListenStudentAll: Fetched ${studentList.length} student data`
        );
        cb(studentList);
      },
      (error: FirestoreError) => {
        console.log(error.message);
        console.log(
          "StudentCol.ListenStudentAll: There is an error fetching student data"
        );
      }
    );
  }

  static async UploadStudent(
    student: StudentData,
    cb: (success: boolean, message: string) => void
  ) {
    console.log(student);

    const findByRFID = query(
      collection(db, ColStudents),
      where("RFIDCode", "==", student.RFIDCode)
    );

    await getDocs(findByRFID)
      .then((snapshot) => {
        if (snapshot.size > 0) {
          // RFID code has already been taken
          console.log(
            `StudentCol.UploadStudent: RFID code ${student.RFIDCode} has already been taken`
          );
          cb(false, "RFID has already been taken");
          return;
        }

        // Upload student data
        addDoc(collection(db, ColStudents), student)
          .then((value) => {
            console.log(
              `StudentCol.UploadStudent: Successfully uploaded student with id ${value.id}`
            );
            cb(true, "Successfully uploaded student data");
          })
          .catch((reason) => {
            if (reason !== null || reason !== undefined) {
              console.log(reason);
              console.log(
                `StudentCol.UploadStudent: There is an error uploading student ${student.StudentName}`
              );
              cb(false, "Error uploading student data");
            }
          });
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            "StudentCol.UploadStudent: There is an error fetching student "
          );
          cb(false, "Error fetching student data");
        }
      });
  }

  static async UpdateStudent(
    id: string,
    student: StudentData,
    cb: (success: boolean) => void
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
          `StudentCol.UpdateStudent: Successfully updated student with id ${id}`
        );
        cb(true);
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            `StudentCol.UpdateStudent: There is an error updating student with id ${id}`
          );
          cb(false);
        }
      });
  }

  static async DelStudent(id: string, cb: (success: boolean) => void) {
    await deleteDoc(doc(db, ColStudents, id))
      .then(() => {
        console.log(
          `StudentCol.DelStudent: Successfully deleted student with id ${id}`
        );
        cb(true);
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            `StudentCol.DelStudent: There is an error deleting student with id ${id}`
          );
          cb(false);
        }
      });
  }
}
