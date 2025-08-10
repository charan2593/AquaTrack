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
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

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
    MatProgressSpinnerModule,
    SidebarComponent,
    HeaderComponent
  ],
  template: `
    <div class="app-container">
      <ng-container *ngIf="!authService.isLoading$ | async; else loading">
        <ng-container *ngIf="authService.isAuthenticated$ | async; else auth">
          <app-sidebar></app-sidebar>
          <div class="main-content">
            <app-header></app-header>
            <main class="content-area">
              <router-outlet></router-outlet>
            </main>
          </div>
        </ng-container>
        
        <ng-template #auth>
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
      display: flex;
      overflow: hidden;
    }
    
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin-left: 280px;
    }
    
    .content-area {
      flex: 1;
      overflow: auto;
      background: linear-gradient(135deg, 
        hsl(var(--winter-light)) 0%, 
        rgba(255, 255, 255, 0.8) 100%);
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      gap: 20px;
    }
    
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check authentication status on app initialization
    this.authService.checkAuthStatus().subscribe({
      next: (isAuthenticated) => {
        if (!isAuthenticated && !this.router.url.includes('/auth')) {
          this.router.navigate(['/auth']);
        }
      }
    });
  }
}