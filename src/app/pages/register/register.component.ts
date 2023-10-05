import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { RegistroDTO } from '../../_models/registroDTO';
import { AuthenticationService } from '../../_services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { ConfirmationDialogService } from '../confirmDialog/confirmDialog.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { SemillaDTO } from '../../_models/semillaDTO';
declare function applicacionContext(): any;
declare function androidUsername(): any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
    public router: Router;
    public form: FormGroup;
    public formValida: FormGroup;
    public name: AbstractControl;
    public email: AbstractControl;
    public dni: AbstractControl;
    public userName: AbstractControl;
    public userName2: AbstractControl;
    public fecnac: AbstractControl;
    public password: AbstractControl;
    public semilla: AbstractControl;
    public phone: AbstractControl;
    public confirmPassword: AbstractControl;
    errorLogin = false;
    error = '';
    registrase = true;
    paramRegister = {} as RegistroDTO;
    isMOvil = false;
    click = false;
    clickValida = false;
    loadSpinner = false;
    version = '';
    constructor(router: Router, fb: FormBuilder, fbValida: FormBuilder, private authenticationService: AuthenticationService,
        private confirmationDialogService: ConfirmationDialogService) {
        this.router = router;
        this.form = fb.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            email: [''],
            password: ['', Validators.required],
            phone: [''],
            dni: ['', Validators.required],
            userName: ['', Validators.required],
            fecnac: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        }, {validator: matchingPasswords('password', 'confirmPassword')});

        this.name = this.form.controls['name'];
        this.dni = this.form.controls['dni'];
        this.fecnac = this.form.controls['fecnac'];
        this.email = this.form.controls['email'];
        this.password = this.form.controls['password'];
        this.confirmPassword = this.form.controls['confirmPassword'];
        this.userName = this.form.controls['userName'];
        this.phone = this.form.controls['phone'];
        this.formValida = fbValida.group({
            semilla: ['', Validators.compose([Validators.required])],
             userName2: ['']
        }
            );
            this.semilla = this.formValida.controls['semilla'];
            this.userName2 = this.formValida.controls['userName2'];


    }
    ngOnInit() {
        this.obtenerVersion();
        if (this.isAndroid()) {
            console.log('ES es una nativeApp');
            this.isMOvil = true;
            const context = JSON.parse(applicacionContext());
            console.log(JSON.stringify(context));
            }

        console.log(this.form);
    }

    obtenerVersion() {
        this.authenticationService.version().subscribe
        (result => {
          console.log(result);
          this.version = result.respuestagenerica;
        },
        (err: HttpErrorResponse) => {
          console.log('no se ha podido obtener la version');
        });
    }
    isAndroid() {
        console.log(navigator.userAgent);
        console.log(/MisTurnos\/[0-9\.]+$/.test(navigator.userAgent));
          return /MisTurnos\/[0-9\.]+$/.test(navigator.userAgent);
    }
    solicitarNuevoCodigo() {
        this.clickValida = true;
        this.loadSpinner = true;
        this.error = '';
        const semillaDTO = {} as SemillaDTO;
        if (this.isMOvil) {
            const context = JSON.parse(applicacionContext());
            console.log(JSON.stringify(context));
            semillaDTO.usernameGeneric = context.username;
            semillaDTO.usernameGenericProd = androidUsername();
        } else {
            semillaDTO.usernameGeneric = 'citassgd';
            semillaDTO.usernameGenericProd = 'citassg';
        }
        const p = localStorage.getItem('userAdd') ? JSON.parse(localStorage.getItem('userAdd')!) : null;

        this.paramRegister = p;

        semillaDTO.usernameNuevo  = this.paramRegister.username.trim();
        semillaDTO.email = this.paramRegister.email;
        semillaDTO.name = this.paramRegister.name;
        this.authenticationService.getNuevaSemilla(semillaDTO).subscribe
        ( register => {
            this.loadSpinner = false;
             this.clickValida = false;
            this.confirmationDialogService.confirm(true, 'Atencion!',
            // tslint:disable-next-line:max-line-length

            'se ha generado con exito el codigo de validacion, verifique en su celular o en su casilla de correo')
            .then((confirmed) => {
            if (confirmed) {
            }
            }).catch(() => this.router.navigate(['/login']));
            console.log(register);
        },
            (err: HttpErrorResponse) => {
                this.clickValida = false;
                this.loadSpinner = false;
                console.log(err);
          this.errorLogin = true;
          if (err.error['errorBusiness']) {
              // es un error
              this.error = err.error['mensaje'];
              return;
          } else {
            this.error = 'error grave al intentar obtener un nuevo codigo de validacion';
              return;
          }
        });
    }
     public onSubmit(): void {
        this.loadSpinner = true;
        this.error = '';
        if (!this.registrase) {
            this.clickValida = true;
            if (this.formValida.valid) {
                const semillaDTO = {} as SemillaDTO;
                if (this.isMOvil) {
                    const context = JSON.parse(applicacionContext());
                    console.log(JSON.stringify(context));
                    semillaDTO.usernameGeneric = context.username;
                    semillaDTO.usernameGenericProd = androidUsername();
                } else {
                    semillaDTO.usernameGeneric = 'citassgd';
                    semillaDTO.usernameGenericProd = 'citassg';
                }
                const p = localStorage.getItem('userAdd') ? JSON.parse(localStorage.getItem('userAdd')!) : null;
                this.paramRegister = p;
                semillaDTO.semilla = this.formValida.controls['semilla'].value;
                if (this.paramRegister.username === undefined || this.paramRegister.username === null ||
                    this.paramRegister.username.trim() === '' ) {
                        this.error = 'no existe el usuario';
                        this.clickValida = false;
                        return ;

                }
                semillaDTO.usernameNuevo  = this.paramRegister.username.trim();
                this.authenticationService.getChequearSemilla(semillaDTO).subscribe
                ( register => {
                    this.loadSpinner = false;
                    this.clickValida = false;
                    this.confirmationDialogService.confirm(true, 'Atencion!',
                    // tslint:disable-next-line:max-line-length
                    'feclicitaciones!, ha verificado su cuenta con exito su cuenta, ya puede utilizar la aplicacion. Gracias por elegirnos')
                    .then((confirmed) => {
                    if (confirmed) {
                         this.router.navigate(['/login']);

                    }
                    }).catch(() => this.router.navigate(['/login']));
                    console.log(register);
                  },
                    (err: HttpErrorResponse) => {
                        this.loadSpinner = false;
                        this.clickValida = false;
                      console.log(err);
                      this.errorLogin = true;
                      this.click = false;

                      if (err.error['errorBusiness']) {
                          // es un error
                          this.error = err.error['mensaje'];
                          return;
                      } else {
                        this.error = 'error grave al tratar de registrarse, vuelva a intentarlo';
                          return;
                      }
                    });
            }
            return;
        }

         if (this.registrase) {
            this.click = true;

        if (this.form.valid) {
            const email = this.form.controls['email'].value;
            const pho = this.form.controls['phone'].value;
              if ((email === undefined || email.trim() === '') && (pho === undefined || pho.trim() === '')) {
                this.error = 'debe completar el campo mail o en su defecto el campo telefono';
                this.click = false;
                this.errorLogin = true;

                this.loadSpinner = false;
                return;
              }
              if (email !== undefined && email.trim() !== '') {
/*                const emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
                if (!emailRegexp.test(email.trim())) {
                    this.error = 'Email invalido, introduzca una dorección de mail válida';
                    this.click = false;
                    this.errorLogin = true;
                    this.loadSpinner = false;
                    return;
                }
                    */
              }
              const token = localStorage.getItem('paramToken') ? JSON.parse(localStorage.getItem('paramToken')!) : null;
            console.log('token');
            console.log(token);
            if (token === null) {
                if (this.isMOvil) {
                    const context = JSON.parse(applicacionContext());
                    this.paramRegister.usernameGeneric = context.username;
                    this.paramRegister.usernameGenericProd = androidUsername();
                    if (this.paramRegister.usernameGeneric === undefined || this.paramRegister.usernameGeneric === null ||
                        this.paramRegister.usernameGenericProd === undefined || this.paramRegister.usernameGenericProd === null ) {
                            this.click = false;
                            this.loadSpinner = false;
                            this.errorLogin = true;
                            this.error = 'el usuario generico o el usuario generico prod no estan seteados';
                    }
                } else {
                    this.paramRegister.usernameGeneric = 'citassgd';
                    this.paramRegister.usernameGenericProd = 'citassg';
                }
            } else {
                console.log('parametros guardados en el celu');
                console.log(token.username);
                console.log(token.usernameProd);
                this.paramRegister.usernameGeneric = token.username;
                this.paramRegister.usernameGenericProd = token.usernameProd;
            }
            this.paramRegister.username =   this.form.controls['userName'].value;
            this.paramRegister.username = this.paramRegister.username.trim();

            this.paramRegister.password =   this.form.controls['password'].value;
            this.paramRegister.email =   this.form.controls['email'].value;
            this.paramRegister.dni =   this.form.controls['dni'].value;
            this.paramRegister.phone =   this.form.controls['phone'].value;
            if (this.paramRegister.email.trim() === '' && this.paramRegister.phone.trim() === '') {
                const mensaje = 'no puede dejar vacios los campos Email y Celular, al menos debe completar uno';
                this.click = false;
                this.loadSpinner = false;
                this.errorLogin = true;
                this.error = mensaje;
                return;
              }
            const date: NgbDate = this.form.controls['fecnac'].value;
            const fechaString = date.day + '-' + date.month + '-' + date.year;
            const now = moment(fechaString, 'DD-MM-YYYY');

            if (!now.isValid) {
                this.click = false;
                const mensaje = 'El formato de fecha ingresada no es valido';
              this.error = mensaje;
              return;
            }
            this.paramRegister.fecnac =  now.format('DD-MM-YYYY');
            this.paramRegister.name   =  this.form.controls['name'].value;
            this.authenticationService.getRegister(this.paramRegister).subscribe
            ( register => {
                this.loadSpinner = false;
                localStorage.setItem('userAdd', JSON.stringify(this.paramRegister));
                this.formValida.controls['userName2'].setValue(this.paramRegister.username.trim());
                this.confirmationDialogService.confirm(true, 'Atencion!',
                // tslint:disable-next-line:max-line-length
                'feclicitaciones!, ha creado con exito su cuenta, ahora necesita revisar su casilla de mensajes en su celular. Gracias por elegirnos')
                .then((confirmed) => {
                    localStorage.setItem('userAdd', JSON.stringify(this.paramRegister));
                    this.formValida.controls['userName2'].setValue(this.paramRegister.username.trim());
                    this.registrase = false;
                    this.loadSpinner = false;
                       if (confirmed) {
                    this.registrase = false;
                    // this.router.navigate(['/login']);                }
                }
                }).catch(() => this.router.navigate(['/login']));

                console.log(register);
              },
                (err: HttpErrorResponse) => {
                    this.loadSpinner = false;
                    console.log(err);
                  this.errorLogin = true;
                  this.click = false;
                  if (err.error['errorBusiness']) {
                      // es un error
                      this.error = err.error['mensaje'];
                      return;
                  } else {
                    this.error = 'error grave al tratar de registrarse, vuelva a intentarlo';
                      return;
                  }
                });
            }
            console.log('ok!');
            //
        } else {

        }
     }
    }
    export function emailValidator(control: FormControl) {
    const emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (control.value && !emailRegexp.test(control.value.trim())) {
        return {invalidEmail: true};
    }
    return {invalidEmail: false};

}
export function noWhitespaceValidator(control: FormControl) {
    const isWhitespace = control.value.trim().indexOf(' ') >= 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        const password = group.controls[passwordKey];
        const passwordConfirmation = group.controls[passwordConfirmationKey];
        if (password.value !== passwordConfirmation.value) {
            return passwordConfirmation.setErrors({mismatchedPasswords: true});
        }
    };
}
