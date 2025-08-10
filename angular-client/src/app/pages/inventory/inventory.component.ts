import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inventory-container">
      <h1>Inventory Dashboard</h1>
      <p>Inventory management functionality will be implemented here.</p>
    </div>
  `,
  styles: [`
    .inventory-container {
      padding: 24px;
    }
  `]
})
export class InventoryComponent {
}