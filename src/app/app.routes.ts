import { Routes } from '@angular/router';

import { Home } from './features/home/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Favorites } from './features/favorites/favorites/favorites';
import { MyProperties } from './features/properties/my-properties/my-properties';
import { authGuard } from './core/guards/auth-guard';
import { PropertyDetails } from './features/properties/property-details/property-details';
import { CreateProperty } from './features/properties/create-property/create-property';
import { MyInquiries } from './features/inquiries/my-inquiries/my-inquiries';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'favorites',
    component: Favorites,
    canActivate: [authGuard]
  },
  {
    path: 'my-properties',
    component: MyProperties,
    canActivate: [authGuard]
  },
  {
    path: 'properties/create',
    component: CreateProperty,
    canActivate: [authGuard]
  },
  {
    path: 'properties/edit/:id',
    component: CreateProperty,
    canActivate: [authGuard]
  },
  {
    path: 'properties/:id',
    component: PropertyDetails
  },
  {
    path: 'my-inquiries',
    component: MyInquiries,
    canActivate: [authGuard]
  }
];