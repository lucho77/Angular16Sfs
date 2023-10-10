import { Component, OnInit, AfterViewInit } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportdefService } from '../../_services/reportdef.service';
import { ejecutarMetodoArea } from './loginUtil';


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
        console.log('me voy a loguear');
        this.onExternalLogin();
    }

    ngAfterViewInit() {
        document.getElementById('preloader').classList.add('hide');
    }

    // convenience getter for easy access to form fields

   async  onExternalLogin() {
      console.log('logueando nuevo....');

     // const userExternal:any  = await this.obtenerUsuarioLoginExterno();
      const user:any = await this.login();
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('paramGlobal', JSON.stringify(user.listGlobales));
      localStorage.setItem('userMenu', JSON.stringify(user.menueViejo));
      localStorage.setItem('reporte', user.reporteInicio);

      if (user['metodo'] !== null && user['metodo'] !== undefined) {
       await ejecutarMetodoArea(user, user.listGlobales, this.reportdefService);
      }
 
     
      this.router.navigate(['/pages']);
    }

   



    login() {
      return new Promise(resolve => {


        this.authenticationService.loginExternal(null).subscribe
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
