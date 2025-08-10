import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="page-container">
      <h1>Inventory Management</h1>
      <mat-card>
        <mat-card-content>
          <p>Stock and inventory tracking functionality will be implemented here.</p>
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
export class InventoryComponent {}