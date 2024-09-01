import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
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
  public email : string;
  loading = false;
  usuarioMesa = false;
  submitted = false;
  usuario = JSON.parse(localStorage.getItem('currentUser'));
  mobile: boolean = isMobile;
  tablet: boolean = screen.width > 600;
  public targetUser: boolean = false;
  public popUp: boolean = false;
  public overlay: boolean = false;
  actualPass = '';
  newPass = '';
  rNewPass = '';

  consultaForm: FormGroup;

  constructor(private appSettings: AppSettings,  private router: Router,private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,  private exitService: ExitService,
    private metodoService: MetodoService, private toastService: ToastrService, private reportdefService:ReportdefService) {
      this.settings = this.appSettings.settings;
    }

    // tslint:disable-next-line:use-life-cycle-interface
   
  ngOnInit() {
    this.consultaForm = this.formBuilder.group({
      consulta: ['', [Validators.required]],
      prioridad: ['baja', [Validators.required]],
    });

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

   mandarMensaje() {
    this.submitted = true;
    if (this.consultaForm.invalid) {
      return;
    }
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const  chatDTO = {} as ChatDTO;
    chatDTO.msg = this.f.consulta.value;
    chatDTO.prioridad = this.f.prioridad.value;
    chatDTO.de = user.username;
    chatDTO.idAplica = user.idAplica;

          // console.log(data.camposPersistirDTO);
          this.metodoService.nuevoChat(user, chatDTO).subscribe
          (result => {
              this.toastService.success('mensaje enviado con exito');
          },
          (err: HttpErrorResponse) => {
            this.toastService.error('no se ha podido enviar la consulta, intente más tarde');
          });

    
    
  }

  public obtenerInfoUser(){
    let dto = {} as ParametrosExecuteMethodRequestDTO;
    let username = {} as FormdataReportdef;
    dto.list = [];

    username.name = 'p_user';
    username.type = FrontEndConstants.JAVA_LANG_STRING;
    username.valueNew = this.usuario.username;
    username.text = true;
    dto.list.push(username);

    dto.metodo = 'getUser';

    this.reportdefService.postExecuteMethod(this.usuario,dto).subscribe({
      next: res => {
        console.log(res.valor);
        let map = JSON.parse(res.valor);
        this.email = map.email;
        this.come = map.come;
      },
      error: err => {
        console.log(err);
        
      }
    })
  }

  public verificarNewPass(){
    if(!this.newPass.includes(this.rNewPass)){
      this.toastService.error('La contraseña nueva no coincide con la reingresada!');
      this.popUp = true;
      this.overlay = true;
      this.resetFormularioPass();
      return false;
    }
    return true;
  }

  public resetFormularioPass(){
    this.actualPass = null;
    this.newPass = null;
    this.rNewPass = null;
  }

  public changePass(){
    this.overlay = false;
    if(this.verificarNewPass()){
      this.reportdefService.cambiarContrasena(this.usuario, this.newPass, this.actualPass, this.usuario.idUsuarioUra, this.usuario.mail).subscribe({
        next: res => {
          this.toastService.success(res['mensaje']);
          this.popUp = false;
          this.resetFormularioPass();
        },
        error: err =>{
          this.toastService.error(err.mensaje);
          this.popUp = true;
          this.overlay = true
          this.resetFormularioPass();
        }
        
      })
    }
  }

}
