import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule
  ],
  template: `
    <nav class="sidebar winter-sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <mat-icon>water_drop</mat-icon>
          <h2>AquaFlow</h2>
        </div>
        <div class="user-info" *ngIf="user">
          <div class="user-avatar">
            {{ getUserInitials(user) }}
          </div>
          <div class="user-details">
            <p class="user-name">{{ user.firstName || user.username }}</p>
            <p class="user-role">{{ user.role | titlecase }}</p>
          </div>
        </div>
      </div>

      <div class="sidebar-content">
        <mat-nav-list>
          <!-- Dashboard -->
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>

          <!-- Service Management Section -->
          <div class="nav-section">
            <h3 class="section-title">Service Management</h3>
            
            <a mat-list-item routerLink="/customers" routerLinkActive="active">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>Customers List</span>
            </a>

            <a mat-list-item routerLink="/todays-services" routerLinkActive="active">
              <mat-icon matListItemIcon>today</mat-icon>
              <span matListItemTitle>Today's Services</span>
              <mat-icon matListItemMeta matBadge="3" matBadgeColor="warn" matBadgeSize="small">notifications</mat-icon>
            </a>

            <a mat-list-item routerLink="/rent-dues" routerLinkActive="active">
              <mat-icon matListItemIcon>payment</mat-icon>
              <span matListItemTitle>Rent Dues</span>
            </a>

            <a mat-list-item routerLink="/purifier-purchases" routerLinkActive="active">
              <mat-icon matListItemIcon>shopping_cart</mat-icon>
              <span matListItemTitle>Purifier Purchases</span>
            </a>

            <a mat-list-item routerLink="/amc-purchases" routerLinkActive="active">
              <mat-icon matListItemIcon>receipt_long</mat-icon>
              <span matListItemTitle>AMC Purchases</span>
            </a>
          </div>

          <!-- Inventory Section -->
          <div class="nav-section">
            <h3 class="section-title">Inventory</h3>
            
            <a mat-list-item routerLink="/inventory" routerLinkActive="active">
              <mat-icon matListItemIcon>inventory_2</mat-icon>
              <span matListItemTitle>Inventory Management</span>
            </a>
          </div>
        </mat-nav-list>
      </div>

      <div class="sidebar-footer">
        <button mat-raised-button color="warn" (click)="logout()" class="logout-button">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      z-index: 1000;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    }

    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .logo mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: hsl(var(--winter-accent));
    }

    .logo h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: white;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: hsl(var(--winter-primary));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 14px;
    }

    .user-details {
      flex: 1;
    }

    .user-name {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: white;
    }

    .user-role {
      margin: 0;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    }

    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px 0;
    }

    .nav-section {
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 8px 20px;
    }

    .mat-mdc-list-item {
      color: rgba(255, 255, 255, 0.8) !important;
      margin: 0 12px;
      border-radius: 8px;
      transition: all 0.2s ease;
      min-height: 48px !important;
    }

    .mat-mdc-list-item:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      color: white !important;
    }

    .mat-mdc-list-item.active {
      background: hsl(var(--winter-primary) / 0.2) !important;
      color: hsl(var(--winter-accent)) !important;
      border-left: 3px solid hsl(var(--winter-primary));
    }

    .mat-mdc-list-item .mat-icon {
      color: inherit;
    }

    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logout-button {
      width: 100%;
      background: rgba(244, 67, 54, 0.1) !important;
      color: #f44336 !important;
      border: 1px solid rgba(244, 67, 54, 0.3);
    }

    .logout-button:hover {
      background: rgba(244, 67, 54, 0.2) !important;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .sidebar.open {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  getUserInitials(user: User): string {
    if (user.firstName && user.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }
    if (user.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Force logout even if API fails
        this.router.navigate(['/auth']);
      }
    });
  }
}