import { Component, ViewEncapsulation, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormReportdef } from '../../../../_models/form';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FormdataReportdef } from 'src/app/_models/formdata';
import * as moment from 'moment'; // add this 1 of 4
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Tabular } from '../../../../_models/tabular';
import { ConfirmationDialogService } from '../../../confirmDialog/confirmDialog.service';
import { AbmService } from '../../../../_services/abmService';
import { HttpErrorResponse } from '@angular/common/http';
import { AltaEdicionABMDTO } from '../../../../_models/edicionABM';
import { ContainerAbmNuevoDTO } from '../../../../_models/AbmEditResponse';
import { ReportdefService } from '../../../../_services/reportdef.service';
import { PersistirEntidadRequest } from '../../../../_models/persistirEntidadRequest';
import { ConsultarHijosDTO } from '../../../../_models/consultarHijos';
import { FrontEndConstants } from '../../../../constans/frontEndConstants';
import { AbmParams } from '../../../../_models/abmParams';
import { HeaderDTO } from '../../../../_models/headerDTO';
import { NameGlobalService } from '../../../../_services/nameGlobalService';
import { Subscription } from 'rxjs';
import { ParamDataHijoService } from '../../../../_services/dataHijoService';
import { PersistirEntidadResponse } from '../../../../_models/persistirEntidadResponse';
import { AvisaSeteoService } from '../../../../_services/avisaSeteoService';
import { ReportdefData } from '../../../../_models/reportdefData';
import { ParametrosExecuteMethodRequestDTO } from '../../../../_models/parametrosExecuteMethodRequestDTO';
import { Router } from '@angular/router';
import { MetodoDTO } from '../../../../_models/metodoDTO';
import { PreMethodDTO } from 'src/app/_models/preMethodDTO';
import { ParamRequestDTO } from '../../../../_models/paramRequestDTO';
import { ToastrService } from 'ngx-toastr';
import { isNumber, toInteger } from 'src/app/util/datePicker/util';
import { consultarParametroByParam, crearParametro, ejecutarMetodo, seteoParamGlobal } from 'src/app/util/reportdefUtil';
import { Message } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AppSettings } from 'src/app/app.settings';
import { EsMobileService } from 'src/app/_services/es-mobile.service';
declare function mapa(usuario: string, latitud: number, longitud: number, info: string): any;

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],

})

export class FormularioComponent  implements OnInit {

  @Input('data') data: FormReportdef;
  @Input('reporte') reporte: string;
  @Input('labelForm') labelForm: string;
  @Input('dataHijos') dataHijos: Tabular;
  @Input('dataTabular') dataTabular: any;
  @Input('abmParams') abmParams: AbmParams;
  @Input('menu') menu: boolean;
  @Output()acciones = new EventEmitter<any>();
  @Output()accionesDina = new EventEmitter<any>();
  @Output()backHistory = new EventEmitter<any>();
  @Input('settings') settings: any;
  @Input('tipoReporte') tipoReporte: ReportdefData;

  firma = false;
  tieneHijos = {
    es: false,
    alta: false,
    tabular: true,
    id: null
  };
  mensajes = {
    visible: false,
    detalle: '',
  };
  form: FormGroup;
  formHijo: FormGroup;
  formRepordefHijos: FormReportdef;
  reporteHijos: string;
  idSeleccionado: number;
  mensajeErrorHijo:  Message[] = [];
  mensajeErrorPadre: Message[] = [];
  private nameRef: Subscription = null;
  private dataRef: Subscription = null;
  password:string;
  camposAgrupa: string[];
  camposAgrupaEntero: any[];
  camposAgrupaEnteroDescompuesto: any[];
  postUpdate: string;
  postPersist: string;
  filtros = false;
  urlResponse: string;
  hijoAux:boolean;
  formRepordefAux: FormdataReportdef;

  constructor(public EMS:EsMobileService,private confirmationDialogService: ConfirmationDialogService,
    private abmservice: AbmService, public toastrService: ToastrService, private reportdefService: ReportdefService,
    private nameService: NameGlobalService, private nameAvisoSeteo: AvisaSeteoService, private paramService: ParamDataHijoService,
    private router: Router,
    public appSettings: AppSettings ) {}
    // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    // tslint:disable-next-line:prefer-const
    this.password='';
    console.log('formInic');
    const fieldsCtrls = {};
    this.camposAgrupaEntero = [];
    this.camposAgrupaEnteroDescompuesto = [];

    if (this.dataHijos && this.dataHijos.etiqueta ) {
     this.reporteHijos = this.dataHijos.etiqueta;
    }

    this.actualizarDesdeGlobales(this.data.list);
    console.log('globales actualizados');
    console.log(this.data.list);
    // aca lo que hay que hacer es traer los formdata globales
    this.createFormAngular(fieldsCtrls, this.data.list);
    this.form = new FormGroup(fieldsCtrls);
    this.createValidators(this.data.list, this.form);

    // console.log(this.abmParams.tieneHijos);

    let bRes = [];
    const bResDescompuesto = [];
    // if (this.data.camposAgrupados === undefined || this.data.camposAgrupados === null) {
  if (this.data.camposAgrupados === undefined || this.data.camposAgrupados === null || this.data.camposAgrupados.length === 0) {
      bRes = [];
   } else {
      this.camposAgrupa = this.data.camposAgrupados.split('-');
      bRes = this.data.camposAgrupados.split(',').map(function(item) {
        return parseInt(item, 10);
      });

      bRes.forEach(element => {
        const xele = element;
          for (let index = 0; index < element; index++) {
            const element_xy = 12 / xele;
            bResDescompuesto.push(element_xy);
          }
      });


   }

    this.camposAgrupaEntero = bRes;
    this.camposAgrupaEnteroDescompuesto = bResDescompuesto;


  if (this.abmParams && this.abmParams.tieneHijos ) {
    this.tieneHijos.es = true;
    this.tieneHijos.alta = false;
  }
  this.dataRef = this.paramService.paramChanged$.subscribe(() => {
    this.abmParams = this.paramService.getParam();
    this.tieneHijos.es = true;
    this.tieneHijos.alta = false;
    this.tieneHijos.tabular = true;
   // this.reporteHijos =  this.abmParams.entidadHijo;
  });
  const cantBo = this.getCanBotoneVerdad(this.data.list);
  if (cantBo > 0) {
    this.nameAvisoSeteo.setCantidadBotones(cantBo);
  } else {
    this.nameAvisoSeteo.setCantidadBotones(0);

  }
 }

// tslint:disable-next-line:use-life-cycle-interface
ngOnDestroy() {
  console.log('formDestruido');
  if (this.dataRef !== null && this.dataRef !== undefined) {
    this.dataRef.unsubscribe();
  }
}

getCanBotoneVerdad(arreglo) {
  let cantBot = 0;
  const ii = 0;
  for (let index = 0; index < arreglo.length; index++) {
    const element = arreglo[index];
    if (element.buttom === true) {
     cantBot++;
    }
  }
  return cantBot;
}

private createFormAngular(fieldsCtrls: any, data: any ) {
  console.log(data);
  for (const f of data) {
    if (f.busquedaGenerica && !f.autocomplete && !f.combo) {
      if (f.global && f.value !== null  && !f.superVisible) {
        fieldsCtrls[f.name] = new FormControl({value : f.value, disabled: f.disable});
        continue;
       } else {
         if (f.disable) {
            fieldsCtrls[f.name] = new FormControl({value : f.valueNew, disabled: f.disable});
         } else {
            fieldsCtrls[f.name] = new FormControl({value : '', disabled: f.disable});
         }
        fieldsCtrls[f.nameRes] = new FormControl({ value : f.busquedaGenericaDTO.mostrarToStringLupa || '', disabled: true});
        continue;
      }
    } else {
      if (f.autocomplete) {
        let valor = '';
        if (f.valueNew) {
           valor = f.valueNew + '-' + f.busquedaGenericaDTO.mostrarToStringLupa;
        }
        fieldsCtrls[f.name] = new FormControl({value : valor  || '', disabled: f.disable});
        continue;
      }
       if (f.buttom) {
        fieldsCtrls[f.name] = new FormControl({value: f.value || '', disabled: f.disable});
        continue;
      } else {
        if (f.fecha && !f.fechaCustom ) {
          console.log('f');
          console.log(f);
            let now = null;
          if (f.valueNew !== null) {
            if (typeof f.valueNew === 'string' ) {
              now = moment(f.valueNew, 'DD-MM-YYYY'); // add this 2 of 4

            } else {
              now = moment(f.valueNew); // add this 2 of 4

            }
            } else if (f.value !== null) {
                now = moment(f.value); // add this 2 of 4
            }
            if (now !== null) {
              const date: NgbDate = new NgbDate(toInteger(now.format('YYYY')),
              toInteger(now.format('MM')), toInteger(now.format('DD'))); // July, 14 1789
              fieldsCtrls[f.name] = new FormControl({value: date || '',
              disabled: f.disable} );
            } else {
              fieldsCtrls[f.name] = new FormControl({value: '',
              disabled: f.disable} );
            }
            continue;
          }
          if (f.fechaCustom ) {
            if (f.valueNew !== null) {
              const time = new Date(f.valueNew);
              fieldsCtrls[f.name] = new FormControl({value: time,
              disabled: f.disable} );
            } else {
              fieldsCtrls[f.name] = new FormControl({value: '',
              disabled: f.disable} );
            }
            continue;

          }
            if (f.fechaHora ) {
            if (f.valueNew !== null) {
              fieldsCtrls[f.name] = new FormControl({value: f.valueNew,
              disabled: f.disable} );
            } else {
              fieldsCtrls[f.name] = new FormControl({value: '',
              disabled: f.disable} );
            }
            continue;
          }
          if (f.check) {
            if (f.valueNew !== null) {
             fieldsCtrls[f.name] = new FormControl({value: f.valueNew || '',
             disabled: f.disable} );
            } else {
             fieldsCtrls[f.name] = new FormControl({value: f.value || '',
             disabled: f.disable} );
            }
             continue;
          }
          if (f.labelComponent) {
            fieldsCtrls[f.name] = new FormControl({value : f.valueNew  || '', disabled: true});
            continue;
          }
          if (f.card) {
            fieldsCtrls[f.name] = new FormControl({value : f.valueNew  || '', disabled: true});
            continue;
          }
          if (f.radio) {
             fieldsCtrls[f.name] = new FormControl({value: '',
             disabled: f.disable} );
             continue;
          }
          if (f.clock) {
            fieldsCtrls[f.name] = new FormControl({value: '',
            disabled: f.disable} );
           continue;
          }
          if (f.entero && f.valueNew !== null && f.valueNew !== undefined && f.valueNew !== '') {
            // tslint:disable-next-line:radix
            const p = parseInt(f.valueNew);
            fieldsCtrls[f.name] = new FormControl({value: p,
            disabled: f.disable} );
           continue;
          }

           if (f.combo) {
          let pk = null;
          if (f.valueNew !== null && f.valueNew !== undefined && f.valueNew !== '' ) {
            // tslint:disable-next-line:radix
            pk = parseInt(f.valueNew);

           } else if (f.value !== null && f.value !== undefined && f.value !== '') {
            // tslint:disable-next-line:radix
            pk = parseInt(f.value);
           }
           if (pk ) {
             let encontrado = false;
            for (const optionCombo of f.comboDTO.comboBoxDTO) {
               if (pk === optionCombo.id) {
                fieldsCtrls[f.name] = new FormControl({value: optionCombo.id ,
                  disabled: f.disable} );
                  encontrado = true;
                  break;
                }
            }
            if (!encontrado) {
              fieldsCtrls[f.name] = new FormControl({value: '',
              disabled: f.disable} );

            }

           } else {
             if (f.comboDTO.posicionCombo) {
               let i = 0;
                for (const optionCombo of f.comboDTO.comboBoxDTO) {
                  if ( i === f.comboDTO.posicionCombo) {
                    fieldsCtrls[f.name] = new FormControl({value: optionCombo.id ,
                      disabled: f.disable} );
                            break;
                  }
                  i++;
               }
             } else {
              fieldsCtrls[f.name] = new FormControl({value: f.value || '',
              disabled: f.disable} );
             }
           }
          continue;
         }
         if (f.valueNew &&  f.valueNew !== '') {
          fieldsCtrls[f.name] = new FormControl({value: f.valueNew || '',
          disabled: f.disable} );
         } else {
          fieldsCtrls[f.name] = new FormControl({value: f.value || '',
          disabled: f.disable} );
         }
      }
    }
}
console.log('los controles son');
console.log(fieldsCtrls);


}
private createValidators(data: FormdataReportdef[], form: FormGroup) {
  for (const f of data) {

    if (f.buttom || f.check || (f.global && f.value !== null )) {
      continue;
    }
    // console.log(f);
    // console.log(form.controls[f.name]);
    if (f.require && f.busquedaGenerica && !f.autocomplete && !f.combo ) {
        form.controls[f.nameRes].setValidators([Validators.required]);
    } else if (f.require && !f.entero) {
      form.controls[f.name].setValidators([Validators.required]);
    } else if (f.entero && !f.require) {
      form.controls[f.name].setValidators([Validators.pattern(/^-?(0|[1-9]\d*)?$/)]);
    } else if (f.require && f.entero ) {
      form.controls[f.name].setValidators([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]);
    } else if (f.autocomplete) {
      form.controls[f.name].setValidators([Validators.required]);
    }

}
}
actualizarDesdeGlobales(data: FormdataReportdef[]) {
  const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
  console.log('datos globales');
  console.log(formdataGlobales);
  for (const f of data) {
    if (f.noEsPisadoGlobal) {
      continue;
    }
    for (const global of formdataGlobales) {
        if (f.name === global.name && global.valueNew !== null ) {
          f.value = global.valueNew;
          f.global = true;
          f.valueNew = global.valueNew;
          if (f.entity) {
            f.busquedaGenericaDTO.mostrarToStringLupa = global.busquedaGenericaDTO.mostrarToStringLupa;
          }
          break;
        }

    }
  }
}
processMethodDina(event: MetodoDTO) {
if (event.preMethodDTO !== null && event.preMethodDTO.metodo !== null ) {
  const list = [] as FormdataReportdef[];
  const p = {} as ParamRequestDTO;
  p.nombre = event.retasigparam;
  consultarParametroByParam(p, this.reportdefService).
  then( async (resp) => {
      resp.valueNew = event.id;
      event.accionParam = resp;
      list.push(resp);
      await this.ejecutarPremethod(event.preMethodDTO, list);
      this.accionesDina.emit(event);
      }).catch( error =>  this.checkError(error));



} else {

  const p = {} as ParamRequestDTO;
  p.nombre = event.retasigparam;
  consultarParametroByParam(p, this.reportdefService).
  then( async (resp) => {
    resp.valueNew = event.id;
    event.accionParam = resp;
    this.accionesDina.emit(event);
  }).catch( error =>  this.checkError(error));

}

}

 ejecutarPremethod(premethod: PreMethodDTO, listDestination: FormdataReportdef[]) {
  return new Promise<void>(resolve => {
    const list = [];
    for (const p of premethod.params) {
      for (const p1 of listDestination) {
        if (p1.name === p) {
            list.push(p1);
        }
      }
    }
    ejecutarMetodo(premethod.metodo, false, list, this.reportdefService).then(
      (resp) =>
      resolve()
   ).catch( error => {
       this.checkError(error);
        return;
      }
     );
  });
}

processActions(event: FormdataReportdef, hijo: boolean) {
   // debo preguntar si es un boton volver
 // obtengo la lista de valores del form
 // console.log('tipo metodo');
 // console.log(event.buttomDTO.metodoDTO.tipoMetodo);
 if (event.buttomDTO.bottonVolverHistorico) {
  this.backHistory.emit(event);
  return;
}

 if (event.buttomDTO.guardarYvolver) {
    event.buttomDTO.metodoDTO.buttonVolverYguardar = true;
 }
 if (event.buttomDTO.bottonVolver && !hijo) {
  this.backHistory.emit(event);
  return;

} else if (event.buttomDTO.bottonVolver && hijo) {
  this.tieneHijos.alta = false;
  this.tieneHijos.tabular = true;

  if (this.dataHijos && this.dataHijos.etiqueta ) {
    this.reporteHijos = this.dataHijos.etiqueta;
   }

  return;
}

if (event.buttomDTO.metodoDTO.mensajeAntesAccion) {
  this.confirmationDialogService.confirm(true, 'Atencion!',
  event.buttomDTO.metodoDTO.mensajeAntesAccion)
  .then((confirmed) => {
  if (confirmed) {
    this.continuarEjecucionForm(hijo, event);
  }

  }).catch(() => console.log('salio)'));

} else {
  this.continuarEjecucionForm(hijo, event);
}


}

private continuarEjecucionForm(hijo: boolean, event: FormdataReportdef) {
  let seguir = false;
  if (hijo) {
    seguir = this.chequeaCamposForm(this.formRepordefHijos.list, this.formHijo, true );
  } else {
    seguir = this.chequeaCamposForm(this.data.list, this.form, false );
  }
  if (!seguir) {
    return;
  }
  const u = JSON.parse(localStorage.getItem('currentUser'));

  if(this.data.givePasswordToSave && (u.certificadoDto && u.certificadoDto.certificado )){
    this.firma = true;
    this.hijoAux = hijo;
    this.formRepordefAux = event;
  }else{
    this.continuaProcess(hijo,event);
  }
}

firmar(){
  //debo firmar el documento

  this.continuaProcess(this.hijoAux,this.formRepordefAux);

}
cancelarFirma(){
  this.continuaProcess(this.hijoAux,this.formRepordefAux);
}
continuaProcess(hijo: boolean, event: FormdataReportdef){

  if (hijo) {
    this.doAction(this.formRepordefHijos, this.formHijo);
    let alta = false;
    if (event.buttomDTO.metodoDTO.tipoMetodo.toUpperCase() === FrontEndConstants.PERSISTIR_ENTIDAD.toUpperCase()) {
       alta = true;
    }
    this.persistirmodificarEntidad(alta);
    return;
  } else {
    this.doAction(this.data, this.form);
  }

  if (event.buttomDTO.metodoDTO.tipoMetodo.toUpperCase() === FrontEndConstants.ACCION_MENSAJE.toUpperCase()) {
    // crear el objeto
    const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
    const u = JSON.parse(localStorage.getItem('currentUser'));

    const listParam = [];
    for (const clave of Object.keys(event.buttomDTO.metodoDTO.paramsPasar)) {
      // busco si tiene un parametro en el historico

      for (const g of formdataGlobales) {

        if (g.name === clave) {
          listParam.push(g);
        }

      }
    }

      ejecutarMetodo(event.buttomDTO.metodoDTO.methodName, false, listParam, this.reportdefService)
      .then((resp) => {
          this.urlResponse = resp.valor;
          document.getElementById('openModalButton').click();
          return;
        }
        ).catch( error =>
          console.log('error')
        );
    }


  if (event.buttomDTO.metodoDTO.tipoMetodo.toUpperCase() === FrontEndConstants.CASOUSO.toUpperCase()) {
      // crear el objeto
   }
   if (event.buttomDTO.metodoDTO.tipoMetodo.toUpperCase() === FrontEndConstants.LLAMAR_URL_EXTERNA.toUpperCase()) {
    const u = JSON.parse(localStorage.getItem('currentUser'));

      this.router.navigate(['/externalUrlMaps', {data: '/SFSFrameworkRest/maps/mapa.jsp' ,
      datasource: u.datasource,
         username: u.username, mapa: event.buttomDTO.metodoDTO.methodName}]);
//    this.router.navigate(['/externalRedirect', { externalUrl: event.buttomDTO.metodoDTO.methodName }], {
 //     skipLocationChange: true,
 // });

    return;
   }

  if (event.buttomDTO.metodoDTO.tipoMetodo.toUpperCase() === FrontEndConstants.MAPS.toUpperCase()) {

        console.log('METODO MAPAS');
        let latitud = null;
        let longitud = null;
        let user = null;
        let info = null;

    if (event.buttomDTO.metodoDTO.paramsPasar) {
      console.log('************PARAMETROS***************');
      console.log( this.data.list);
      console.log(JSON.stringify(this.data.list));

      for (const clave of Object.keys(event.buttomDTO.metodoDTO.paramsPasar)) {
        // busco si tiene un parametro en el historico
        console.log('************PARAM***************');
        console.log(clave);
        if (clave === null || clave === undefined) {
          continue;
        }
        if (clave === 'P_IDUSUARIO') {
            const u = JSON.parse(localStorage.getItem('currentUser'));
            user = u.username;
            console.log('value');
            console.log(user);
          }
          if (clave === 'P_LONGDEST') {
            for (const f of this.data.list ) {
                if (f.name === clave) {
                  longitud = f.valueNew;
                  break;
                }
            }
            console.log('value');
            console.log(longitud);
          }
          if (clave === 'P_LATIDEST') {
            for (const f of this.data.list ) {
              if (f.name === clave) {
                latitud = f.valueNew;
                break;
              }
          }
          console.log('value');
          console.log(latitud);

        }
          if (clave === 'P_DEST') {
            for (const f of this.data.list ) {
              if (f.name === clave) {
                info = f.valueNew;
                break;
              }
          }
          console.log('value');
          console.log(info);

          }
  }
  console.log(user);
  console.log(latitud);
  console.log(longitud);
  console.log(info);
  mapa(user, latitud, longitud, info);
    }
    return;
  }

  // seteo de parametros globales no ejecuta ninguna accion solo actualiza los parametros globales
  if (event.buttomDTO.metodoDTO.tipoMetodo.toUpperCase() === FrontEndConstants.SET_PARAM_GLOBAL.toUpperCase()) {

    // ejecuto el metodo que me trae
    seteoParamGlobal(event.buttomDTO.metodoDTO, this.reportdefService, this.nameService, this.data, false, null).then(
      (resp) =>
      this.exitoSetParamGlobal()
    ).catch( error =>
      this.checkError(error)
      );

    return;
  }
  if (event.buttomDTO.metodoDTO.tipoMetodo.toUpperCase() === FrontEndConstants.SETEXTERNALPARAMGLOBAL) {
    this.acciones.emit(event.buttomDTO.metodoDTO);
    return;
  }
  if (this.abmParams && this.abmParams.tieneHijos && event.buttomDTO.metodoDTO.tipoMetodo.toUpperCase() ===
  FrontEndConstants.PERSISTIR_ENTIDAD.toUpperCase()) {
    event.buttomDTO.metodoDTO.tipoMetodo = FrontEndConstants.MODIFICAR_ENTIDAD;
  }
  if (this.tipoReporte.formAbmNew && event.buttomDTO.metodoDTO.tipoMetodo.toUpperCase() !==
  FrontEndConstants.PERSISTIR_ENTIDAD.toUpperCase()) {
    this.toastrService.error('No puede ejecutar la accion hasta tanto persista la entidad');
    return;
  }
  if ( event.buttomDTO.metodoDTO.validaTabularFromForm && event.buttomDTO.metodoDTO.metodoValidaForm !== null) {
    // en realidad valida cualquier cosa antes de llamar, tambien puede ser un metodo u otro tipo de reportdef
    const dataMetodo = {} as ParametrosExecuteMethodRequestDTO;
    // tslint:disable-next-line:prefer-const
    dataMetodo.list = this.data.list;
    dataMetodo.pdf = false;
    dataMetodo.metodo = event.buttomDTO.metodoDTO.metodoValidaForm;
    const user = JSON.parse(localStorage.getItem('currentUser'));

    this.reportdefService.validateForm(user, dataMetodo).subscribe
    (result => {
      console.log(result);
      this.acciones.emit(event.buttomDTO.metodoDTO);
    },
     (err: HttpErrorResponse) => {
       this.checkError(err);
  });
  } else {

    for (const f of this.data.list ) {
      if (f.fechaCustom) {
        if (f.fechaCustomDTO.idSeleccionado === null) {
          this.toastrService.error('debe seleccionar un turno disponible');
          return;
        }
        break;
      }
    }


    this.acciones.emit(event.buttomDTO.metodoDTO);
  }

}


exitoSetParamGlobal() {

  this.toastrService.success('parametro global seteado exitosamente');
}
private chequeaCamposForm(data: FormdataReportdef[], form: FormGroup, hijo: boolean) {
  // limpio los errores
this.mensajeErrorHijo = [];
this.mensajeErrorPadre = [];

let value = null;
for (const f of data) {
  if (f.buttom) {
    continue;
  }
  if (f.upload || f.uploadImpresion || f.cards) {
    continue;
  }
  if (f.busquedaGenerica && f.global && f.valueNew != null) {
    continue;
  }
     if (f.require) {
       if (f.busquedaGenerica && !f.combo) {
        value = form.get(f.nameRes).value;
         if (this.checkNullvalue(value)) {
          const mensaje = 'el campo ' + f.label + ' es obligatorio';
          if (hijo) {
              this.mensajeErrorHijo.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
            } else {
              this.mensajeErrorPadre.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
            }
         }
       } else {
         value = form.get(f.name).value;
         if (f.combo) {
           if (value === null || value === undefined || value.trim === '') {
            const mensaje = 'el campo ' + f.label + ' es obligatorio';
            if (hijo) {
                this.mensajeErrorHijo.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
              } else {
                this.mensajeErrorPadre.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
              }
           }
           continue;
         }
         if (f.radio) {
          if (this.checkNullvalue(value)) {
            const mensaje = 'el campo ' + f.label + ' es obligatorio';
            if (hijo) {
                this.mensajeErrorHijo.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
              } else {
                this.mensajeErrorPadre.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
              }
           }

          continue;
         }
          if (f.autocomplete) {
          if (value === null || value === undefined) {
            const mensaje = 'el campo ' + f.label + ' es obligatorio';
            if (hijo) {
                this.mensajeErrorHijo.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
              } else {
                this.mensajeErrorPadre.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
              }
           }

          continue;
         }
         if (f.fecha) {
          if (value === null || value === undefined) {
           const mensaje = 'el campo ' + f.label + ' es obligatorio';
           if (hijo) {
               this.mensajeErrorHijo.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
             } else {
               this.mensajeErrorPadre.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
             }
          }
          continue;
        }
        if (f.fechaHora) {
          if (value === null || value === undefined) {
           const mensaje = 'el campo ' + f.label + ' es obligatorio';
           if (hijo) {
               this.mensajeErrorHijo.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
             } else {
               this.mensajeErrorPadre.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
             }
          }
          continue;
        }

        if (this.checkNullvalue(value)) {
          const mensaje = 'el campo ' + f.label + ' es obligatorio';
          if (hijo) {
              this.mensajeErrorHijo.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
            } else {
              this.mensajeErrorPadre.push({severity: 'error', summary: 'Campo No completado', detail : mensaje });
            }
       }
     }

  }
   value = form.get(f.name).value;

  if ((f.entero || f.decimal) && !f.disable && (!this.checkNullvalue(value))) {

    if (!isNumber(value)) {
      const mensaje = 'el campo ' + f.label + ' es numerico';
      if (hijo) {
        this.mensajeErrorHijo.push({severity: 'error', summary: 'error de formato numerico', detail : mensaje });
      } else {
        this.mensajeErrorPadre.push({severity: 'error', summary: 'error de formato numerico', detail : mensaje });
      }

    }
  }
if (f.fecha) {
    if (value) {

        if (value instanceof NgbDate) {
          const date: NgbDate = value;
          const fechaString = date.day + '-' + date.month + '-' + date.year;
          const now = moment(fechaString, 'DD-MM-YYYY');
          if (!now.isValid) {
            const mensaje = 'el campo ' + f.label + ' es de tipo fecha';
            if (hijo) {
              this.mensajeErrorHijo.push({severity: 'error', summary: 'error de formato de fecha', detail : mensaje });
            } else {
              this.mensajeErrorPadre.push({severity: 'error', summary: 'error de formato de fecha', detail : mensaje });
            }

           }

        } else {
          let now = null;
          if (value.year && value.month && value.day) {
            const fechaString = value.day + '-' + value.month + '-' + value.year;
            now = moment(fechaString, 'DD-MM-YYYY');

         } else {
            now = moment(value, 'DD-MM-YYYY');

         }
          if (!now.isValid()) {
            const mensaje = 'el campo ' + f.label + ' es de tipo fecha';
            if (hijo) {
              this.mensajeErrorHijo.push({severity: 'error', summary: 'formato de fecha incorrecta', detail : mensaje });
            } else {
              this.mensajeErrorPadre.push({severity: 'error', summary: 'formato de fecha incorrecta', detail : mensaje });
            }

         }

      }
      }

  }
  if (f.fechaHora) {
    if (value) {
      const now = moment(value);
      if ( !now.isValid) {
        const mensaje = 'el campo ' + f.label + ' es de tipo fecha';
        if (hijo) {
          this.mensajeErrorHijo.push({severity: 'error', summary: 'formato de fecha incorrecta', detail : mensaje });
        } else {
          this.mensajeErrorPadre.push({severity: 'error', summary: 'formato de fecha incorrecta', detail : mensaje });
        }

      }

    }
  }
}
this.ubicaListaSelectaFicha(this.data.fieldsTab, this.data.list);

if (this.mensajeErrorPadre.length > 0 || this.mensajeErrorHijo.length > 0 ) {
    return false;
}
return true;
}

ubicaListaSelectaFicha (arr1: any, arr2: any) {

  const resultadoIndice  = [];
  const resultado  = [];
  let iniaumlativo = 0;
  let finaumlativo = 0;
  const elFormes = this.form;

  if ((arr1 !== null && arr1 !== undefined && arr1 !== '') && (arr1 !== null && arr1 !== undefined && arr1 !== '')) {
  for (let i = 0; i < arr1.length; i++) {

        const elnamei = arr1[i]['name'];

        let lentca = 0;
        let elini  = 0;

        if (i <= 0 ) {
          lentca = arr1[i]['list'].length;
          elini  = lentca * i;
          } else {
          // tslint:disable-next-line:radix
          const oidol = i - parseInt('1');
          lentca = arr1[i]['list'].length;
          elini  = arr1[oidol]['list'].length;
        }
        iniaumlativo += elini;
        finaumlativo = iniaumlativo + lentca;

        let ixp  = 0;

        for (let j = iniaumlativo; j < finaumlativo; j++) {

          const elvalue = arr2[j]['value'];
          const elnameaca = arr2[j]['name'];
          const elnamacoe = elFormes.value[elnameaca];
          const elvalueNew = arr2[j]['valueNew'];
          const elRequerido = arr2[j]['require'];

          if ( (elvalue === null && elvalueNew === null && elRequerido === true && elnamacoe === null)
          || (elvalue === null && elvalueNew === null && elRequerido === true && elnamacoe === '')) {
            ixp++;
          }
        }

        if (ixp > 0) {
          resultado.push(elnamei);
          resultadoIndice.push(1);
      } else {
        resultadoIndice.push(0);
      }

    }
        const priArIn = resultadoIndice;

        for (let index = 0; index < priArIn.length; index++) {
          const elemento = priArIn[index];
          if (elemento === 1) {
            document.querySelectorAll('ul.ui-tabview-nav li')[index].classList.add('sclamari');
          } else {
            document.querySelectorAll('ul.ui-tabview-nav li')[index].classList.remove('sclamari');
          }
        }
  } else {
    return;
  }
}



private checkNullvalue(value: any) {
  // console.log('este es el valor del campo');
  if (value === null || value === undefined || (value instanceof String && value.trim() === '') || (value.trim() === '')) {
      return true;
  }
  return false;
}
private cargarHijos(idPadre: number, clasePadre: string, reporteHijo: string) {
  const data = {} as ConsultarHijosDTO;
  data.clasePadre = clasePadre;
  data.idPadre = idPadre;
  data.reporte = reporteHijo;
  const user = JSON.parse(localStorage.getItem('currentUser'));
  this.reportdefService.consultarHijos(user, data).subscribe
  ((m: Tabular) => {
    this.getData(m.data, m.columns);
    this.tieneHijos.alta = false;
    this.tieneHijos.tabular = true;

    if (this.dataHijos && this.dataHijos.etiqueta ) {
      this.reporteHijos = this.dataHijos.etiqueta;
     }

    return;

  },
   (err: HttpErrorResponse) => {
     this.checkError(err);
});

}

// LEO
pintarClaseDivBuil(valor: number) {
  let result = 1;
  result = valor;
  // result = 12/valor;
  let cadenaClase = '';
  Number.isNaN(result) ? cadenaClase = 'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-4 cl-de-ancho-chi-mov-form' :
  cadenaClase = 'col-xs-12 col-sm-12 col-md-' + result + ' col-lg-' + result + ' col-xl-' + result + ' mb-4 cl-de-ancho-chi-mov-form';
  return cadenaClase;
}

pintarClaseDivFehaBuil(valor: number) {
      let result  = 1;
      result = valor;
      let cadenaClase = '';
      // cadenaClase = 'col-xs-12 col-sm-12 col-md-4 col-lg-2 col-xl-2 mb-4 cl-de-ancho-chi-mov-form';
      cadenaClase = 'col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-4 cl-de-ancho-chi-mov-form';
      return cadenaClase;
}

private doAction( data: any, form: FormGroup ) {
    for (const f of data.list) {
      if ((f.busquedaGenerica || f.buttom || f.upload || f.cards || f.uploadImpresion || f.autocomplete) && !f.combo) {
      continue;
    }
    if (f.fecha) {
        if (form.get(f.name).value) {
          const value = form.get(f.name).value;
          if (value instanceof NgbDate) {
            const date: NgbDate = value;
            const fechaString = date.day + '-' + date.month + '-' + date.year;
            const now = moment(fechaString, 'DD-MM-YYYY');
            if (now.isValid) {
              f.valueNew = now.format('DD-MM-YYYY');
            }
          } else {
            let now = null;
            if (value.year && value.month && value.day) {
              const fechaString = value.day + '-' + value.month + '-' + value.year;
              now = moment(fechaString, 'DD-MM-YYYY');
              f.valueNew = now.format('DD-MM-YYYY');
           } else {
              now = moment(value, 'DD-MM-YYYY');
              f.valueNew = now.format('DD-MM-YYYY');
           }


        }
    } else {
      f.valueNew = null;
    }
    } else if (f.check) {
      // 0 o 1 tengo que ver sin es false o true;
          if (form.get(f.name).value === null || form.get(f.name).value === undefined ||  form.get(f.name).value === '') {
            f.valueNew = false;
          } else {
            f.valueNew = form.get(f.name).value;
          }
        } else if (f.combo) {
          f.valueNew = form.get(f.name).value;
        } else if (f.radio) {
          f.valueNew = form.get(f.name).value;
        } else {
          f.valueNew = form.get(f.name).value;
    }
  }
}
private persistirmodificarEntidad(alta: boolean) {
  console.log('estoy por pesistir');
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const data = {} as PersistirEntidadRequest;
  data.nueva = alta;
  data.vista = this.dataHijos.vista;
  if (!alta) {
    data.valorPK = this.tieneHijos.id;
  }
  let  parametros = [] as FormdataReportdef[];
  data.Entidad = user['packageModel'] + '.' + this.abmParams.entidadHijo;
  parametros = this.formRepordefHijos.list.concat();
  data.camposPersistirDTO = parametros;
  const pk = {} as FormdataReportdef;
  pk.name = 'P_ID';
  pk.valueNew = this.abmParams.idPadre;
  pk.busquedaGenerica = true;
  pk.entity = true;
  pk.type = user['packageModel'] + '.' + this.abmParams.entidadPadre;
  pk.attribute = this.abmParams.atributo;
  data.camposPersistirDTO.push(pk);
  const u = JSON.parse(localStorage.getItem('currentUser'));

  if(this.firma && (u.certificadoDto && u.certificadoDto.certificado ) && this.password.trim()!==''){
    data.certificado =u.certificadoDto.certificado;
    data.passCert = this.password;
  } 

  this.reportdefService.persistirModificarEntidad(user, data).subscribe
  (result => {
    if (result.mensajeLogica) {
      this.toastrService.success(result.mensajeLogica);
    } else {
      this.toastrService.success('Entidad persistida');
    }
    // vuelvo al historico
    this.cargarHijos(this.abmParams.idPadre, this.abmParams.entidadPadre, this.abmParams.childreportname);
    if (alta && this.postPersist) {
     this.ejecutaPostPersist(this.postPersist, result);
    } else if (!alta && this.postUpdate) {
      this.ejecutaPostPersist(this.postUpdate, result);

    }
  },
   (err: HttpErrorResponse) => {
     this.checkError(err);
});


}

ejecutaPostPersist(methodo: string, response: PersistirEntidadResponse ) {

  // por ahora solo un solo parametro THIS que seria el id del renglon
  // muestra una modal con el texto devuelto

  const pos = methodo.indexOf('(');
  const metodo = methodo.substring(0, pos );
  const listAux = [];
  const param = crearParametro('P_ID', FrontEndConstants.JAVA_LANG_LONG, response.idClasePersistida);
  listAux.push(param);

  ejecutarMetodo(metodo, false, listAux, this.reportdefService).then(
    (resp) => {
      this.mensajes.visible = true;
    this.mensajes.detalle = resp.valor;
    console.log('this.mensajes');
    console.log(this.mensajes);
}).catch( error =>
   this.checkError(error)
   );

}
onEditHijo(event) {
  const pos = this.dataHijos.pkColIndex;
  let i = 0;
  let id = 0;
// tslint:disable-next-line:forin
  for (const prop in event.data) {
    if ( i === pos) {
      id = event.data[prop];
      break;
    }
    i++;
  }

  this.editarABMHijos(false, id);
  // this.editaABM.emit(data);
}

onDeleteHijo(event) {
      const user = JSON.parse(localStorage.getItem('currentUser'));

    const pos = this.dataHijos.pkColIndex;
    let i = 0;
    let id = 0;
    // tslint:disable-next-line:forin
    for (const prop in event.data) {
        if ( i === pos) {
        id = event.data[prop];
        break;
        }
        i++;
    }

  this.confirmationDialogService.confirm(true, 'Esta seguro de eliminar este registro?',
  'Eliminacion Registro')
.then((confirmed) => {
 if (confirmed) {
   this.abmservice.eliminarEntidad(user, this.abmParams.childreportname, id, null, false, false, null, null).subscribe(
     result => {
      this.toastrService.success('registro eliminado exitosamente');
      this.cargarHijos(this.abmParams.idPadre, this.abmParams.entidadPadre, this.abmParams.childreportname);
     }, (err: HttpErrorResponse) => {
      this.checkError(err);
     }
   );
 }

}).catch(() => console.log('salio)'));
}
private checkError(error: any ) {
  this.toastrService.error(error.mensaje);
}
onRowSelectHijo(event) {
  // determino a que columna le hago click esto sirve para cuando hgacemos nuevo muestre los datos de la fila
  const pos = this.dataHijos.pkColIndex;
     let i = 0;
    // tslint:disable-next-line:forin
    for (const prop in event.data) {
     if ( i === pos) {
        this.idSeleccionado = event.data[prop];
       break;
     }

     i++;
   }
 }

 editarABMHijos(alta: boolean, id: number) {
  const abmEdit = {} as AltaEdicionABMDTO;
   abmEdit.alta = alta;
     const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
    abmEdit.global = formdataGlobales;
  abmEdit.id = id;
  abmEdit.reportName = this.abmParams.childreportname;
  abmEdit.viewName = this.dataHijos.vista;
  const user = JSON.parse(localStorage.getItem('currentUser'));

  this.reportdefService.getNewEditAbm(user, abmEdit).subscribe
  ((m: ContainerAbmNuevoDTO) => {
    if (this.formRepordefHijos === undefined || this.formRepordefHijos === null) {
      this.formRepordefHijos = {} as FormReportdef;
    }
    this.postUpdate = m.postUpdate;
    this.postPersist = m.postPersist;
    this.tieneHijos.tabular = false;
    this.formRepordefHijos.list = m.list;
    this.formRepordefHijos.list.concat( m.listBotones);
      if (m.tituloForm) {
      this.reporteHijos = (abmEdit.alta ? 'Alta: ' : 'Edición: ') + m.tituloForm;
    } else {
      this.reporteHijos = (abmEdit.alta ? 'Alta: ' : 'Edición: ' ) + this.reporte;
    }
    // aca lo que hay que hacer es traer los formdata globales
    const fieldsCtrls = {};

    this.createFormAngular(fieldsCtrls, this.formRepordefHijos.list);
    this.formHijo = new FormGroup(fieldsCtrls);
    this.createValidators(this.formRepordefHijos.list, this.formHijo);

     this.tieneHijos.alta = false;
     this.tieneHijos.id = id;
       },
    (err: HttpErrorResponse) => {
      this.checkError(err);
});



}
verificarPassword(){
  return this.password.trim() === '';
}
private getData(datos: any, columns: HeaderDTO[]) {
  const d = [];
  let post = {};
  this.dataTabular = [];
  // console.log('datos length ' + datos.length);
  // console.log('columnas length ' + columns.length);
  for (let i = 0; i < datos.length; i++) {
    for (let j = 0; j < columns.length; j++) {
      post[columns[j].name] = datos[i][j].value;
    }
    // console.log('post' + JSON.stringify(post));
    d.push(post);
    post = {};
  }
   this.dataTabular = d;
  }
  backHistorico() {
    this.backHistory.emit(event);
    this.appSettings.settings.theme.loadscreen=false;
  }

  verFiltros() {
    this.filtros = true;
}

}
