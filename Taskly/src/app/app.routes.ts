import { Routes } from '@angular/router';
import { Login } from './login/login';

export const routes: Routes = [
    /*{
    //aggiungi qui home
    },*/
    {
        path: '',
        component: Login,
        title: 'Login page',
    },
];