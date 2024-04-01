import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getData } from '../pages/genericFinder/utilFinder';
import * as moment from 'moment';
import { toInteger } from '../util/datePicker/util';
import { ReportdefService } from '../_services/reportdef.service';
import { ObtenerMetodoRequestDto } from '../_models/obtenerMetodoRequestDto';
import { MetodoDTO } from '../_models/metodoDTO';
import { ParamRequestDTO } from '../_models/paramRequestDTO';
import { Observable, map, pipe } from 'rxjs';
import { FormdataReportdef } from '../_models/formdata';


@Component({
    selector: 'app-fechacustom',
    templateUrl: './fechaCustom.html',
    styleUrls: ['./fechaCustom.scss'],

})

export class FechaCustomComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Input() elindex: any;
    @Output()acciones = new EventEmitter<any>();

    en: any;
    invalidDates: Array<Date>;
    settings: any;
    data: any;
    dataFecha: any;
    filaCel: any;
    turnoSeleccionado: string;
    fechaCel: string;

    constructor(private reportdefService:ReportdefService) {

    }
      // tslint:disable-next-line:use-life-cycle-interface
      ngOnInit() {
        console.log('me he inicializado');
        this.en = {
            firstDayOfWeek: 0,
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            monthNames: [ 'Enero', 'Febrero', 'Marzo',
            'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
            monthNamesShort: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
            today: 'Hoy',
            clear: 'Limpiar'
        };
        this.fechaCel = '';
        const f = JSON.parse(localStorage.getItem('fechaCustom'));
          if (f) {
            const f1 = moment(f, 'DD-MM-YYYY');
            this.setearCalendar(f1);
          } else {
            this.setearCalendar(null);
          }
          if (this.field.fechaCustomDTO.dataTableDTO.data.length > 0) {
            this.pintarDiasSel();
          }
    }
    setearAccion(rowdata:any, columna:any){
      //let listado = [];[
        const user = JSON.parse(localStorage.getItem('currentUser'));
      let id =    rowdata[columna.valueHeaderAccion];  
      let accion = rowdata[columna.headerAccion];  
      let paramAccion = columna.paramHeaderAccion;  
      let request = {} as ObtenerMetodoRequestDto;
      request.etiqueta=accion;
      this.reportdefService.getMethodByEtiqueta(user,request).subscribe({
        next: (value:MetodoDTO)=>{

          this.obtenerParam(paramAccion,user).subscribe({
            next:(p:FormdataReportdef)=>{
              const listNew: FormdataReportdef[] = [];
              p.valueNew = id;
              listNew.push(p);
              value.objetoEvento=listNew;
              this.acciones.emit(value);

            }
          })


        },error: error=>{

        }
    })
      //this.acciones.emit(accion);
    }
      obtenerParam(param:string,user:any):Observable<FormdataReportdef>{
        let p = {}as ParamRequestDTO;
        p.nombre=param;
     return  this.reportdefService.consultarParamByName(user,p);
    }
    changeMonth(event) {
        console.log(event);
        const p = '01-' + (event.month < 10 ? '0' + event.month : event.month) + '-' +  event.year;
        const fecha = moment(p, 'DD-MM-YYYY');
        this.setearCalendar(fecha);
        this.setearprimerDiaMes(fecha);
        this.filaCel = null;
    }

    doAction(event) {
      //alert('Action');
    }

    select(event) {
        const fecha = moment(event);
        const f = fecha.format('DD-MM-YYYY');
        localStorage.setItem('fechaCustom', JSON.stringify(f));
        this.setearCalendar(fecha);
    }
    onRowSelect(event) {
        console.log(event);
        this.filaCel = event.data;
        this.turnoSeleccionado = ' ';
        // tslint:disable-next-line:forin
        for (const key in this.filaCel) {
            if(key ==='ID'){
              this.field.fechaCustomDTO.idSeleccionado = this.filaCel[key];
            }
            this.turnoSeleccionado += ' ' + key + ' ' + this.filaCel[key];
        }
        this.turnoSeleccionado = 'ha seleccionado el turno el dia:' +  this.turnoSeleccionado;
    }

    private setearprimerDiaMes(fecha: any) {
      this.invalidDates = [];
      // fecha es de tipo moment
      const fStart = moment();
      const fEnd = moment();
      if (fecha === null || fecha === undefined ) {
        fecha =  moment();
      }
      fStart.set('year', fecha.get('year'));
      fStart.set('month', fecha.get('month'));
      fEnd.set('year', fecha.get('year'));
      fEnd.set('month', fecha.get('month'));
      fStart.startOf('month');
      fEnd.endOf('month');
      let j = toInteger(fEnd.format('DD'));
        j++;
      for (let i = 1; i < j; i ++ ) {
        const f = fStart.format('DD-MM-YYYY');
        const dataAux = this.field.fechaCustomDTO.dataTableDTO.data.filter(item => item[0].value === f);
        if (dataAux.length === 0) {
          this.invalidDates.push(fStart.toDate());
        }
        fStart.add(1, 'days');
      }
      this.field.fechaCustomDTO.idSeleccionado = null;
      if (this.field.fechaCustomDTO.dataTableDTO.data.length > 0) {

          this.pintarDiasSel();
      }

    }

    private setearCalendar(fechaPass: any) {
     // this.getSettings(this.field.fechaCustomDTO.dataTableDTO.columns);
      console.log(this.field.fechaCustomDTO.dataTableDTO.data);
       this.dataFecha = [];
      let f = null;
      let fecha = null;
      if (this.field.fechaCustomDTO.dataTableDTO.data.length > 0) {
        // me ubico en la primer fecha disponible
        if (fechaPass) {
          fecha = fechaPass;
          f = fecha.format('DD-MM-YYYY');
        } else {
          f = this.field.fechaCustomDTO.dataTableDTO.data[0][0].value;
          console.log(f);
          fecha = moment(f, 'DD-MM-YYYY'); // add this 2 of 4
        }
        this.form.get(this.field.name).setValue(fecha.toDate());
        this.dataFecha = this.field.fechaCustomDTO.dataTableDTO.data.filter(item => item[0].value === f);
        this.data = getData(this.dataFecha, this.field.fechaCustomDTO.dataTableDTO.columns);
        this.setearprimerDiaMes(fecha);
        this.field.fechaCustomDTO.idSeleccionado = null;
        this.pintarDiasSel();
        this.fechaCel = f;
      } else {
        fecha = moment(this.field.fechaCustomDTO.fechaDesde, 'DD-MM-YYYY'); // add this 2 of 4
        this.form.get(this.field.name).setValue(fecha.toDate());
        this.setearprimerDiaMes(fecha);
      }
    }
   

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
      if (this.field.fechaCustomDTO.dataTableDTO.data.length > 0) {

        this.pintarDiasSel();
      }
      }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewChecked() {
      if (this.field.fechaCustomDTO.dataTableDTO.data.length > 0) {

      this.pintarDiasSel();
    }
  }

    pintarDiasSel() {

      const elementos = document.querySelectorAll('.p-datepicker-calendar-container span');
      const canti = elementos.length;

      for (let i = 0; i < canti; i ++) {
           if (elementos[i].hasAttribute('draggable') && elementos[i].classList.contains('p-ripple') &&
            !elementos[i].classList.contains('p-disabled')) {
            const elemo = <HTMLElement>elementos[i];
            elemo.style.backgroundColor = '#7ec481';
           }
        }
    }
 
    



}
