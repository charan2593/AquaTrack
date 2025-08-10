import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'manager' | 'technician';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'manager' | 'technician';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  public user$ = this.userSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public isAuthenticated$ = this.user$.pipe(
    map(user => !!user)
  );

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    this.checkAuthStatus().subscribe();
  }

  checkAuthStatus(): Observable<boolean> {
    this.isLoadingSubject.next(true);
    
    return this.http.get<User>('/api/user').pipe(
      tap(user => {
        this.userSubject.next(user);
        this.isLoadingSubject.next(false);
      }),
      map(user => !!user),
      catchError((error: HttpErrorResponse) => {
        this.userSubject.next(null);
        this.isLoadingSubject.next(false);
        
        // Don't throw error for 401/403 responses as they indicate unauthenticated state
        if (error.status === 401 || error.status === 403) {
          return [false];
        }
        
        return throwError(() => error);
      })
    );
  }

  login(credentials: LoginRequest): Observable<User> {
    this.isLoadingSubject.next(true);
    
    return this.http.post<User>('/api/login', credentials).pipe(
      tap(user => {
        this.userSubject.next(user);
        this.isLoadingSubject.next(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.isLoadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  register(userData: RegisterRequest): Observable<User> {
    this.isLoadingSubject.next(true);
    
    return this.http.post<User>('/api/register', userData).pipe(
      tap(user => {
        this.userSubject.next(user);
        this.isLoadingSubject.next(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.isLoadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/logout', {}).pipe(
      tap(() => {
        this.userSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        // Even if logout fails on server, clear local state
        this.userSubject.next(null);
        return this.handleError(error);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => ({ error: { message: errorMessage }, ...error }));
  }
}