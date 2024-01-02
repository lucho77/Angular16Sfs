import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; 
export function HttpLoaderFactory(httpClient: HttpClient) { 
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'; 

import { ToastrModule } from 'ngx-toastr';
import { PipesModule } from './theme/pipes/pipes.module';

import { AppRoutingModule } from './app.routing';
import { AppSettings } from './app.settings';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { LoginComponent } from './pages/login';
import { RegisterComponent } from './pages/register/register.component';
import { CodeRegisterComponent } from './pages/register/codeRegister';
import { ConfirmationDialogService } from './pages/confirmDialog/confirmDialog.service';
import { NgbDateCustomParserFormatter } from './util/datePicker/datePicker';
import { CommonModule } from '@angular/common';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ChatComponent } from './theme/chat/chat.component';

@NgModule({  
  imports: [
    BrowserModule,CommonModule,
    BrowserAnimationsModule,
    FormsModule,ReactiveFormsModule,
    NgbModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ToastrModule.forRoot({progressBar:true}), 
    PipesModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  declarations: [
    AppComponent,
    NotFoundComponent,LoginComponent,RegisterComponent,CodeRegisterComponent, ChatComponent
  ],
  exports: [
  ],
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  
    AppSettings,ConfirmationDialogService,
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter},

  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { } 