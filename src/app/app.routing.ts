import { NgModule } from '@angular/core';
import { Routes, RouterModule  } from '@angular/router'; 
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { LoginComponent } from './pages/login';
import { RegisterComponent } from './pages/register/register.component';
import { LoginExternalComponent } from './pages/login/loginExternal.component';
import { LoginSharedComponent } from './pages/login/loginShared.component';
import { GlobalParamsErrorComponent } from './pages/errors/globalParams/globalParamsError.component';
import { RedirectGuard } from './routing/redirectGuard';
import { MenuErrorComponent } from './pages/errors/menu/menu-error.component';
import { TokenComponent } from './pages/errors/token/token.component';
import { ExternalLoginErrorComponent } from './pages/errors/externalLogin/externalLoginError.component';
import { PagesModule } from './pages/pages.module';
import { AuthGuard } from './_guards';

export const routes: Routes = [

  { path: '', redirectTo: 'loginExternal', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'loginExternal', component: LoginExternalComponent },
  { path: 'loginShared/:usuario/:semilla', component: LoginSharedComponent },
  { path: 'globalParamsError', component: GlobalParamsErrorComponent },
  {
    path: 'sfs',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: 'https://www.sfssrl.com/'
    }
  },
  {
    path: 'externalUrlMaps',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
  },
  { path: 'menuError', component: MenuErrorComponent },
  { path: 'token', component: TokenComponent },
  { path: 'errorLoginExternal', component: ExternalLoginErrorComponent },
  { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canLoad: [AuthGuard] },  
  { path: '**', component: NotFoundComponent }

]; 

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }