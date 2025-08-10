import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="app-container">
      <ng-container *ngIf="!authService.isLoading$ | async; else loading">
        <ng-container *ngIf="authService.isAuthenticated$ | async; else loginView">
          <!-- Authenticated Layout -->
          <mat-sidenav-container class="sidenav-container">
            <mat-sidenav #drawer class="sidenav" fixedInViewport mode="side" opened>
              <div class="sidenav-header">
                <h2>AquaFlow</h2>
                <p>Service Management</p>
              </div>
              
              <mat-nav-list>
                <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
                  <mat-icon matListItemIcon>dashboard</mat-icon>
                  <span matListItemTitle>Dashboard</span>
                </a>
                <a mat-list-item routerLink="/customers" routerLinkActive="active">
                  <mat-icon matListItemIcon>people</mat-icon>
                  <span matListItemTitle>Customers</span>
                </a>
                <a mat-list-item routerLink="/services" routerLinkActive="active">
                  <mat-icon matListItemIcon>build</mat-icon>
                  <span matListItemTitle>Today's Services</span>
                </a>
                <a mat-list-item routerLink="/rent-dues" routerLinkActive="active">
                  <mat-icon matListItemIcon>payment</mat-icon>
                  <span matListItemTitle>Rent Dues</span>
                </a>
                <a mat-list-item routerLink="/purchases" routerLinkActive="active">
                  <mat-icon matListItemIcon>shopping_cart</mat-icon>
                  <span matListItemTitle>Purchases</span>
                </a>
                <a mat-list-item routerLink="/inventory" routerLinkActive="active">
                  <mat-icon matListItemIcon>inventory</mat-icon>
                  <span matListItemTitle>Inventory</span>
                </a>
              </mat-nav-list>
            </mat-sidenav>
            
            <mat-sidenav-content>
              <mat-toolbar color="primary" class="app-toolbar">
                <span class="spacer"></span>
                <span>Welcome, {{ (authService.currentUser$ | async)?.username }}</span>
                <button mat-button (click)="logout()">
                  <mat-icon>logout</mat-icon>
                  Logout
                </button>
              </mat-toolbar>
              
              <main class="main-content">
                <router-outlet></router-outlet>
              </main>
            </mat-sidenav-content>
          </mat-sidenav-container>
        </ng-container>
        
        <ng-template #loginView>
          <router-outlet></router-outlet>
        </ng-template>
      </ng-container>
      
      <ng-template #loading>
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Loading...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      background: #f5f5f5;
    }
    
    .sidenav-container {
      height: 100%;
    }
    
    .sidenav {
      width: 260px;
      background: linear-gradient(180deg, #1976d2 0%, #1565c0 100%);
      color: white;
    }
    
    .sidenav-header {
      padding: 24px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .sidenav-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }
    
    .sidenav-header p {
      margin: 4px 0 0 0;
      font-size: 14px;
      opacity: 0.8;
    }
    
    .sidenav mat-nav-list a {
      color: white !important;
      border-left: 3px solid transparent;
      transition: all 0.2s;
    }
    
    .sidenav mat-nav-list a:hover,
    .sidenav mat-nav-list a.active {
      background-color: rgba(255,255,255,0.1);
      border-left-color: #4caf50;
    }
    
    .app-toolbar {
      background: white !important;
      color: #333 !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .main-content {
      padding: 24px;
      min-height: calc(100vh - 64px);
      background: #f5f5f5;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      flex-direction: column;
      color: white;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .loading-container p {
      margin-top: 16px;
      color: white;
    }
  `]
})
export class AppComponent implements OnInit {
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.authService.checkAuthStatus();
  }
  
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }
}