import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="page-container">
      <h1>Today's Services</h1>
      <mat-card>
        <mat-card-content>
          <p>Service scheduling and tracking functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }
    .page-container h1 {
      margin-bottom: 24px;
      color: #333;
    }
  `]
})
export class ServicesComponent {}