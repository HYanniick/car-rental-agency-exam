import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User, UserCredential } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/app/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  public signUpWithEmailAndPassword(user: IUser): Promise<boolean | unknown> {
    const database = getDatabase();

    return new Promise((resolve, reject) => {

      createUserWithEmailAndPassword(getAuth(), user.email, user.password)
        .then((userCreated: UserCredential) => {

          set(ref(database, 'users/' + userCreated.user.uid), {
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber
          }).then(() => {
            resolve(true);
          })
            .catch(() => reject(false));

        }).catch((error) =>
        reject(error));
    });
  }

  public signInWithEmailAndPassword(user: Partial<IUser>): Promise<UserCredential> {
    return signInWithEmailAndPassword(getAuth(), user.email as string, user.password as string);
  }

  public getCurrentUser(): Promise<User | unknown> {
    const auth = getAuth();
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        resolve(user);
      });
    });
  }

  public logout(): Promise<boolean | unknown> {
    return new Promise((resolve, reject) => {
      signOut(getAuth())
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}
