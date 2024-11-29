import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/app/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth = getAuth();
  private database = getDatabase();
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  public signUpWithEmailAndPassword(user: IUser): Promise<boolean | unknown> {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, user.email, user.password)
        .then((userCreated: UserCredential) => {
          set(ref(this.database, 'users/' + userCreated.user.uid), {
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
          })
            .then(() => resolve(true))
            .catch((error) => reject("Failed to save user data: " + error.message));
        })
        .catch((error) => reject("Signup failed: " + error.message));
    });
  }

  public signInWithEmailAndPassword(user: Partial<IUser>): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, user.email as string, user.password as string);
  }

  public getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        resolve(user);
      });
    });
  }

  public logout(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      signOut(this.auth)
        .then(() => resolve(true))
        .catch((error) => reject("Logout failed: " + error.message));
    });
  }

  public isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
