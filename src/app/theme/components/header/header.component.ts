import { Component, OnInit, ViewEncapsulation, HostListener, ViewChild, ElementRef } from '@angular/core';
import { trigger,  state,  style, transition, animate } from '@angular/animations';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { ExitService } from 'src/app/_services/exitService';
import { User } from 'src/app/_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatDTO } from 'src/app/_models/chatDTO';
import { MetodoService } from 'src/app/_services/metodoService';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { isMobile } from 'mobile-device-detect';
import { ParametrosExecuteMethodRequestDTO } from 'src/app/_models/parametrosExecuteMethodRequestDTO';
import { FormdataReportdef } from 'src/app/_models/formdata';
import { FrontEndConstants } from 'src/app/constans/frontEndConstants';
import { ReportdefService } from 'src/app/_services/reportdef.service';
import { WebauthnService } from 'src/app/_services/webauthnService';
import { RegisterCredentialsDto } from 'src/app/_models/registerCredentialRequest';

interface Pass{
  actualPass: string | null
  newPass: string | null
  rNewPass: string | null
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ],
  animations: [
    trigger('showInfo', [
      state('1' , style({ transform: 'rotate(180deg)' })),
      state('0', style({ transform: 'rotate(0deg)' })),
      transition('1 => 0', animate('400ms')),
      transition('0 => 1', animate('400ms'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  public showHorizontalMenu = true;
  public showInfoContent = false;
  public settings: Settings;
  public menuItems: any;
  public come : string;
  public mail : string;
  public emailNgModel: string;
  loading = false;
  usuarioMesa = false;
  submitted = false;
  usuario = JSON.parse(localStorage.getItem('currentUser'));
  mobile: boolean = isMobile;
  tablet: boolean = screen.width > 600;
  public targetUser: boolean = false;
  public popUp: boolean = false;
  public popUpOpciones: boolean = false;
  public popUpEmail: boolean = false;
  public overlay: boolean = false;
  public isOpen = true;
  actualPass = '';
  newPass = '';
  rNewPass = '';
  nuevoEmail = '';
  @ViewChild('textAreaConsulta') textAreaConsulta: ElementRef;
  @ViewChild('selectPrioridad') selectPrioridad: ElementRef;
  

  consultaForm: FormGroup;

  constructor(private appSettings: AppSettings,  private router: Router,private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,  private exitService: ExitService,
    private metodoService: MetodoService, private toastService: ToastrService, private reportdefService:ReportdefService, private webAuthnService:WebauthnService) {
      this.settings = this.appSettings.settings;
    }

    // tslint:disable-next-line:use-life-cycle-interface
   
  ngOnInit() {

    if(window.innerWidth <= 768) 
    this.showHorizontalMenu = false;
    // this.nameGlobalService.setearNameGlobal('SIN SELECCION', 'no hay informacion que mostrar');
    const user = <User>JSON.parse(localStorage.getItem('currentUser'));

    this.usuarioMesa = user.usuarioMesa;
    this.obtenerInfoUser();

   /*
    this.nameRef = this.nameGlobalService.nameChanged$.subscribe(() => {
      this.data.name = this.nameGlobalService.getName();
      this.data.info = this.nameGlobalService.getDetalle();
      this.data.dataSeleccion = true;
      this.data.labelButton = 'Modificar';
      console.log('this.name');
      console.log(this.data.name);
      console.log('this.info');
      console.log(this.data.info);
    }); */
    
  }



  public closeSubMenus(){
    let menu = document.querySelector("#menu0"); 
    if(menu){
      for (let i = 0; i < menu.children.length; i++) {
          let child = menu.children[i].children[1];
          if(child){          
              if(child.classList.contains('show')){            
                child.classList.remove('show');
                menu.children[i].children[0].classList.add('collapsed'); 
              }             
          }
      }
    }
  }
  viewHelp(){
    let urlHelp = localStorage.getItem('currentMenuClick');
    if(urlHelp){
      let url = JSON.parse(urlHelp);
      if(url.ayuda){
        window.open(url.ayuda, '_blank');
      }
    }
  }
  @HostListener('window:resize')
  public onWindowResize():void {
     if(window.innerWidth <= 768){
        this.showHorizontalMenu = false;
     }      
      else{
        this.showHorizontalMenu = true;
      }
  }
salir() {
    // this.wService.logoutWS();
    this.exitService.setearExitGlobal();
    this.authenticationService.logout();
    this.router.navigate(['/']);
}

get f() { return this.consultaForm.controls; }

verificarConsulta(){

  if(!this.textAreaConsulta.nativeElement.value && !this.selectPrioridad.nativeElement.value){
    this.toastService.error("Por favor rellene los campos");
    return false;
  }

  if(!this.textAreaConsulta.nativeElement.value){
      this.toastService.error("No puede dejar el campo Consulta vacío!");
      return false;
  }
  
  return true;
}
  // Verifica si WebAuthn es soportado
  isWebAuthnSupported(): boolean {
    return !!window.PublicKeyCredential;
  }

registrarHuella(){
  if (!this.isWebAuthnSupported()) {
    this.toastService.error("WebAuthn no está soportado en este navegador");
    throw new Error('WebAuthn no está soportado en este navegador');
  }

  this.webAuthnService.createCredential().then((credential ) => { 
    let crede = {} as RegisterCredentialsDto;
    crede.id = credential.id;
    crede.rawId= credential.rawId;
    crede.type = credential.type;
    crede.response = credential.response;
    this.toastService.success("Huella registrada con éxito!");
    const user = <User>JSON.parse(localStorage.getItem('currentUser'));
    let publicKey = this.webAuthnService.createPublicKeyString();

    this.authenticationService.storeCredential(user,crede,publicKey).subscribe(m=>{
      console.log(m);
    });

  });;


}

mandarMensaje() {
  this.submitted = true;
  const user = <User>JSON.parse(localStorage.getItem('currentUser'));
  const  chatDTO = {} as ChatDTO;
  chatDTO.msg = this.textAreaConsulta.nativeElement.value;
  chatDTO.prioridad = this.selectPrioridad.nativeElement.value;
  chatDTO.de = user.username;
  chatDTO.idAplica = user.idAplica;

  if(this.verificarConsulta()){
    this.metodoService.nuevoChat(user, chatDTO).subscribe({
      next: res => {
        this.toastService.success("Mensaje enviado con éxito!");
        this.textAreaConsulta.nativeElement.value = '';
      },
      error: err => {
        this.toastService.error("No se ha podido enviar el mensaje, intente más tarde");
      }
    })
  } 
}

public obtenerInfoUser(){  
  this.mail = this.usuario.mail;
  this.come = this.usuario.come;
}

public verificarCampos(){

  const errores = [
    { condicion: !this.actualPass, mensaje: 'Se necesita ingresar la contraseña actual' },
    { condicion: !this.newPass, mensaje: 'Debe ingresar la nueva contraseña!' },
    { condicion: !(this.newPass === this.rNewPass), mensaje: 'La contraseña nueva no coincide con la reingresada' }
  ];

  this.overlay = true;
  this.popUp = true;

  return this.verify(errores);
}

public verificarMail(){
  const error = [
    { condicion: !this.actualPass, mensaje: 'Se necesita ingresar la contraseña actual' },
    { condicion: !this.nuevoEmail, mensaje: 'Debe ingresar un mail válido' }
  ];

  this.overlay = true;
  this.popUpEmail = true;

  return this.verify(error);
}

public verify(arr) {
  for (const { condicion, mensaje } of arr) {
    if (condicion) {
      this.toastService.error(mensaje);
      return false;
    }
  }
  return true;
}

public resetFormulario(){
  this.actualPass = '';
  this.newPass = '';
  this.rNewPass = '';
  this.nuevoEmail = '';
}

public editarPerfil(){
    if(this.nuevoEmail){
      this.usuario.mail = this.nuevoEmail;
    }
    if((this.actualPass && this.nuevoEmail) && (!this.newPass && !this.rNewPass) || (this.newPass && !this.rNewPass)){
      this.newPass = this.actualPass;
    }
    this.reportdefService.cambiarContrasena(this.usuario, this.newPass ? this.newPass : null, this.actualPass ? this.actualPass : null, this.usuario.idUsuarioUra, this.usuario.mail).subscribe({
      next: res => {
        this.toastService.success(res['mensaje']);
        this.overlay = false;
        this.popUp = false;
        this.resetFormulario();
      },
      error: err =>{
        this.toastService.error(err.mensaje);
        this.popUp = true;
        this.overlay = true
        this.resetFormulario();
      }
        
    })
}

public editarContrasena(){
  if (this.verificarCampos()){
    this.editarPerfil()
  }
}

public editarMail(){
  if (this.verificarMail()){
    this.editarPerfil();
  }
}


}
