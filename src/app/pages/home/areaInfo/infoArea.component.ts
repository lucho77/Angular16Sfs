import { Component, Input} from '@angular/core';
import { Subscription } from 'rxjs';
import { NameGlobalService } from '../../../_services/nameGlobalService';
import { FormdataReportdef } from '../../../_models/formdata';
import { DomSanitizer } from '@angular/platform-browser';
import { isMobile } from 'mobile-device-detect';
import { Router } from '@angular/router';

@Component({
  selector: 'app-infoarea',
  templateUrl: './infoAreaComponent.html',
})
export class InfoAreaComponent   {
  imgBase64 = null;
  mobile: boolean = isMobile;
  tablet: boolean = screen.width > 600;

  public data: DataUsuario = {
    name: 'Sin Seleccion',
    info: 'no hay informacion que mostrar',
    labelButton: 'Agregar',
    dataSeleccion: false
  };
  private nameRef: Subscription = null;
  mostrarFoto = false;
  constructor(private nameGlobalService: NameGlobalService, private domSanitizer:DomSanitizer, public router : Router) {
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {

      this.nameRef.unsubscribe();
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {

      // this.nameGlobalService.setearNameGlobal('SIN SELECCION', '');

    const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
    console.log(formdataGlobales);
    const name = sessionStorage.getItem('tabInformationName');
    const body = sessionStorage.getItem('tabInformationBody');

    console.log('name');
    console.log('body');
    console.log(name);
    console.log(body);

    if (name && body) {
      this.data.name = name;
      this.data.info = body;
      let posicion = body.indexOf('FOTO:');

      if (posicion!==-1) {
        console.log('La variable contiene el texto "fofo"');
           const dataArray = body.split('FOTO:');
           const sanitize = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' +dataArray[1]); 
          this.imgBase64 = sanitize;
          this.data.info =  dataArray[0];
          this.mostrarFoto = true;
        } else {
          this.mostrarFoto = false;
          this.data.info = body;
        console.log('La variable no contiene el texto "fofo"');
      }

      console.log('seteo el globalSerice');
    } else {
      this.data.name = 'SIN SELECCIÓN';
      this.data.info = 'No hay informacion que mostrar';
    }

    this.nameRef = this.nameGlobalService.nameChanged$.subscribe(() => {
      if(this.nameGlobalService.getName()!=="null"){
        this.data.name = this.nameGlobalService.getName();
      }
      if(this.nameGlobalService.getDetalle()!=="null"){
        let posicion = this.nameGlobalService.getDetalle() !== undefined?this.nameGlobalService.getDetalle().indexOf('FOTO:'):-1;
        if (posicion!== -1) {
          console.log('La variable contiene el texto "fofo"');
          const dataArray = this.nameGlobalService.getDetalle().split('FOTO:');
          const sanitize = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' +dataArray[1]); 
          this.mostrarFoto = true;
          this.imgBase64 = sanitize;
            console.log(this.imgBase64);
  
            this.data.info =  dataArray[0];
          } else {
          console.log('La variable no contiene el texto "fofo"');
          this.mostrarFoto = false;
          this.data.info=this.nameGlobalService.getDetalle();
        }
        this.data.dataSeleccion = true;
      }

      //this.data.info = this.nameGlobalService.getDetalle();
    });
  }

}
export interface DataUsuario {
  name: string;
  info: string;
  labelButton: string;
  dataSeleccion: boolean;
}
