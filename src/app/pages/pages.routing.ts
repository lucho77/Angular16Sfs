import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeModule } from './home';
export const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },  
       ]
    }
];
export const routing = RouterModule.forChild(routes);
