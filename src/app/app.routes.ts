import { Routes } from '@angular/router';
import { AuthGuard } from './guard/authguard';
import {NonAuthGuard} from "./guard/nonauthguard";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./car/car.page').then( m => m.CarPage),
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage),
    canActivate: [NonAuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage),
    canActivate: [NonAuthGuard]
  },
  {
    path: 'car',
    children: [
      {
        path: '',
        loadComponent: () => import('./car/car.page').then( m => m.CarPage)
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        loadComponent: () => import('./car/car-create/car-create.page').then( m => m.CarCreatePage)
      },
      {
        path: 'detail/:licensePlate',
        canActivate: [AuthGuard],
        loadComponent: () => import('./car/car-detail/car-detail.page').then(m => m.CarDetailPage)
      }
    ]
  }
];
