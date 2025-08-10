import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DashboardStats {
  totalCustomers: string;
  todaysServices: string;
  pendingRentDues: string;
  recentPurchases: string;
}

interface CustomerStats {
  total: string;
  active: string;
  inactive: string;
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
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Service Dashboard</h1>
        <p>Overview of your water purifier service operations</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card customers" data-testid="card-total-customers">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>people</mat-icon>
              Total Customers
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number" data-testid="text-total-customers">
              {{dashboardStats?.totalCustomers || '0'}}
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card services" data-testid="card-todays-services">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>today</mat-icon>
              Today's Services
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number" data-testid="text-todays-services">
              {{dashboardStats?.todaysServices || '0'}}
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card rent-dues" data-testid="card-pending-rent-dues">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>payments</mat-icon>
              Pending Rent Dues
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number" data-testid="text-pending-rent-dues">
              {{dashboardStats?.pendingRentDues || '0'}}
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card purchases" data-testid="card-recent-purchases">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>shopping_cart</mat-icon>
              Recent Purchases
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number" data-testid="text-recent-purchases">
              {{dashboardStats?.recentPurchases || '0'}}
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Customer Status -->
      <div class="customer-status-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Customer Status Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="customer-stats">
              <div class="customer-stat-item">
                <div class="stat-label">Total</div>
                <div class="stat-value" data-testid="text-customer-total">
                  {{customerStats?.total || '0'}}
                </div>
              </div>
              <div class="customer-stat-item">
                <div class="stat-label">Active</div>
                <div class="stat-value active" data-testid="text-customer-active">
                  {{customerStats?.active || '0'}}
                </div>
              </div>
              <div class="customer-stat-item">
                <div class="stat-label">Inactive</div>
                <div class="stat-value inactive" data-testid="text-customer-inactive">
                  {{customerStats?.inactive || '0'}}
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-actions">
              <button mat-raised-button color="primary" data-testid="button-add-customer">
                <mat-icon>person_add</mat-icon>
                Add New Customer
              </button>
              <button mat-raised-button color="accent" data-testid="button-schedule-service">
                <mat-icon>schedule</mat-icon>
                Schedule Service
              </button>
              <button mat-raised-button data-testid="button-view-inventory">
                <mat-icon>inventory</mat-icon>
                View Inventory
              </button>
              <button mat-raised-button data-testid="button-generate-report">
                <mat-icon>assessment</mat-icon>
                Generate Report
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      color: #1e40af;
    }

    .dashboard-header p {
      margin: 8px 0 0 0;
      font-size: 16px;
      color: #666;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 500;
    }

    .stat-card.customers mat-card-title {
      color: #1e40af;
    }

    .stat-card.services mat-card-title {
      color: #059669;
    }

    .stat-card.rent-dues mat-card-title {
      color: #dc2626;
    }

    .stat-card.purchases mat-card-title {
      color: #7c2d12;
    }

    .stat-number {
      font-size: 36px;
      font-weight: 700;
      margin-top: 16px;
    }

    .stat-card.customers .stat-number {
      color: #1e40af;
    }

    .stat-card.services .stat-number {
      color: #059669;
    }

    .stat-card.rent-dues .stat-number {
      color: #dc2626;
    }

    .stat-card.purchases .stat-number {
      color: #7c2d12;
    }

    .customer-status-section,
    .quick-actions-section {
      margin-bottom: 32px;
    }

    .customer-stats {
      display: flex;
      justify-content: space-around;
      margin-top: 16px;
    }

    .customer-stat-item {
      text-align: center;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 600;
    }

    .stat-value.active {
      color: #059669;
    }

    .stat-value.inactive {
      color: #dc2626;
    }

    .quick-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 16px;
    }

    .quick-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .customer-stats {
        flex-direction: column;
        gap: 16px;
      }

      .quick-actions {
        flex-direction: column;
      }

      .quick-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  dashboardStats: DashboardStats | null = null;
  customerStats: CustomerStats | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadCustomerStats();
  }

  private loadDashboardStats(): void {
    this.http.get<DashboardStats>('/api/dashboard/stats').subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
      },
      error: (error) => {
        console.error('Failed to load dashboard stats:', error);
        // Set default values on error
        this.dashboardStats = {
          totalCustomers: '0',
          todaysServices: '0',
          pendingRentDues: '0',
          recentPurchases: '0'
        };
      }
    });
  }

  private loadCustomerStats(): void {
    this.http.get<CustomerStats>('/api/customers/stats').subscribe({
      next: (stats) => {
        this.customerStats = stats;
      },
      error: (error) => {
        console.error('Failed to load customer stats:', error);
        // Set default values on error
        this.customerStats = {
          total: '0',
          active: '0',
          inactive: '0'
        };
      }
    });
  }
}