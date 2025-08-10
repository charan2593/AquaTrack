import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatChipsModule
  ],
  template: `
    <mat-toolbar class="header" color="primary">
      <div class="header-content">
        <div class="page-info">
          <h1 class="page-title">Dashboard Overview</h1>
          <p class="welcome-text" *ngIf="user">
            Welcome back, {{ user.firstName || user.username }}
          </p>
        </div>

        <div class="header-actions">
          <!-- Current Date -->
          <div class="date-info">
            <mat-icon>today</mat-icon>
            <span>{{ getCurrentDate() }}</span>
          </div>

          <div class="divider"></div>

          <!-- System Status -->
          <div class="status-info">
            <div class="status-indicator online"></div>
            <span class="status-text">System Online</span>
          </div>

          <div class="divider" *ngIf="user?.role"></div>

          <!-- User Role Badge -->
          <mat-chip-set *ngIf="user?.role">
            <mat-chip class="role-chip">{{ user.role | titlecase }}</mat-chip>
          </mat-chip-set>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 24px;
    }

    .page-info h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: white;
    }

    .welcome-text {
      margin: 4px 0 0 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .date-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
    }

    .date-info mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .divider {
      width: 1px;
      height: 24px;
      background: rgba(255, 255, 255, 0.3);
    }

    .status-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .status-indicator.online {
      background: #4caf50;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .status-text {
      font-size: 14px;
      color: #4caf50;
      font-weight: 500;
    }

    .role-chip {
      background: rgba(255, 255, 255, 0.2) !important;
      color: white !important;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 0 16px;
      }

      .header-actions {
        gap: 12px;
      }

      .date-info,
      .status-info {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .page-info h1 {
        font-size: 20px;
      }
      
      .welcome-text {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  user: User | null = null;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}