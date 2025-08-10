import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public isAuthenticated$ = this.currentUser$.pipe(
    map(user => !!user),
    tap(() => this.isLoadingSubject.next(false))
  );

  constructor(private http: HttpClient) {}

  checkAuthStatus(): void {
    this.http.get<User>('/api/user').pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.isLoadingSubject.next(false);
      }),
      catchError(error => {
        this.currentUserSubject.next(null);
        this.isLoadingSubject.next(false);
        return throwError(() => error);
      })
    ).subscribe();
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<User>('/api/login', credentials).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  register(credentials: LoginCredentials): Observable<User> {
    return this.http.post<User>('/api/register', credentials).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/logout', {}).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }
}