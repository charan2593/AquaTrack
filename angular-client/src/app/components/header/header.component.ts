import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar class="header" data-testid="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title" data-testid="text-page-title">
            Dashboard Overview
          </h1>
          <p class="welcome-text" *ngIf="authService.user$ | async as user">
            Welcome back, {{getUserName(user)}}
          </p>
        </div>
        
        <div class="header-right">
          <!-- Current Date -->
          <div class="date-info">
            <mat-icon class="date-icon">calendar_today</mat-icon>
            <span data-testid="text-current-date">{{getCurrentDate()}}</span>
          </div>
          
          <!-- Divider -->
          <div class="divider"></div>
          
          <!-- System Status -->
          <div class="system-status">
            <div class="status-indicator online"></div>
            <span class="status-text" data-testid="text-system-status">
              System Online
            </span>
          </div>

          <!-- User Role Badge -->
          <div class="divider" *ngIf="authService.user$ | async as user"></div>
          <div class="user-role" *ngIf="authService.user$ | async as user" data-testid="badge-user-role">
            {{user.role | titlecase}}
          </div>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header {
      background: white;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      height: 64px;
      min-height: 64px;
    }

    .header-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #1e40af;
    }

    .welcome-text {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .date-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }

    .date-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .divider {
      width: 1px;
      height: 24px;
      background: #e0e0e0;
    }

    .system-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .status-indicator.online {
      background: #4caf50;
    }

    .status-text {
      font-size: 14px;
      color: #4caf50;
      font-weight: 500;
    }

    .user-role {
      background: #f5f5f5;
      color: #666;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: capitalize;
      border: 1px solid #e0e0e0;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .header-content {
        padding: 0 16px;
      }

      .page-title {
        font-size: 20px;
      }

      .header-right {
        gap: 8px;
      }

      .date-info,
      .system-status {
        display: none;
      }

      .divider {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getUserName(user: any): string {
    return user?.firstName || user?.email || 'User';
  }
}