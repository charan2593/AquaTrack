import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-purifier-purchases',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="page-container">
      <h1>Purifier Purchases</h1>
      <mat-card>
        <mat-card-content>
          <p>Purifier purchases management functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
    }
  `]
})
export class PurifierPurchasesComponent {}