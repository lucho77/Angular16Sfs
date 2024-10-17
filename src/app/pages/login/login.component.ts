import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../_services/authentication.service';
import { ReportdefService } from '../../_services/reportdef.service';
import { ejecutarMetodoArea, setearLatitudyLongitudGlobal, getCookie } from './loginUtil';
import { NameGlobalService } from 'src/app/_services/nameGlobalService';
import { GeolocationService } from 'src/app/_services/Geolocation.service';
import { WebauthnService } from 'src/app/_services/webauthnService';
import { credentialFinishRequest } from 'src/app/_models/credentialFinishRequest';
import { share } from 'rxjs';
import { FormdataReportdef } from 'src/app/_models/formdata';


@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'],

})

export class LoginComponent implements OnInit, AfterViewInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    errorLogin = false;
    returnUrl: string;
    error = '';
    loadSpinner = false;
    getParamToken = false;
    tokenCel = '';
    context: any;
    tokenAndroid: string;
    paramsCoockie: string;
    metodoCoockie: string;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private reportdefService: ReportdefService,
        private geolocationService: GeolocationService,
        private nameGlobalService: NameGlobalService, 
        private authService:WebauthnService,
    ) {}

    ngOnInit() {
              this.cargarForm();

    }


    private cargarForm() {
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
    console.log('Estoy entrando al Login');
    this.route.paramMap.subscribe(params => {
        console.log(params);
        const eExt = params.get('ext');
        console.log('EL parametro 1A login es : ' + eExt);

      let sParams = getCookie('paramsCompartir');
      let sMetodo = getCookie('metodoCompartir');
      console.log(sParams, sMetodo);
      
      this.paramsCoockie = sParams;
      this.metodoCoockie = sMetodo;
      
      });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    }



    ngAfterViewInit() {
      const preloaderElement = document.getElementById('preloader');
    if (preloaderElement) {
      preloaderElement.classList.add('hide');
    }
        this.ponerFocus();
    }
    ponerFocus() {
        const el = document.querySelector('input[formcontrolname=username]');
        const el1 = <HTMLInputElement>el;
        el1.focus();
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    async onSubmit() {
        this.submitted = true;
        this.loadSpinner = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        localStorage.removeItem('paramGlobal');
        sessionStorage.removeItem('tabInformationName');
        sessionStorage.removeItem('tabInformationBody');

        this.loading = true;
        const user  = await this.login();
        this.router.navigate(['/pages']);
        this.loadSpinner = false;

    }
    initBiometricAuth(){

      this.authenticationService.initAuth().subscribe({
        next:(data)=>{
          let dataJson = JSON.parse(data.respuestagenerica);
          let requestKey:any ={publicKeyCredentialRequestOptions:{challenge:dataJson.publicKey.challenge, rpId:dataJson.publicKey.rpId,timeout: 360000,extensions:{}}}    
          this.authService.getAssertion(dataJson).then(
            (m)=>{
              let finishAuth = {} as credentialFinishRequest;
              finishAuth.request = JSON.stringify(requestKey);
              finishAuth.attestattion=m;
              this.authenticationService.finishAuth(finishAuth).subscribe({
                next:(data)=>{
                    console.log(data);
                },
                error:(e)=>{console.log('error')}
              }
              )
              console.log('login passkey success')
            }
          ).catch(
            (e)=>{
              console.log('login passkey error')
            }
          )
        },
        error:(e)=>{

          this.errorLogin = true;
          this.error = "se ha producido un error al intentar authenticarse via passkey";
      }});

    }
    login() {
      return new Promise(resolve => {
      this.authenticationService.login(this.f.username.value, this.f.password.value).subscribe
      (async user => {
              
                  console.log('USUARIOLOGUEANDO',user);

                   if (user.errorBusiness) {
                       // es un error
                       console.log('ERRORRRRRRRRRRRRRRRRRRR');
                       console.log('error metodo login');

                       this.errorLogin = true;
                       this.error = user.mensaje;
                      // this.loadSpinner = false;
                      //reject();
                      return;
                   }
                   // this.loadSpinner = false;
                   if (user && user.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  // limpio la cache local
                  console.log('limpiando cache');
                  console.log('antes del localstorage');
                  localStorage.setItem('currentUser', String(null));
                  console.log('despues del localstorage');

                  this.authenticationService.logout();
                  // this.loadSpinner = false;
                   }
                   if (!user.sharedDTO && this.paramsCoockie) {
                    user.metodo = this.metodoCoockie;
                    let listParam = this.extraerParamsShared(this.paramsCoockie);
                    for (let g of user.listGlobales) {
                      for (let gs of listParam) {
                        if (g.name === gs.name && !g.valueNew)
                          g.valueNew = gs.value;
                      }
                    }
                   }
                   localStorage.setItem('currentUser', JSON.stringify(user));
                   localStorage.setItem('paramGlobal', JSON.stringify(user.listGlobales));
                   localStorage.setItem('userMenu', JSON.stringify(user.menueViejo));
                   localStorage.setItem('reporte', user.reporteInicio);
                   await setearLatitudyLongitudGlobal(user.listGlobales, this.geolocationService);

                   if (user['metodo'] !== null && user['metodo'] !== undefined) {
                    ejecutarMetodoArea(user, user.listGlobales, this.reportdefService, this.nameGlobalService);
                  }
      
                   // this.cargarChat(user);
                    resolve(user);
      },
      (err: HttpErrorResponse) => {
        console.log('ERRORRRRRRRRRRRRRRRRRRR');
        console.log('error metodo login');
        console.log(err);
          this.errorLogin = true;
          this.loadSpinner = false;
          if (err['errorBusiness']) {
              // es un error
              this.error = err['mensaje'];
              //reject();

              return;
          } else {
              this.error = 'error grave al tratar de loguearse, vuelva a intentarlo';
              //reject();
              return;

          }
        }
      );
    });
    }

    extraerParamsShared(params: string) {
      let paramShared = params.split(/[;,]/);
      const listParam = [];
      for (let p of paramShared) {
        let sp = p.split('=');
        let param = {name: "",value: ""};
        param.name = sp[0];
        param.value = sp[1];
        listParam.push(param);
      }
      return listParam;
    }
  }
