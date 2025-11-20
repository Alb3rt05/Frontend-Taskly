import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { HomePage } from './pages/home/home';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: '', component: HomePage, canActivate: [authGuard] }
];
