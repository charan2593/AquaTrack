import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-amc-purchases',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="amc-purchases-container">
      <h1>AMC Purchases</h1>
      <p>AMC purchase management will be implemented here.</p>
    </div>
  `,
  styles: [`
    .amc-purchases-container {
      padding: 24px;
    }
  `]
})
export class AmcPurchasesComponent {
}