import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly API_URL = '/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is logged in on service init
    if (this.getToken()) {
      this.loadCurrentUser();
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(userData: {
    username: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private loadCurrentUser(): void {
    this.http.get<User>(`${this.API_URL}/me`).subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.logout()
    });
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}