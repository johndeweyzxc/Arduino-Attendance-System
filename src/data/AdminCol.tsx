import { initializeApp } from "firebase/app";
import { CurrentSections } from "../models/Models";
import { ColAdminData, DocSections, firebaseConfig } from "../DBConfig";
import {
  FirestoreError,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default class AdminCol {
  static GetSections(cb: (adminData: CurrentSections | null) => void) {
    const sectionsRef = doc(db, ColAdminData, DocSections);
    getDoc(sectionsRef).then(
      (value) => {
        cb(value.data() as CurrentSections);
        console.log("AdminCol.GetSections: Successfully fetched sections data");
      },
      (error: FirestoreError) => {
        console.log(error.message);
        console.log(
          "AdminCol.GetSections: There is an error fetching sections data"
        );
      }
    );
  }

  static ListenSection(
    cb: (section: CurrentSections | null) => void
  ): Unsubscribe {
    const docRef = doc(db, ColAdminData, DocSections);

    return onSnapshot(
      docRef,
      (snapshot) => {
        console.log(
          "AdminCol.ListenSection: Successfully fetched sections data"
        );
        cb(snapshot.data() as CurrentSections);
      },
      (error: FirestoreError) => {
        console.log(error.message);
        console.log(
          "AdminCol.ListenSection: There is an error fetching sections data"
        );
      }
    );
  }

  static AddSection(
    current: CurrentSections,
    strand: string,
    section: string,
    cb: (success: boolean, message: string) => void
  ) {
    const newAdminData: CurrentSections = {
      ABM: [...current.ABM],
      HUMSS: [...current.HUMSS],
      STEM: [...current.STEM],
      TVL: [...current.TVL],
    };

    switch (strand) {
      case "ABM":
        newAdminData.ABM = [...newAdminData.ABM, section];
        break;
      case "HUMSS":
        newAdminData.HUMSS = [...newAdminData.HUMSS, section];
        break;
      case "STEM":
        newAdminData.STEM = [...newAdminData.STEM, section];
        break;
      case "TVL":
        newAdminData.TVL = [...newAdminData.TVL, section];
        break;
      default:
        break;
    }

    setDoc(doc(db, ColAdminData, DocSections), newAdminData)
      .then(() => {
        console.log(
          `AdminCol.AddSection: Successfully added section ${section}`
        );
        cb(true, "Successfully added new section");
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(`AdminCol.AddSection: Failed to add section ${section}`);
          cb(false, "Error adding new section");
        }
      });
  }

  static DeleteSection(
    current: CurrentSections,
    strand: string,
    sectionToRemove: string,
    cb: (success: boolean, message: string) => void
  ) {
    const newAdminData: CurrentSections = {
      ABM: [...current.ABM],
      HUMSS: [...current.HUMSS],
      STEM: [...current.STEM],
      TVL: [...current.TVL],
    };

    switch (strand) {
      case "ABM":
        newAdminData.ABM = newAdminData.ABM.filter(
          (item) => item !== sectionToRemove
        );
        break;
      case "HUMSS":
        newAdminData.HUMSS = newAdminData.HUMSS.filter(
          (item) => item !== sectionToRemove
        );
        break;
      case "STEM":
        newAdminData.STEM = newAdminData.STEM.filter(
          (item) => item !== sectionToRemove
        );
        break;
      case "TVL":
        newAdminData.TVL = newAdminData.TVL.filter(
          (item) => item !== sectionToRemove
        );
        break;
      default:
        break;
    }

    setDoc(doc(db, ColAdminData, DocSections), newAdminData)
      .then(() => {
        console.log(
          `AdminCol.DeleteSection: Successfully deleted section ${sectionToRemove}`
        );
        cb(true, "Successfully removed section");
      })
      .catch((reason) => {
        if (reason !== null || reason !== undefined) {
          console.log(reason);
          console.log(
            `AdminCol.DeleteSection: Failed to delete section ${sectionToRemove}`
          );
          cb(false, "Error deleting section");
        }
      });
  }
}
