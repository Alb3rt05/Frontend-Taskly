import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Profile } from './profile/profile';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home page',
    },
    {
        path: 'profile',
        component: Profile,
        title: 'Profile page',
    },
    {
        path: 'login',
        component: Login,
        title: 'Login page',
    },
];