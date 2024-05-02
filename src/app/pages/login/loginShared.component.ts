﻿import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../_services/authentication.service';
import { ParametrosExecuteMethodRequestDTO } from '../../_models/parametrosExecuteMethodRequestDTO';
import { ReportdefService } from '../../_services/reportdef.service';
import { configurarParamnetrosGlobales, extenderToken, persistirTokenCel, configurarMenu } from './loginUtil';
import { TokenCel } from '../../_models/tokenCel';
//declare function androidToken(): any;
//declare function androidUsername(): any;
//declare function applicacionContext(): any;

@Component({
    templateUrl: 'loginShared.component.html'
})

export class LoginSharedComponent implements OnInit, AfterViewInit {
   usuario: string;
   semilla: string;
   context: any;
   tokenAndroid: string;
    isMovil: boolean;
    tokenCel = '';
    getParamToken = false;


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
    localStorage.removeItem('paramGlobal');
    sessionStorage.removeItem('tabInformationName');
    sessionStorage.removeItem('tabInformationBody');

    this.route.params.subscribe( params => {
      this.usuario = params['usuario'];
      this.semilla = params['semilla'];
    });
    /*
    this.route.queryParamMap.subscribe(queryParams => {
      this.usuario = queryParams.get('usuario');
      this.semilla = queryParams.get('semilla');
    });
*/
    this.authenticationService.logout();
    console.log('me voy a loguear');
    this.onExternalLogin();
}

ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide');
}

// convenience getter for easy access to form fields

 async onExternalLogin() {
  console.log('login Shared....');

  const shared = await this.loginShared(this.usuario, this.semilla);
  const user = await this.loginExternal(shared['idSession'], shared);
  user['sharedDTO'] = shared;
  const g = await  configurarParamnetrosGlobales(user, this.authenticationService, null, false, null);

  await this.obtenerMenu(user);
  await this.ejecutarMetodoArea(user, g);

  this.router.navigate(['/pages']);

  }

 ejecutarMetodoArea(user: any, m: any) {
  console.log('ejecutando metodo area');
  console.log(user.sharedDTO);
  return new Promise<void>(resolve => {
  const pos =  user.sharedDTO.metodo.indexOf('(');
  const listAux = [];
  const metodo =  user.sharedDTO.metodo.substring(0, pos);
  console.log('metodo');
  console.log(metodo);
  console.log('metodo');
  console.log(metodo);

  const param = user.sharedDTO.metodo.substring(pos + 1, (user.sharedDTO.metodo.length - 1 ));
  const params = param.split(',');
  console.log('param');
  console.log(param);
  console.log('params');
  console.log(params);
  for (const p of params) {
    for ( const g of m.list) {
      if (g.name === p) {
        listAux.push(g);
      }
    }
  }
  const dataMetodo = {} as ParametrosExecuteMethodRequestDTO;
  // tslint:disable-next-line:prefer-const
  dataMetodo.list = listAux;
  dataMetodo.pdf = false;
  dataMetodo.metodo = metodo;
   this.reportdefService.postExecuteMethod(user, dataMetodo).subscribe(
      (mensaje: any) => {
        sessionStorage.setItem('tabInformationBody', mensaje.valor);
        resolve();
      }
   );

});

}

loginShared(usuario: string, semilla: string) {
  return new Promise(resolve => {
    this.authenticationService.loginShared(usuario, semilla).subscribe
    (shared => {
      resolve(shared);
    });
  });
}

loginExternal(idSession: string, shared: any) {
  return new Promise(resolve => {
    this.authenticationService.loginExternal(idSession).subscribe
    (user => {
         if (user.errorBusiness) {
             // es un error
             this.router.navigate(['/login']);
             return;
         }
         if (user && user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // limpio la cache local
        console.log('limpiando cache');
        user.sharedDTO = shared;
        localStorage.setItem('currentUser', null);
        this.authenticationService.logout();


         }
         localStorage.setItem('currentUser', JSON.stringify(user));
         if (user.sharedDTO) {
          localStorage.setItem('reporte', user.sharedDTO.reporte);
          localStorage.setItem('codigoCompartir', user.sharedDTO.idInfomed);
         }
        resolve(user);


});
});
}



obtenerMenu(user: any) {
  this.authenticationService.getObtenerMenu(user.username, user.datasource, user.idUsuarioUra).subscribe
  (m => {
          // login successful if there's a jwt token in the response
//                       console.log('menu: ' + m);
           localStorage.setItem('userMenu', JSON.stringify(m));
          },
  (err: HttpErrorResponse) => {
    console.log('error de acceso al menu');
    if (err['tokenError'] || err['tokenExpired'] ) {
      this.router.navigate(['/token']);
      return;
    } else {
      this.router.navigate(['/token']);
      return;
    }
  }
  );


}




}
