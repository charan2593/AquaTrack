import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todays-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="todays-services-container">
      <h1>Today's Services</h1>
      <p>Today's service schedule will be displayed here.</p>
    </div>
  `,
  styles: [`
    .todays-services-container {
      padding: 24px;
    }
  `]
})
export class TodaysServicesComponent {
}