import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="customers-container">
      <h1>Customers</h1>
      <p>Customer management functionality will be implemented here.</p>
    </div>
  `,
  styles: [`
    .customers-container {
      padding: 24px;
    }
  `]
})
export class CustomersComponent {
}