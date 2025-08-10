import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <h2 data-testid="text-app-title">AquaFlow</h2>
        <p data-testid="text-app-subtitle">Service Management</p>
      </div>

      <div class="nav-menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" data-testid="link-dashboard">
          <span class="nav-icon">📊</span>
          <span class="nav-text">Dashboard</span>
        </a>

        <a routerLink="/customers" routerLinkActive="active" class="nav-item" data-testid="link-customers">
          <span class="nav-icon">👥</span>
          <span class="nav-text">Customers</span>
        </a>

        <a routerLink="/today-services" routerLinkActive="active" class="nav-item" data-testid="link-today-services">
          <span class="nav-icon">📋</span>
          <span class="nav-text">Today's Services</span>
        </a>

        <a routerLink="/services" routerLinkActive="active" class="nav-item" data-testid="link-services">
          <span class="nav-icon">🔧</span>
          <span class="nav-text">All Services</span>
        </a>

        <a routerLink="/rent-dues" routerLinkActive="active" class="nav-item" data-testid="link-rent-dues">
          <span class="nav-icon">💳</span>
          <span class="nav-text">Rent Dues</span>
        </a>

        <a routerLink="/inventory" routerLinkActive="active" class="nav-item" data-testid="link-inventory">
          <span class="nav-icon">📦</span>
          <span class="nav-text">Inventory</span>
        </a>
      </div>

      <div class="sidebar-footer">
        <div class="user-info" data-testid="text-user-info">
          <p><strong>{{ currentUser?.firstName || currentUser?.username }}</strong></p>
          <p class="user-role">{{ currentUser?.role }}</p>
        </div>
        
        <button class="btn btn-secondary logout-btn" (click)="logout()" data-testid="button-logout">
          <span class="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 250px;
      height: 100vh;
      background: var(--winter-surface);
      border-right: 1px solid var(--winter-border);
      display: flex;
      flex-direction: column;
      z-index: 1000;
      transition: transform 0.3s ease;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--winter-border);
      background: var(--winter-light);
    }

    .sidebar-header h2 {
      color: var(--winter-primary);
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 0 0.25rem 0;
    }

    .sidebar-header p {
      color: var(--winter-text-secondary);
      font-size: 0.875rem;
      margin: 0;
    }

    .nav-menu {
      flex: 1;
      padding: 1rem 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      color: var(--winter-text);
      text-decoration: none;
      transition: all 0.2s;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background: var(--winter-light);
      color: var(--winter-dark);
    }

    .nav-item.active {
      background: var(--winter-light);
      color: var(--winter-primary);
      border-left-color: var(--winter-primary);
      font-weight: 600;
    }

    .nav-icon {
      font-size: 1.25rem;
      margin-right: 0.75rem;
      width: 24px;
      text-align: center;
    }

    .nav-text {
      font-size: 0.875rem;
    }

    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid var(--winter-border);
      background: var(--winter-background);
    }

    .user-info {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: var(--winter-surface);
      border-radius: 0.375rem;
      border: 1px solid var(--winter-border);
    }

    .user-info p {
      margin: 0;
      font-size: 0.875rem;
    }

    .user-role {
      color: var(--winter-text-secondary);
      text-transform: capitalize;
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
    }

    .logout-btn .nav-icon {
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  `]
})
export class SidebarComponent {
  currentUser = this.authService.getCurrentUser();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
  }
}