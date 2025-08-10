import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'customers',
    loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'today-services',
    loadComponent: () => import('./pages/today-services/today-services.component').then(m => m.TodayServicesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'rent-dues',
    loadComponent: () => import('./pages/rent-dues/rent-dues.component').then(m => m.RentDuesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'inventory',
    loadComponent: () => import('./pages/inventory/inventory.component').then(m => m.InventoryComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];