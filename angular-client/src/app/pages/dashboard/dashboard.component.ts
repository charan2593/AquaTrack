import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Observable, forkJoin } from 'rxjs';

interface DashboardStats {
  totalCustomers: number;
  todaysServices: number;
  pendingRentDues: number;
  totalRevenue: number;
  inventoryItems: number;
}

interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container fade-in">
      <div class="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to your water purifier service management dashboard</p>
      </div>

      <div class="stats-grid" *ngIf="dashboardStats && customerStats">
        <mat-card class="stat-card blue">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ dashboardStats.totalCustomers }}</div>
                <div class="stat-label">Total Customers</div>
                <div class="stat-detail">{{ customerStats.active }} active</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card green">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>today</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ dashboardStats.todaysServices }}</div>
                <div class="stat-label">Today's Services</div>
                <div class="stat-detail">Scheduled for today</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card orange">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>payment</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ dashboardStats.pendingRentDues }}</div>
                <div class="stat-label">Pending Dues</div>
                <div class="stat-detail">Awaiting collection</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card purple">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>inventory_2</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ dashboardStats.inventoryItems }}</div>
                <div class="stat-label">Inventory Items</div>
                <div class="stat-detail">In stock</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="dashboard-content">
        <div class="content-grid">
          <mat-card class="activity-card">
            <mat-card-header>
              <mat-card-title>Recent Activity</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="activity-list">
                <div class="activity-item">
                  <mat-icon class="activity-icon">person_add</mat-icon>
                  <div class="activity-text">
                    <div class="activity-title">New customer registered</div>
                    <div class="activity-time">2 hours ago</div>
                  </div>
                </div>
                <div class="activity-item">
                  <mat-icon class="activity-icon">build</mat-icon>
                  <div class="activity-text">
                    <div class="activity-title">Service completed</div>
                    <div class="activity-time">4 hours ago</div>
                  </div>
                </div>
                <div class="activity-item">
                  <mat-icon class="activity-icon">payment</mat-icon>
                  <div class="activity-text">
                    <div class="activity-title">Payment received</div>
                    <div class="activity-time">1 day ago</div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="quick-actions-card">
            <mat-card-header>
              <mat-card-title>Quick Actions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="actions-grid">
                <button mat-raised-button color="primary" class="action-button">
                  <mat-icon>person_add</mat-icon>
                  Add Customer
                </button>
                <button mat-raised-button color="primary" class="action-button">
                  <mat-icon>event</mat-icon>
                  Schedule Service
                </button>
                <button mat-raised-button color="primary" class="action-button">
                  <mat-icon>receipt</mat-icon>
                  Record Payment
                </button>
                <button mat-raised-button color="primary" class="action-button">
                  <mat-icon>inventory</mat-icon>
                  Update Inventory
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 600;
      color: hsl(var(--winter-dark));
    }

    .page-header p {
      margin: 8px 0 0 0;
      font-size: 16px;
      color: hsl(var(--winter-dark) / 0.7);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;
    }

    .stat-card.blue { background: linear-gradient(135deg, #2196f3, #21cbf3); }
    .stat-card.green { background: linear-gradient(135deg, #4caf50, #8bc34a); }
    .stat-card.orange { background: linear-gradient(135deg, #ff9800, #ffc107); }
    .stat-card.purple { background: linear-gradient(135deg, #9c27b0, #e91e63); }

    .stat-card .mat-mdc-card-content {
      padding: 24px;
      color: white;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .stat-icon {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .stat-number {
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .stat-detail {
      font-size: 14px;
      opacity: 0.9;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .activity-card,
    .quick-actions-card {
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: hsl(var(--winter-light) / 0.3);
      border-radius: 12px;
    }

    .activity-icon {
      color: hsl(var(--winter-primary));
      background: hsl(var(--winter-primary) / 0.1);
      border-radius: 8px;
      padding: 8px;
    }

    .activity-title {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .activity-time {
      font-size: 12px;
      color: hsl(var(--winter-dark) / 0.6);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .action-button {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 24px 16px;
      height: auto;
      border-radius: 12px;
    }

    .action-button mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .content-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  dashboardStats?: DashboardStats;
  customerStats?: CustomerStats;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    const dashboardStats$ = this.http.get<DashboardStats>('/api/dashboard/stats');
    const customerStats$ = this.http.get<CustomerStats>('/api/customers/stats');

    forkJoin({
      dashboard: dashboardStats$,
      customers: customerStats$
    }).subscribe({
      next: (data) => {
        this.dashboardStats = data.dashboard;
        this.customerStats = data.customers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }
}