import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purifier-purchases',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="purifier-purchases-container">
      <h1>Purifier Purchases</h1>
      <p>Purifier purchase management will be implemented here.</p>
    </div>
  `,
  styles: [`
    .purifier-purchases-container {
      padding: 24px;
    }
  `]
})
export class PurifierPurchasesComponent {
}