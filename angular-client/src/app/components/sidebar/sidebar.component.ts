import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutModule } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil, combineLatest } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';

interface MenuItem {
  title: string;
  route: string;
  icon: string;
  testId: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    LayoutModule
  ],
  template: `
    <div class="sidebar-container">
      <!-- Mobile toggle button -->
      <button 
        *ngIf="isMobile"
        mat-icon-button
        (click)="toggleSidebar()"
        class="mobile-toggle"
        data-testid="button-mobile-toggle">
        <mat-icon>menu</mat-icon>
      </button>

      <!-- Mobile overlay -->
      <div 
        *ngIf="isMobile && isMobileOpen"
        class="mobile-overlay"
        (click)="closeMobileSidebar()">
      </div>

      <!-- Sidebar -->
      <aside 
        class="sidebar"
        [class.collapsed]="isCollapsed && !isMobile"
        [class.mobile-open]="isMobile && isMobileOpen"
        [class.mobile-closed]="isMobile && !isMobileOpen"
        data-testid="sidebar">
        
        <!-- Desktop toggle button -->
        <button 
          *ngIf="!isMobile"
          mat-icon-button
          (click)="toggleSidebar()"
          class="desktop-toggle"
          data-testid="button-toggle-sidebar">
          <mat-icon>{{isCollapsed ? 'chevron_right' : 'chevron_left'}}</mat-icon>
        </button>

        <!-- Logo Section -->
        <div class="logo-section" [class.collapsed]="isCollapsed && !isMobile">
          <mat-icon class="logo-icon">water_drop</mat-icon>
          <span class="logo-text" *ngIf="!isCollapsed || isMobile">AquaFlow</span>
        </div>
        
        <!-- Navigation Menu -->
        <nav class="nav-menu">
          <!-- Dashboard -->
          <div 
            class="nav-item"
            [class.active-route]="isActiveRoute('/')"
            (click)="navigate('/')"
            data-testid="nav-dashboard"
            [matTooltip]="isCollapsed && !isMobile ? 'Dashboard' : ''"
            matTooltipPosition="right">
            <mat-icon class="nav-icon">dashboard</mat-icon>
            <span class="nav-text" *ngIf="!isCollapsed || isMobile">Dashboard</span>
          </div>

          <!-- Service Management Section -->
          <div class="section-divider" *ngIf="!isCollapsed || isMobile">
            <span class="section-title">Service Management</span>
          </div>
          
          <div 
            *ngFor="let item of serviceMenuItems" 
            class="nav-item"
            [class.active-route]="isActiveRoute(item.route)"
            (click)="navigate(item.route)"
            [attr.data-testid]="item.testId"
            [matTooltip]="isCollapsed && !isMobile ? item.title : ''"
            matTooltipPosition="right">
            <mat-icon class="nav-icon">{{item.icon}}</mat-icon>
            <span class="nav-text" *ngIf="!isCollapsed || isMobile">{{item.title}}</span>
          </div>

          <!-- Inventory Section -->
          <div class="section-divider" *ngIf="!isCollapsed || isMobile">
            <span class="section-title">Inventory</span>
          </div>
          
          <div 
            class="nav-item"
            [class.active-route]="isActiveRoute('/inventory')"
            (click)="navigate('/inventory')"
            data-testid="nav-inventory"
            [matTooltip]="isCollapsed && !isMobile ? 'Inventory Dashboard' : ''"
            matTooltipPosition="right">
            <mat-icon class="nav-icon">inventory</mat-icon>
            <span class="nav-text" *ngIf="!isCollapsed || isMobile">Inventory Dashboard</span>
          </div>
        </nav>

        <!-- User Section -->
        <div class="user-section">
          <div class="user-info" *ngIf="authService.user$ | async as user">
            <!-- Expanded user info -->
            <div class="user-details" *ngIf="!isCollapsed || isMobile">
              <div class="user-avatar">
                {{getUserInitial(user)}}
              </div>
              <div class="user-text">
                <span class="user-name" data-testid="text-user-name">
                  {{getUserName(user)}}
                </span>
                <span class="user-role" data-testid="text-user-role">
                  {{user.role | titlecase}}
                </span>
              </div>
            </div>
            
            <!-- Collapsed user avatar -->
            <div class="user-avatar-only" *ngIf="isCollapsed && !isMobile">
              <div class="user-avatar">
                {{getUserInitial(user)}}
              </div>
            </div>
          </div>
          
          <button 
            mat-button 
            (click)="logout()"
            class="logout-button"
            [class.collapsed]="isCollapsed && !isMobile"
            data-testid="button-logout"
            [matTooltip]="isCollapsed && !isMobile ? 'Logout' : ''"
            matTooltipPosition="right">
            <mat-icon>logout</mat-icon>
            <span *ngIf="!isCollapsed || isMobile">Logout</span>
          </button>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .sidebar-container {
      position: relative;
    }

    .mobile-toggle {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 1001;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .mobile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      backdrop-filter: blur(4px);
    }

    .sidebar {
      width: 256px;
      height: 100vh;
      background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease-in-out;
      overflow: hidden;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    .sidebar.mobile-closed {
      transform: translateX(-100%);
    }

    .sidebar.mobile-open {
      transform: translateX(0);
    }

    .desktop-toggle {
      position: absolute;
      top: 16px;
      right: -12px;
      z-index: 1001;
      background: white;
      color: #1e40af;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      width: 24px;
      height: 24px;
      line-height: 24px;
    }

    .desktop-toggle mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      min-height: 64px;
    }

    .logo-section.collapsed {
      justify-content: center;
      padding: 20px 8px;
    }

    .logo-icon {
      color: #60a5fa;
      font-size: 32px;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      margin-left: 12px;
      color: white;
      white-space: nowrap;
    }

    .nav-menu {
      flex: 1;
      padding: 16px 0;
      overflow-y: auto;
    }

    .section-divider {
      margin: 16px 0 8px 0;
    }

    .section-title {
      color: rgba(255, 255, 255, 0.7);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 0 16px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      margin: 2px 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: rgba(255, 255, 255, 0.9);
      min-height: 48px;
    }

    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 12px;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-item.active-route {
      background: rgba(255, 255, 255, 0.15);
      color: #60a5fa;
      border-right: 3px solid #60a5fa;
    }

    .nav-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      font-size: 24px;
    }

    .nav-text {
      margin-left: 12px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
    }

    .user-section {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .user-info {
      margin-bottom: 12px;
    }

    .user-details {
      display: flex;
      align-items: center;
    }

    .user-avatar-only {
      display: flex;
      justify-content: center;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #60a5fa;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      color: white;
      flex-shrink: 0;
    }

    .user-text {
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .user-name {
      font-weight: 500;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    }

    .logout-button {
      width: 100%;
      color: rgba(255, 255, 255, 0.9) !important;
      border: 1px solid rgba(255, 255, 255, 0.3);
      justify-content: flex-start;
    }

    .logout-button.collapsed {
      justify-content: center;
      min-width: 40px;
      padding: 8px;
    }

    .logout-button:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .logout-button mat-icon {
      margin-right: 8px;
    }

    .logout-button.collapsed mat-icon {
      margin-right: 0;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .sidebar {
        width: 256px;
      }

      .desktop-toggle {
        display: none;
      }
    }

    /* Desktop styles */
    @media (min-width: 769px) {
      .mobile-toggle {
        display: none;
      }
    }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isCollapsed = false;
  isMobileOpen = false;
  isMobile = false;

  serviceMenuItems: MenuItem[] = [
    {
      title: 'Customers List',
      route: '/customers',
      icon: 'people',
      testId: 'nav-customers'
    },
    {
      title: "Today's Services",
      route: '/todays-services',
      icon: 'today',
      testId: 'nav-todays-services'
    },
    {
      title: 'Rent Dues',
      route: '/rent-dues',
      icon: 'payments',
      testId: 'nav-rent-dues'
    },
    {
      title: 'Purifier Purchases',
      route: '/purifier-purchases',
      icon: 'shopping_cart',
      testId: 'nav-purifier-purchases'
    },
    {
      title: 'AMC Purchases',
      route: '/amc-purchases',
      icon: 'description',
      testId: 'nav-amc-purchases'
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    // Subscribe to sidebar state changes
    combineLatest([
      this.sidebarService.isCollapsed$,
      this.sidebarService.isMobileOpen$,
      this.sidebarService.isMobile$
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([isCollapsed, isMobileOpen, isMobile]) => {
        this.isCollapsed = isCollapsed;
        this.isMobileOpen = isMobileOpen;
        this.isMobile = isMobile;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar(this.isMobile);
  }

  closeMobileSidebar(): void {
    this.sidebarService.closeMobileSidebar();
  }

  navigate(route: string): void {
    this.router.navigate([route]);
    if (this.isMobile) {
      this.closeMobileSidebar();
    }
  }

  isActiveRoute(route: string): boolean {
    if (route === '/') {
      return this.router.url === '/';
    }
    return this.router.url.startsWith(route);
  }

  getUserInitial(user: any): string {
    return user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U';
  }

  getUserName(user: any): string {
    return user?.firstName || user?.email || 'User';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }
}