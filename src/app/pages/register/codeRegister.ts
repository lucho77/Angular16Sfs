import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RegistroDTO } from "src/app/_models/registroDTO";
import { SemillaDTO } from "src/app/_models/semillaDTO";
import { AuthenticationService } from "src/app/_services";
import { AppConfigService } from "src/app/providers/app-config.service";

@Component({
    selector: 'app-codeRegister',
    templateUrl: './codeRegister.html',
    encapsulation: ViewEncapsulation.None
  })
  export class CodeRegisterComponent implements OnInit {
  
    public form: FormGroup;
    public semilla: AbstractControl;
    public userName: AbstractControl;

    error = '';
    paramRegister = {} as RegistroDTO;
    dataUser:any;
    constructor(private router: Router,  fbValida: FormBuilder, private authenticationService: AuthenticationService,
        private appConfig:AppConfigService) {
    
        this.form = fbValida.group({
            semilla: ['', Validators.compose([Validators.required])],
             userName: ['']
        });

         
        const p =  localStorage.getItem('userAdd');
        if(p){
            this.paramRegister= JSON.parse(p);
            this.form.controls['userName'].setValue(this.paramRegister.username.trim());
        }

    }
    ngOnInit(): void {
        const d =  localStorage.getItem('dataUser');
        if(d){
            this.dataUser = JSON.parse(d);

        }
    }

    solicitarNuevoCodigo() {
        this.error = '';
        const semillaDTO = {} as SemillaDTO;
        semillaDTO.usernameGenericDesa = this.dataUser.userDesa;
        semillaDTO.usernameGenericProd = this.dataUser.userProd;

        semillaDTO.usernameNuevo  = this.paramRegister.username.trim();
        semillaDTO.email = this.paramRegister.email;
        semillaDTO.name = this.paramRegister.name;
        this.authenticationService.getNuevaSemilla(semillaDTO).subscribe
        ( register => {
            /*
            this.confirmationDialogService.confirm(true, 'Atencion!',
            // tslint:disable-next-line:max-line-length

            'se ha generado con exito el codigo de validacion, verifique en su celular o en su casilla de correo')
            .then((confirmed) => {
            if (confirmed) {
            }
            }).catch(() => this.router.navigate(['/login']));
            console.log(register);
            */
        },
            (err: HttpErrorResponse) => {
                console.log(err);
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
        this.error = '';
            if (this.form.valid) {
                const semillaDTO = {} as SemillaDTO;
                semillaDTO.usernameGenericDesa = this.dataUser.userDesa;
                semillaDTO.usernameGenericProd = this.dataUser.userProd;
                semillaDTO.usernameGenericUser=this.dataUser.userGeneric;
                const u =  localStorage.getItem('userAdd');
                if(u){
                    const p =  JSON.parse(u);
                    this.paramRegister = p;
                    semillaDTO.semilla = this.form.controls['semilla'].value;                
                    if (this.paramRegister.username === undefined || this.paramRegister.username === null ||
                        this.paramRegister.username.trim() === '' ) {
                            this.error = 'no existe el usuario';
                            return ;
    
                    }
                    semillaDTO.usernameNuevo  = this.paramRegister.username.trim();
                    semillaDTO.habilitaUsuario=true;
    
                    this.authenticationService.getChequearSemilla(semillaDTO).subscribe
                    ( register => {
                        /*
                        this.confirmationDialogService.confirm(true, 'Atencion!',
                        // tslint:disable-next-line:max-line-length
                        'feclicitaciones!, ha verificado su cuenta con exito su cuenta, ya puede utilizar la aplicacion. Gracias por elegirnos')
                        .then((confirmed) => {
                        if (confirmed) {
                             this.router.navigate(['/login']);
                        }
                        }).catch(() => this.router.navigate(['/login']));
                        console.log(register);
                        */
                      },
                        (err: HttpErrorResponse) => {
                          console.log(err);
    
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
    

                }
            return;
        }

    }


