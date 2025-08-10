import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-content">
        <!-- Left side - Hero section -->
        <div class="hero-section">
          <div class="hero-content">
            <div class="logo-section">
              <div class="logo-icon">
                <mat-icon>water_drop</mat-icon>
              </div>
              <h1>AquaFlow</h1>
            </div>
            
            <h2>Water Purifier Service Management</h2>
            <p class="hero-description">
              Complete solution for managing water purifier services, customer data, 
              inventory tracking, and business operations.
            </p>

            <div class="features-grid">
              <div class="feature-item">
                <div class="feature-icon blue">
                  <mat-icon>people</mat-icon>
                </div>
                <div class="feature-text">
                  <h3>Customer Management</h3>
                  <p>Track customer details, service history, and preferences</p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon green">
                  <mat-icon>build</mat-icon>
                </div>
                <div class="feature-text">
                  <h3>Service Scheduling</h3>
                  <p>Schedule and track maintenance visits and repairs</p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon purple">
                  <mat-icon>security</mat-icon>
                </div>
                <div class="feature-text">
                  <h3>Inventory Control</h3>
                  <p>Manage parts, filters, and equipment inventory</p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon orange">
                  <mat-icon>attach_money</mat-icon>
                </div>
                <div class="feature-text">
                  <h3>Financial Tracking</h3>
                  <p>Monitor rent dues, purchases, and revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side - Auth form -->
        <div class="form-section">
          <mat-card class="auth-card">
            <mat-card-header>
              <mat-card-title>Welcome</mat-card-title>
              <mat-card-subtitle>Sign in to your account or create a new one</mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <mat-tab-group [(selectedIndex)]="selectedTabIndex" class="auth-tabs">
                <mat-tab label="Login">
                  <div class="tab-content">
                    <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
                      <mat-form-field appearance="outline">
                        <mat-label>Username</mat-label>
                        <input matInput formControlName="username" required>
                        <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                          Username is required
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Password</mat-label>
                        <input matInput type="password" formControlName="password" required>
                        <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                          Password is required
                        </mat-error>
                      </mat-form-field>

                      <button 
                        mat-raised-button 
                        color="primary" 
                        type="submit" 
                        class="submit-button"
                        [disabled]="loginForm.invalid || loginLoading">
                        <mat-spinner diameter="20" *ngIf="loginLoading"></mat-spinner>
                        <span *ngIf="!loginLoading">Sign In</span>
                        <span *ngIf="loginLoading">Signing in...</span>
                      </button>
                    </form>
                  </div>
                </mat-tab>

                <mat-tab label="Register">
                  <div class="tab-content">
                    <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
                      <mat-form-field appearance="outline">
                        <mat-label>Username *</mat-label>
                        <input matInput formControlName="username" required>
                        <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                          Username is required
                        </mat-error>
                        <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
                          Username must be at least 3 characters
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Password *</mat-label>
                        <input matInput type="password" formControlName="password" required>
                        <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                          Password is required
                        </mat-error>
                        <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                          Password must be at least 6 characters
                        </mat-error>
                      </mat-form-field>

                      <div class="name-row">
                        <mat-form-field appearance="outline">
                          <mat-label>First Name</mat-label>
                          <input matInput formControlName="firstName">
                        </mat-form-field>

                        <mat-form-field appearance="outline">
                          <mat-label>Last Name</mat-label>
                          <input matInput formControlName="lastName">
                        </mat-form-field>
                      </div>

                      <mat-form-field appearance="outline">
                        <mat-label>Email</mat-label>
                        <input matInput type="email" formControlName="email">
                        <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                          Please enter a valid email
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Role</mat-label>
                        <mat-select formControlName="role">
                          <mat-option value="technician">Technician</mat-option>
                          <mat-option value="manager">Manager</mat-option>
                          <mat-option value="admin">Administrator</mat-option>
                        </mat-select>
                      </mat-form-field>

                      <button 
                        mat-raised-button 
                        color="primary" 
                        type="submit" 
                        class="submit-button"
                        [disabled]="registerForm.invalid || registerLoading">
                        <mat-spinner diameter="20" *ngIf="registerLoading"></mat-spinner>
                        <span *ngIf="!registerLoading">Create Account</span>
                        <span *ngIf="registerLoading">Creating account...</span>
                      </button>
                    </form>
                  </div>
                </mat-tab>
              </mat-tab-group>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      background: linear-gradient(135deg, 
        hsl(var(--winter-light)) 0%, 
        rgba(255, 255, 255, 0.8) 100%);
    }

    .auth-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
      gap: 40px;
      align-items: center;
      padding: 40px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }

    .logo-icon {
      background: hsl(var(--winter-primary));
      border-radius: 12px;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .hero-section h1 {
      margin: 0;
      font-size: 48px;
      font-weight: 700;
      color: hsl(var(--winter-dark));
    }

    .hero-section h2 {
      font-size: 32px;
      font-weight: 600;
      color: hsl(var(--winter-dark));
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    .hero-description {
      font-size: 18px;
      color: hsl(var(--winter-dark) / 0.7);
      margin-bottom: 48px;
      max-width: 500px;
      line-height: 1.6;
    }

    .features-grid {
      display: grid;
      gap: 32px;
      grid-template-columns: repeat(2, 1fr);
    }

    .feature-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .feature-icon {
      border-radius: 12px;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .feature-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: white;
    }

    .feature-icon.blue { background: #2196f3; }
    .feature-icon.green { background: #4caf50; }
    .feature-icon.purple { background: #9c27b0; }
    .feature-icon.orange { background: #ff9800; }

    .feature-text h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: hsl(var(--winter-dark));
    }

    .feature-text p {
      margin: 0;
      font-size: 14px;
      color: hsl(var(--winter-dark) / 0.7);
      line-height: 1.5;
    }

    .form-section {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .auth-card {
      width: 100%;
      max-width: 500px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .auth-tabs {
      margin-top: 24px;
    }

    .tab-content {
      padding: 24px 0;
    }

    .mat-mdc-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .name-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .submit-button {
      width: 100%;
      height: 48px;
      margin-top: 16px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
    }

    @media (max-width: 768px) {
      .auth-content {
        grid-template-columns: 1fr;
        padding: 20px;
        gap: 20px;
      }

      .hero-section {
        order: 2;
        padding: 20px;
      }

      .form-section {
        order: 1;
      }

      .hero-section h1 {
        font-size: 36px;
      }

      .hero-section h2 {
        font-size: 24px;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .name-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
    }
  `]
})
export class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  selectedTabIndex = 0;
  loginLoading = false;
  registerLoading = false;

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
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', Validators.email],
      firstName: [''],
      lastName: [''],
      role: ['technician']
    });

    // Redirect if already authenticated
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loginLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loginLoading = false;
          this.snackBar.open(error.error?.message || 'Login failed', 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        },
        complete: () => {
          this.loginLoading = false;
        }
      });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.registerLoading = true;
      const registerData = { ...this.registerForm.value };
      
      // Remove empty email if not provided
      if (!registerData.email) {
        delete registerData.email;
      }

      this.authService.register(registerData).subscribe({
        next: () => {
          this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.registerLoading = false;
          this.snackBar.open(error.error?.message || 'Registration failed', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        },
        complete: () => {
          this.registerLoading = false;
        }
      });
    }
  }
}