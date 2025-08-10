import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-content">
        <div class="auth-form">
          <mat-card>
            <mat-card-header>
              <mat-card-title>
                <h1>AquaFlow</h1>
                <p>Water Purifier Service Management</p>
              </mat-card-title>
            </mat-card-header>
            
            <mat-card-content>
              <mat-tab-group>
                <mat-tab label="Login">
                  <form [formGroup]="loginForm" (ngSubmit)="login()" class="auth-form-content">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Username</mat-label>
                      <input matInput formControlName="username" required>
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Password</mat-label>
                      <input matInput type="password" formControlName="password" required>
                    </mat-form-field>
                    
                    <button mat-raised-button color="primary" type="submit" 
                            [disabled]="loginForm.invalid || isLoading" 
                            class="full-width submit-button">
                      {{ isLoading ? 'Logging in...' : 'Login' }}
                    </button>
                  </form>
                </mat-tab>
                
                <mat-tab label="Register">
                  <form [formGroup]="registerForm" (ngSubmit)="register()" class="auth-form-content">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Username</mat-label>
                      <input matInput formControlName="username" required>
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Password</mat-label>
                      <input matInput type="password" formControlName="password" required>
                    </mat-form-field>
                    
                    <button mat-raised-button color="primary" type="submit" 
                            [disabled]="registerForm.invalid || isLoading" 
                            class="full-width submit-button">
                      {{ isLoading ? 'Creating account...' : 'Register' }}
                    </button>
                  </form>
                </mat-tab>
              </mat-tab-group>
            </mat-card-content>
          </mat-card>
        </div>
        
        <div class="hero-section">
          <h2>Streamline Your Water Purifier Business</h2>
          <div class="feature-list">
            <div class="feature">
              <h3>🏠 Customer Management</h3>
              <p>Keep track of all your customers and their service history</p>
            </div>
            <div class="feature">
              <h3>🔧 Service Scheduling</h3>
              <p>Manage daily services and maintenance appointments</p>
            </div>
            <div class="feature">
              <h3>💰 Payment Tracking</h3>
              <p>Monitor rent dues and payment collections</p>
            </div>
            <div class="feature">
              <h3>📦 Inventory Control</h3>
              <p>Track stock levels and manage supplies</p>
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
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      max-width: 1000px;
      width: 100%;
      align-items: center;
    }
    
    .auth-form mat-card {
      max-width: 400px;
      width: 100%;
    }
    
    .auth-form mat-card-title h1 {
      color: #1976d2;
      margin: 0 0 8px 0;
      font-size: 2rem;
    }
    
    .auth-form mat-card-title p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }
    
    .auth-form-content {
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .submit-button {
      margin-top: 16px;
      height: 48px;
    }
    
    .hero-section {
      color: white;
      text-align: left;
    }
    
    .hero-section h2 {
      font-size: 2.5rem;
      margin: 0 0 32px 0;
      font-weight: 300;
    }
    
    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .feature h3 {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
      font-weight: 500;
    }
    
    .feature p {
      margin: 0;
      opacity: 0.9;
      line-height: 1.5;
    }
    
    @media (max-width: 768px) {
      .auth-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .hero-section {
        text-align: center;
      }
      
      .hero-section h2 {
        font-size: 2rem;
      }
    }
  `]
})
export class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoading = false;

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
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Redirect if already authenticated
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', {
            duration: 3000
          });
          this.isLoading = false;
        }
      });
    }
  }

  register() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open('Registration failed. Username might already exist.', 'Close', {
            duration: 3000
          });
          this.isLoading = false;
        }
      });
    }
  }
}