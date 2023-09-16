import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { trigger,  state,  style, transition, animate } from '@angular/animations';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { ExitService } from 'src/app/_services/exitService';
import { User } from 'src/app/_models';

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
  loading = false;
  usuarioMesa = false;


  constructor(private appSettings: AppSettings,  private router: Router,
    private authenticationService: AuthenticationService,  private exitService: ExitService) {
      this.settings = this.appSettings.settings;
    }

    // tslint:disable-next-line:use-life-cycle-interface
   
  ngOnInit() {
    if(window.innerWidth <= 768) 
    this.showHorizontalMenu = false;
    // this.nameGlobalService.setearNameGlobal('SIN SELECCION', 'no hay informacion que mostrar');
    if (window.innerWidth <= 768) {
      this.showHorizontalMenu = false;
    }
    const user = <User>JSON.parse(localStorage.getItem('currentUser'));

    this.usuarioMesa = user.usuarioMesa;

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
  
}
