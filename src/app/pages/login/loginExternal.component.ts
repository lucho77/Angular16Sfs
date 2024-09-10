import { Component, OnInit, AfterViewInit } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportdefService } from '../../_services/reportdef.service';
import { ejecutarMetodoArea } from './loginUtil';
import { environment } from 'src/environments/environment';


@Component({templateUrl: 'loginExternal.component.html'})
export class LoginExternalComponent implements OnInit, AfterViewInit {

    constructor(
        private authenticationService: AuthenticationService, private route: ActivatedRoute,
        private router: Router, private reportdefService: ReportdefService

    ) {}

    ngOnInit() {
        // reset login status

/*
        this.route.paramMap.subscribe(params => {
          console.log(params);
          const eExt = params.get('ext');
          console.log('EL parametro 2A login es : ' + eExt);

          const lalocJSESSIONID = document.cookie;
          console.log('Las cookies en el login External son : ' + lalocJSESSIONID);
          console.log(lalocJSESSIONID);
        });

        console.log('estoy en el loginExternal External');  */
        this.authenticationService.logout();
        console.log('me voy a loguear LoginExternal');
        this.onExternalLogin();
    }

    ngAfterViewInit() {
        document.getElementById('preloader').classList.add('hide');
    }

    // convenience getter for easy access to form fields
    loginShared(usuario: string, semilla: string) {
      return new Promise(resolve => {
        this.authenticationService.loginShared(usuario, semilla,"SI").subscribe
        (shared => {
          resolve(shared);
        });
      });
    }
   async  onExternalLogin() {
      console.log('method onExternalLogin');

     // const userExternal:any  = await this.obtenerUsuarioLoginExterno();
     const cache = localStorage.getItem("cache");
     console.log('Cache:')
     console.log(cache)
     let shared:any;
     if(cache){
      const oCache = JSON.parse(cache);
       shared = await this.loginShared(oCache.user,oCache.semilla);            
     }
     const user:any = await this.login();
     if(shared){
        user.shared = shared;
     }
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('paramGlobal', JSON.stringify(user.listGlobales));
      localStorage.setItem('userMenu', JSON.stringify(user.menueViejo));
      localStorage.setItem('reporte', user.reporteInicio);
      console.log('Objeto shared:')
      console.log(user.sharedDTO)
 
      if (user.sharedDTO && user.sharedDTO.reporte) {
        localStorage.setItem('reporte', user.sharedDTO.reporte);
      }
  if (user.sharedDTO && user.sharedDTO.cache) {
    console.log('Guardando data Cache:')
    console.log(user.sharedDTO.cache)
    console.log(user.sharedDTO.semilla)
   let data ={user:user.username,semilla:user.sharedDTO.semilla};
    localStorage.setItem('cache', JSON.stringify(data));
  }

      if (user['metodo'] !== null && user['metodo'] !== undefined) {
       await ejecutarMetodoArea(user, user.listGlobales, this.reportdefService);
      }
 
     
      this.router.navigate(['/pages']);
    }

   



    login() {
      return new Promise(resolve => {


        this.authenticationService.loginExternal(environment.idSession).subscribe
        (user => {
                // login successful if there's a jwt token in the response
                     if (user.errorBusiness) {
                         // es un error
                         this.router.navigate(['/login']);
                         //reject();

                         return;
                     }
                     
                     if (user && user.token) {
                      this.authenticationService.logout();

                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    // limpio la cache local
                   /*
                    console.log('limpiando cache');
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('paramGlobal', JSON.stringify(user.listGlobales));
                    localStorage.setItem('userMenu', JSON.stringify(user.menueViejo));
                    localStorage.setItem('reporte', user.reporteInicio);
                        
                    if (user['metodo'] !== null && user['metodo'] !== undefined) {
                      ejecutarMetodoArea(user, user.listGlobales, this.reportdefService);
                    }
                  */
  
                     }
                     /*
                     localStorage.setItem('currentUser', JSON.stringify(user));
                     if (user.sharedDTO) {
                      localStorage.setItem('reporte', user.sharedDTO.reporte);
                     }
                     */
                     resolve(user);
        },
        (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log( 'Client-side error occured.' + err );
            } else {
              console.log( 'Server-side error occured.' + err);
            }
            //reject();

          }
        );


      });
    }

}
