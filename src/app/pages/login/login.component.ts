import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card card">
        <div class="login-header">
          <h1>AquaFlow</h1>
          <p>Water Purifier Service Management</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              class="form-input"
              [(ngModel)]="credentials.username"
              required
              data-testid="input-username"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              class="form-input"
              [(ngModel)]="credentials.password"
              required
              data-testid="input-password"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary login-btn"
            [disabled]="loading"
            data-testid="button-login"
          >
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>

          <div *ngIf="error" class="error-message" data-testid="text-error">
            {{ error }}
          </div>
        </form>

        <div class="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: admin</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--winter-light) 0%, var(--winter-primary) 100%);
      padding: 1rem;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h1 {
      color: var(--winter-primary);
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .login-header p {
      color: var(--winter-text-secondary);
      font-size: 0.875rem;
    }

    .login-form {
      margin-bottom: 1.5rem;
    }

    .login-btn {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .error-message {
      background: rgba(239, 68, 68, 0.1);
      color: var(--winter-error);
      padding: 0.75rem;
      border-radius: 0.375rem;
      margin-top: 1rem;
      text-align: center;
      font-size: 0.875rem;
    }

    .demo-credentials {
      padding: 1rem;
      background: var(--winter-light);
      border-radius: 0.375rem;
      text-align: center;
      font-size: 0.875rem;
    }

    .demo-credentials p {
      margin: 0.25rem 0;
    }

    .demo-credentials strong {
      color: var(--winter-dark);
    }
  `]
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials.username, this.credentials.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.error = error.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}