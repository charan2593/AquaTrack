import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'customers',
    loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'todays-services',
    loadComponent: () => import('./pages/todays-services/todays-services.component').then(m => m.TodaysServicesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'rent-dues',
    loadComponent: () => import('./pages/rent-dues/rent-dues.component').then(m => m.RentDuesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'purifier-purchases',
    loadComponent: () => import('./pages/purifier-purchases/purifier-purchases.component').then(m => m.PurifierPurchasesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'amc-purchases',
    loadComponent: () => import('./pages/amc-purchases/amc-purchases.component').then(m => m.AmcPurchasesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'inventory',
    loadComponent: () => import('./pages/inventory/inventory.component').then(m => m.InventoryComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];