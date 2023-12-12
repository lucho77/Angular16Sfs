import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './home.component';
import { ReportdefComponent } from './reportdef/reportdef.component';
import { MenuMobileComponent } from './menu-mobile/menu-mobile.component';

export const routes: Routes = [

    { path: '', component: HomeComponent, pathMatch: 'full'} ,
    { path: 'reportdef/:reporte', component: ReportdefComponent },
    { path: 'menu-mobile', component: MenuMobileComponent }
    ];

export const routing = RouterModule.forChild(routes);
