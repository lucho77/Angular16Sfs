import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './home.component';
import { ReportdefComponent } from './reportdef/reportdef.component';

export const routes: Routes = [

    { path: '', component: HomeComponent, pathMatch: 'full'} ,
    { path: 'reportdef/:reporte', component: ReportdefComponent }
    ];

export const routing = RouterModule.forChild(routes);
