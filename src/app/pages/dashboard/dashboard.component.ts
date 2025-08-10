import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

interface DashboardStats {
  totalCustomers: number;
  totalServices: number;
  pendingDues: {
    count: number;
    amount: number;
  };
  todayServices: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar></app-sidebar>
      
      <main class="main-content">
        <div class="dashboard-header">
          <h1 data-testid="text-dashboard-title">Dashboard</h1>
          <p data-testid="text-welcome">Welcome back, {{ currentUser?.firstName || currentUser?.username }}!</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card card" data-testid="card-customers">
            <div class="stat-icon customers">👥</div>
            <div class="stat-details">
              <h3 data-testid="text-total-customers">{{ stats?.totalCustomers || 0 }}</h3>
              <p>Total Customers</p>
            </div>
          </div>

          <div class="stat-card card" data-testid="card-services">
            <div class="stat-icon services">🔧</div>
            <div class="stat-details">
              <h3 data-testid="text-total-services">{{ stats?.totalServices || 0 }}</h3>
              <p>Total Services</p>
            </div>
          </div>

          <div class="stat-card card" data-testid="card-today-services">
            <div class="stat-icon today">📅</div>
            <div class="stat-details">
              <h3 data-testid="text-today-services">{{ stats?.todayServices || 0 }}</h3>
              <p>Today's Services</p>
            </div>
          </div>

          <div class="stat-card card" data-testid="card-pending-dues">
            <div class="stat-icon dues">💰</div>
            <div class="stat-details">
              <h3 data-testid="text-pending-dues">₹{{ stats?.pendingDues?.amount || 0 }}</h3>
              <p>Pending Dues ({{ stats?.pendingDues?.count || 0 }})</p>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <a routerLink="/customers" class="action-card card" data-testid="link-customers">
              <div class="action-icon">👥</div>
              <h3>Manage Customers</h3>
              <p>View and manage customer information</p>
            </a>

            <a routerLink="/today-services" class="action-card card" data-testid="link-today-services">
              <div class="action-icon">📋</div>
              <h3>Today's Services</h3>
              <p>View and update today's scheduled services</p>
            </a>

            <a routerLink="/rent-dues" class="action-card card" data-testid="link-rent-dues">
              <div class="action-icon">💳</div>
              <h3>Rent Dues</h3>
              <p>Track and collect pending rent dues</p>
            </a>

            <a routerLink="/inventory" class="action-card card" data-testid="link-inventory">
              <div class="action-icon">📦</div>
              <h3>Inventory</h3>
              <p>Manage products and stock levels</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      margin-left: 250px;
      transition: margin-left 0.3s ease;
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
        padding: 1rem;
      }
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      color: var(--winter-dark);
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .dashboard-header p {
      color: var(--winter-text-secondary);
      font-size: 1.1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
    }

    .stat-icon.customers { background: rgba(59, 130, 246, 0.1); }
    .stat-icon.services { background: rgba(16, 185, 129, 0.1); }
    .stat-icon.today { background: rgba(245, 158, 11, 0.1); }
    .stat-icon.dues { background: rgba(239, 68, 68, 0.1); }

    .stat-details h3 {
      font-size: 2rem;
      font-weight: bold;
      color: var(--winter-dark);
      margin: 0;
    }

    .stat-details p {
      color: var(--winter-text-secondary);
      margin: 0;
      font-size: 0.875rem;
    }

    .quick-actions h2 {
      color: var(--winter-dark);
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      display: block;
      text-decoration: none;
      color: inherit;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.2s;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .action-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .action-card h3 {
      color: var(--winter-dark);
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .action-card p {
      color: var(--winter-text-secondary);
      font-size: 0.875rem;
      margin: 0;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  currentUser = this.authService.getCurrentUser();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  private loadDashboardStats(): void {
    this.http.get<DashboardStats>('/api/dashboard/stats').subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }
}