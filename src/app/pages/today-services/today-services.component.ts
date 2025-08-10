import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-today-services',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="page-layout">
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <h1>Today's Services</h1>
        <p>Today's scheduled services coming soon...</p>
      </main>
    </div>
  `,
  styles: [`
    .page-layout {
      display: flex;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      padding: 2rem;
      margin-left: 250px;
    }
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
        padding: 1rem;
      }
    }
  `]
})
export class TodayServicesComponent implements OnInit {
  ngOnInit(): void {}
}