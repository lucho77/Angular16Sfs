import { Component, OnInit, AfterViewInit } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportdefService } from '../../_services/reportdef.service';
import { ejecutarMetodoArea , setearLatitudyLongitudGlobal, getCookie, extraerParamsShared} from './loginUtil';
import { environment } from 'src/environments/environment';
import { NameGlobalService } from 'src/app/_services/nameGlobalService';
import { GeolocationService } from 'src/app/_services/Geolocation.service';


@Component({templateUrl: 'loginExternal.component.html'})
export class LoginExternalComponent implements OnInit, AfterViewInit {

  private paramsCoockie: string;
  private metodoCoockie: string;
    constructor(
        private authenticationService: AuthenticationService, private route: ActivatedRoute,
        private router: Router, private reportdefService: ReportdefService,private nameGlobalService: NameGlobalService, private geolocationService: GeolocationService

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

        let sParams = getCookie('paramsCompartir');
        let sMetodo = getCookie('metodoCompartir');
        
        this.paramsCoockie = sParams;
        this.metodoCoockie = sMetodo;

        if (!this.paramsCoockie) {
          this.authenticationService.logout();
        }

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
      await setearLatitudyLongitudGlobal(user.listGlobales, this.geolocationService);
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
       await ejecutarMetodoArea(user, user.listGlobales, this.reportdefService, this.nameGlobalService);
      }
 
     
      this.router.navigate(['/pages']);
    }

   



    login() {
      return new Promise(resolve => {


        this.authenticationService.loginExternal(environment.idSession).subscribe
        (user => {
                // login successful if there's a jwt token in the response
                     if (user.errorBusiness) {

                        if (this.paramsCoockie) {
                          user = JSON.parse(localStorage.getItem('currentUser'));
                          if (user) {
                            user.metodo = this.metodoCoockie;
                            let listParam = extraerParamsShared(this.paramsCoockie);
                            let listNew = [];
                            for (let g of user.listGlobales) {
                              for (let gs of listParam) {
                                if (g.name === gs.name)
                                  g.valueNew = gs.value;
                              }
                              listNew.push(g);
                            }
                            // actualizo los globales con los parametros de las cookies
                            localStorage.setItem('paramGlobal', JSON.stringify(listNew));
                            this.nameGlobalService.reloadInfo = true;
                            this.router.navigate(['/pages']);
                          } else
                            this.router.navigate(['/login']);
                        }
                        else 
                          this.router.navigate(['/login']);

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
