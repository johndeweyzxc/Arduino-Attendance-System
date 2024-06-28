import {
  Unsubscribe,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default class AppAuth {
  static ListenAuth(cb: (isLoggedIn: boolean) => void): Unsubscribe {
    return onAuthStateChanged(getAuth(), (user) => {
      user ? cb(true) : cb(false);
    });
  }

  static SignInAdmin(username: string, password: string) {
    signInWithEmailAndPassword(getAuth(), username, password)
      .then(() => {
        // Admin is signed in
        console.log("AppAuth.SignInAsAdmin: Admin signed in");
      })
      .catch((error) => {
        // Admin is not signed in
        if (error !== null || error !== undefined) {
          console.log(error);
          console.log("AppAuth.SignInAsAdmin: Error logging in as admin");
        }
      });
  }

  static SignOutAsAdmin() {
    signOut(getAuth())
      .then(() => {
        // Admin signed out successfully
        console.log("AppAuth.SignOutAsAdmin: Admin signed out");
      })
      .catch((error) => {
        // An error happened.
        if (error !== null || error !== undefined) {
          console.log(error);
          console.log(
            "AppAuth.SignOutAsAdmin: Error while signing out as admin"
          );
        }
      });
  }
}
