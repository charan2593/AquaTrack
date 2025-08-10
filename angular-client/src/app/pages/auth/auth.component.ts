import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-content">
        <!-- Left side - Forms -->
        <div class="auth-forms">
          <div class="brand-header">
            <mat-icon class="brand-icon">water_drop</mat-icon>
            <h1>AquaFlow</h1>
            <p>Water Purifier Service Management</p>
          </div>

          <mat-card>
            <mat-tab-group animationDuration="0ms" dynamicHeight>
              <!-- Login Tab -->
              <mat-tab label="Login" data-testid="tab-login">
                <div class="tab-content">
                  <form [formGroup]="loginForm" (ngSubmit)="onLogin()" data-testid="form-login">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Username</mat-label>
                      <input matInput 
                             formControlName="username" 
                             data-testid="input-username"
                             autocomplete="username">
                      <mat-icon matSuffix>person</mat-icon>
                      <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                        Username is required
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Password</mat-label>
                      <input matInput 
                             [type]="hidePassword ? 'password' : 'text'"
                             formControlName="password"
                             data-testid="input-password"
                             autocomplete="current-password">
                      <button type="button" 
                              mat-icon-button 
                              matSuffix 
                              (click)="hidePassword = !hidePassword"
                              data-testid="button-toggle-password">
                        <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                      </button>
                      <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                        Password is required
                      </mat-error>
                    </mat-form-field>

                    <button type="submit" 
                            mat-raised-button 
                            color="primary" 
                            class="full-width auth-button"
                            [disabled]="loginForm.invalid || isLoggingIn"
                            data-testid="button-login">
                      <mat-icon *ngIf="isLoggingIn">hourglass_empty</mat-icon>
                      <span>{{isLoggingIn ? 'Signing In...' : 'Sign In'}}</span>
                    </button>
                  </form>
                </div>
              </mat-tab>

              <!-- Register Tab -->
              <mat-tab label="Register" data-testid="tab-register">
                <div class="tab-content">
                  <form [formGroup]="registerForm" (ngSubmit)="onRegister()" data-testid="form-register">
                    <div class="form-row">
                      <mat-form-field appearance="outline" class="half-width">
                        <mat-label>First Name</mat-label>
                        <input matInput 
                               formControlName="firstName" 
                               data-testid="input-first-name"
                               autocomplete="given-name">
                        <mat-icon matSuffix>person</mat-icon>
                      </mat-form-field>

                      <mat-form-field appearance="outline" class="half-width">
                        <mat-label>Last Name</mat-label>
                        <input matInput 
                               formControlName="lastName" 
                               data-testid="input-last-name"
                               autocomplete="family-name">
                        <mat-icon matSuffix>person</mat-icon>
                      </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Username</mat-label>
                      <input matInput 
                             formControlName="username" 
                             data-testid="input-register-username"
                             autocomplete="username">
                      <mat-icon matSuffix>account_circle</mat-icon>
                      <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                        Username is required
                      </mat-error>
                      <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
                        Username must be at least 3 characters
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Email</mat-label>
                      <input matInput 
                             type="email"
                             formControlName="email" 
                             data-testid="input-email"
                             autocomplete="email">
                      <mat-icon matSuffix>email</mat-icon>
                      <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                        Please enter a valid email
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Role</mat-label>
                      <mat-select formControlName="role" data-testid="select-role">
                        <mat-option value="technician">Technician</mat-option>
                        <mat-option value="manager">Manager</mat-option>
                        <mat-option value="admin">Administrator</mat-option>
                      </mat-select>
                      <mat-icon matSuffix>work</mat-icon>
                      <mat-error *ngIf="registerForm.get('role')?.hasError('required')">
                        Please select a role
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Password</mat-label>
                      <input matInput 
                             [type]="hideRegisterPassword ? 'password' : 'text'"
                             formControlName="password"
                             data-testid="input-register-password"
                             autocomplete="new-password">
                      <button type="button" 
                              mat-icon-button 
                              matSuffix 
                              (click)="hideRegisterPassword = !hideRegisterPassword"
                              data-testid="button-toggle-register-password">
                        <mat-icon>{{hideRegisterPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                      </button>
                      <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                        Password is required
                      </mat-error>
                      <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                        Password must be at least 6 characters
                      </mat-error>
                    </mat-form-field>

                    <button type="submit" 
                            mat-raised-button 
                            color="primary" 
                            class="full-width auth-button"
                            [disabled]="registerForm.invalid || isRegistering"
                            data-testid="button-register">
                      <mat-icon *ngIf="isRegistering">hourglass_empty</mat-icon>
                      <span>{{isRegistering ? 'Creating Account...' : 'Create Account'}}</span>
                    </button>
                  </form>
                </div>
              </mat-tab>
            </mat-tab-group>
          </mat-card>
        </div>

        <!-- Right side - Hero Section -->
        <div class="auth-hero">
          <div class="hero-content">
            <mat-icon class="hero-icon">water_drop</mat-icon>
            <h2>Streamline Your Water Purifier Services</h2>
            <p>
              Manage customers, schedule services, track inventory, and handle rent collections 
              all in one comprehensive platform designed for water purifier service businesses.
            </p>
            <div class="features-list">
              <div class="feature-item">
                <mat-icon>check_circle</mat-icon>
                <span>Customer Management</span>
              </div>
              <div class="feature-item">
                <mat-icon>check_circle</mat-icon>
                <span>Service Scheduling</span>
              </div>
              <div class="feature-item">
                <mat-icon>check_circle</mat-icon>
                <span>Inventory Tracking</span>
              </div>
              <div class="feature-item">
                <mat-icon>check_circle</mat-icon>
                <span>Rent Collection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .auth-content {
      display: flex;
      max-width: 1200px;
      width: 100%;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .auth-forms {
      flex: 1;
      padding: 40px;
      max-width: 500px;
    }

    .brand-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .brand-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #1e40af;
      margin-bottom: 16px;
    }

    .brand-header h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 700;
      color: #1e40af;
    }

    .brand-header p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .tab-content {
      padding: 24px 0;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .half-width {
      flex: 1;
      margin-bottom: 16px;
    }

    .auth-button {
      margin-top: 8px;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
    }

    .auth-hero {
      flex: 1;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      padding: 60px 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-content {
      text-align: center;
      max-width: 400px;
    }

    .hero-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      margin-bottom: 24px;
      opacity: 0.9;
    }

    .hero-content h2 {
      margin: 0 0 24px 0;
      font-size: 28px;
      font-weight: 600;
      line-height: 1.3;
    }

    .hero-content p {
      margin: 0 0 32px 0;
      font-size: 16px;
      line-height: 1.6;
      opacity: 0.9;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .feature-item mat-icon {
      color: #60a5fa;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .feature-item span {
      font-size: 16px;
      font-weight: 500;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .auth-content {
        flex-direction: column;
        margin: 0;
        border-radius: 0;
        min-height: 100vh;
      }

      .auth-forms {
        padding: 24px;
      }

      .auth-hero {
        padding: 40px 24px;
      }

      .form-row {
        flex-direction: column;
      }

      .half-width {
        width: 100%;
      }

      .hero-content h2 {
        font-size: 24px;
      }

      .hero-icon {
        font-size: 60px;
        width: 60px;
        height: 60px;
      }
    }
  `]
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  hidePassword = true;
  hideRegisterPassword = true;
  isLoggingIn = false;
  isRegistering = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.email],
      role: ['technician', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.valid && !this.isLoggingIn) {
      this.isLoggingIn = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
        },
        error: (error) => {
          this.isLoggingIn = false;
          this.snackBar.open(
            error.error?.message || 'Login failed. Please check your credentials.',
            'Close',
            {
              duration: 5000,
              panelClass: 'error-snackbar'
            }
          );
        }
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid && !this.isRegistering) {
      this.isRegistering = true;
      
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.snackBar.open('Account created successfully!', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
        },
        error: (error) => {
          this.isRegistering = false;
          this.snackBar.open(
            error.error?.message || 'Registration failed. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: 'error-snackbar'
            }
          );
        }
      });
    }
  }
}