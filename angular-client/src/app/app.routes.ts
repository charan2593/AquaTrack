import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.component').then(c => c.AuthComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'customers',
    loadComponent: () => import('./pages/customers/customers.component').then(c => c.CustomersComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'todays-services',
    loadComponent: () => import('./pages/todays-services/todays-services.component').then(c => c.TodaysServicesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'rent-dues',
    loadComponent: () => import('./pages/rent-dues/rent-dues.component').then(c => c.RentDuesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'purifier-purchases',
    loadComponent: () => import('./pages/purifier-purchases/purifier-purchases.component').then(c => c.PurifierPurchasesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'amc-purchases',
    loadComponent: () => import('./pages/amc-purchases/amc-purchases.component').then(c => c.AmcPurchasesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'inventory',
    loadComponent: () => import('./pages/inventory/inventory.component').then(c => c.InventoryComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];