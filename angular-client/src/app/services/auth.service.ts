import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'manager' | 'technician';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  
  public user$ = this.userSubject.asObservable();
  public isAuthenticated$ = this.user$.pipe(map(user => !!user));
  public isLoading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus().subscribe();
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http.get<User>('/api/user').pipe(
      tap(user => {
        this.userSubject.next(user);
        this.loadingSubject.next(false);
      }),
      map(user => !!user),
      catchError(() => {
        this.userSubject.next(null);
        this.loadingSubject.next(false);
        return of(false);
      })
    );
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<User>('/api/login', credentials).pipe(
      tap(user => {
        this.userSubject.next(user);
      })
    );
  }

  register(data: RegisterData): Observable<User> {
    return this.http.post<User>('/api/register', data).pipe(
      tap(user => {
        this.userSubject.next(user);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/logout', {}).pipe(
      tap(() => {
        this.userSubject.next(null);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}