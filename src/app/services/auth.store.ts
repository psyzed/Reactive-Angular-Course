import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../model/user";
import { map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

const AUTH_DATA = "auth_data";

@Injectable({ providedIn: "root" })
export class AuthStore {
  private userSubject = new BehaviorSubject<User>(null);

  public user$: Observable<User> = this.userSubject.asObservable();
  public isLoggedIn$: Observable<boolean>;
  public isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));

    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));
    this.checkIfLoggedIn();
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>("/api/login", { email, password }).pipe(
      tap((user) => {
        this.userSubject.next(user);
        localStorage.setItem(AUTH_DATA, JSON.stringify(user));
      }),
      shareReplay()
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_DATA);
    return this.userSubject.next(null);
  }

  checkIfLoggedIn(): void {
    const userData = localStorage.getItem(AUTH_DATA);
    if (userData) {
      const user = JSON.parse(userData);
      this.userSubject.next(user);
    }
  }
}
