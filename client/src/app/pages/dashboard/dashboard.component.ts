import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Water Purifier Service Management Overview</p>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title class="stat-title">
              <mat-icon class="stat-icon customers">people</mat-icon>
              Total Customers
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">1,247</div>
            <div class="stat-change positive">+12% from last month</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title class="stat-title">
              <mat-icon class="stat-icon services">build</mat-icon>
              Today's Services
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">23</div>
            <div class="stat-change">8 completed, 15 pending</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title class="stat-title">
              <mat-icon class="stat-icon dues">payment</mat-icon>
              Pending Dues
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">₹45,230</div>
            <div class="stat-change">23 customers</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title class="stat-title">
              <mat-icon class="stat-icon revenue">attach_money</mat-icon>
              Monthly Revenue
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">₹1,23,450</div>
            <div class="stat-change positive">+8% from last month</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions Grid -->
      <div class="actions-grid">
        <mat-card class="action-card">
          <mat-card-header>
            <mat-card-title class="action-title">
              <mat-icon class="action-icon customers">people</mat-icon>
              Customer Management
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage customer database, profiles, and service history</p>
            <button mat-raised-button color="primary" class="action-button">
              View Customers
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card">
          <mat-card-header>
            <mat-card-title class="action-title">
              <mat-icon class="action-icon services">build</mat-icon>
              Today's Services
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>View and manage today's scheduled maintenance and services</p>
            <button mat-raised-button color="primary" class="action-button">
              View Services
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card">
          <mat-card-header>
            <mat-card-title class="action-title">
              <mat-icon class="action-icon dues">payment</mat-icon>
              Rent Dues
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Track pending payments and manage collection activities</p>
            <button mat-raised-button color="primary" class="action-button">
              View Dues
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card">
          <mat-card-header>
            <mat-card-title class="action-title">
              <mat-icon class="action-icon purchases">shopping_cart</mat-icon>
              Purifier Purchases
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage new purifier sales and installation orders</p>
            <button mat-raised-button color="primary" class="action-button">
              View Purchases
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card">
          <mat-card-header>
            <mat-card-title class="action-title">
              <mat-icon class="action-icon inventory">inventory</mat-icon>
              Inventory Management
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Track stock levels for filters, motors, and other supplies</p>
            <button mat-raised-button color="primary" class="action-button">
              View Inventory
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card">
          <mat-card-header>
            <mat-card-title class="action-title">
              <mat-icon class="action-icon amc">settings</mat-icon>
              AMC Services
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Annual Maintenance Contract management and scheduling</p>
            <button mat-raised-button color="primary" class="action-button">
              View AMC
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      font-weight: 400;
      margin: 0 0 8px 0;
      color: #333;
    }

    .dashboard-header p {
      color: #666;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      cursor: pointer;
      transition: box-shadow 0.3s ease;
    }

    .stat-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
    }

    .stat-icon {
      font-size: 20px;
    }

    .stat-icon.customers { color: #1976d2; }
    .stat-icon.services { color: #ff9800; }
    .stat-icon.dues { color: #e91e63; }
    .stat-icon.revenue { color: #4caf50; }

    .stat-value {
      font-size: 2rem;
      font-weight: 500;
      margin: 16px 0 8px 0;
      color: #333;
    }

    .stat-change {
      font-size: 12px;
      color: #666;
    }

    .stat-change.positive {
      color: #4caf50;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .action-card {
      cursor: pointer;
      transition: box-shadow 0.3s ease;
    }

    .action-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .action-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 500;
    }

    .action-icon {
      font-size: 24px;
    }

    .action-icon.customers { color: #1976d2; }
    .action-icon.services { color: #ff9800; }
    .action-icon.dues { color: #e91e63; }
    .action-icon.purchases { color: #9c27b0; }
    .action-icon.inventory { color: #607d8b; }
    .action-icon.amc { color: #795548; }

    .action-card mat-card-content {
      padding-top: 16px;
    }

    .action-card p {
      color: #666;
      margin: 0 0 16px 0;
      line-height: 1.5;
    }

    .action-button {
      width: 100%;
    }
  `]
})
export class DashboardComponent {}