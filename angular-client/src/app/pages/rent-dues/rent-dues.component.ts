import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rent-dues',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rent-dues-container">
      <h1>Rent Dues</h1>
      <p>Rent collection management will be implemented here.</p>
    </div>
  `,
  styles: [`
    .rent-dues-container {
      padding: 24px;
    }
  `]
})
export class RentDuesComponent {
}