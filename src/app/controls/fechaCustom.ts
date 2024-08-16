import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getData } from '../pages/genericFinder/utilFinder';
import * as moment from 'moment';
import { toInteger } from '../util/datePicker/util';
import { ReportdefService } from '../_services/reportdef.service';
import { ObtenerMetodoRequestDto } from '../_models/obtenerMetodoRequestDto';
import { MetodoDTO } from '../_models/metodoDTO';
import { ParamRequestDTO } from '../_models/paramRequestDTO';
import { Observable } from 'rxjs';
import { FormdataReportdef } from '../_models/formdata';
import { ToastrService } from 'ngx-toastr';
import { ParamAllRequestDTO } from '../_models/paramAllRequestDTO';
import { NameParamDTO } from '../_models/nameParamDTO';
import { HttpErrorResponse } from '@angular/common/http';


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
    turnoSeleccionado: any;
    fechaCel: string;
    col: any;
    fecha = null;
    day = null;
    st = false;

    constructor(private reportdefService:ReportdefService,private toastrService: ToastrService) {

    }
      // tslint:disable-next-line:use-life-cycle-interface
      ngOnInit() {
        console.log('me he inicializado');
        this.col = this.field.fechaCustomDTO.dataTableDTO.columns
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
        const fhoy = moment();
        fhoy.startOf("day");
        const fClick = moment(rowdata.Fecha,"DD-MM-YYYY");
        if(fClick.isBefore(fhoy)&& rowdata.Estado === 'NoElegible'){
          this.toastrService.error("Lo sentimos, no puedes seleccionar fechas pasadas. Por favor, selecciona una fecha válida para tu turno ");
          return; 
        }  
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
    executeSt() {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const paramRequest = {} as ParamAllRequestDTO;
      paramRequest.list = [];

    for (const clave of Object.keys(this.field.fechaCustomDTO.metodoStDTO.paramsPasar)) {
      const paramName = {} as NameParamDTO;
      paramName.name = clave;
      paramRequest.list.push(paramName);
    }
    const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
    const duration = this.maxData();
    const cd = duration[1].value.split(":");
    let hour = parseInt(cd[0], 10);
    let minute = parseInt(cd[1], 10);
    this.reportdefService.consultarAllParamByName(user, paramRequest).subscribe(
        result => {
          if (hour!==23 && minute !==59){

            let newDate = moment(duration[0].value, 'DD-MM-YYYY');
            newDate.hour(hour);  
            newDate.minute(minute); 
            newDate = newDate.add(1, 'minute');
            hour = newDate.hour();
            minute = newDate.minute();
          }
      
          for (const f of result) {
            if(f.name ==="P_FECHA"){
              f.valueNew = this.fecha.format("DD-MM-YYYY");  
              continue;
            }
            if(f.name ==="P_HORA_DESDE"){
              f.valueNew = hour;  
              continue;
            }
            if(f.name ==="P_MINUTO_DESDE"){
              f.valueNew = minute;  
              continue;
            }
            if(f.name ==="P_DURACION"){
              f.valueNew = 10;  
              continue;
            }
            for (const p of formdataGlobales ) {
              if (p.name === f.name) {
                f.valueNew = p.valueNew;
                break;
              }
            }
          }
          this.field.fechaCustomDTO.metodoStDTO.objetoEvento = result; 
          this.acciones.emit(this.field.fechaCustomDTO.metodoStDTO);

        }, (err: HttpErrorResponse) => {
          //this.checkError(err);
        });

    }
    maxData(){
      let previousDate = null;
      let dataReturn = null;
      for (const data of this.field.fechaCustomDTO.dataTableDTO.data){
        if(previousDate===null){
          previousDate = data[1].value;
          dataReturn = data;
        }else{
          const pd =  previousDate.split(":");
          const hourAnt = parseInt(pd[0], 10);
          const minuteAnt = parseInt(pd[1], 10);
          const cd = data[1].value.split(":");
          const hourAc = parseInt(cd[0], 10);
          const minuteAc = parseInt(cd[1], 10);
          if (hourAc > hourAnt || (hourAnt === hourAc && minuteAc > minuteAnt)) {
            dataReturn = data;
            previousDate = data[1].value;
          }    
        } 
      }
      return dataReturn; 

    }

    select(event) {
        const fecha = moment(event);
        const f = fecha.format('DD-MM-YYYY');
        localStorage.setItem('fechaCustom', JSON.stringify(f));
        this.setearCalendar(fecha);
    }
    onRowSelect(event) {
        this.filaCel = event.data;
        this.turnoSeleccionado = [];
        
        for (const key in this.filaCel) {
          let colSelected = this.col.filter((c)=> c.name == key)
          let obj = {
            key: key,
            value: this.filaCel[key],
            visible: colSelected[0].visible
          }
          if (obj.value != "" && obj.value !=null) {
            this.turnoSeleccionado.push(obj);
          }
            
        }
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
      console.log(fechaPass);
     // this.getSettings(this.field.fechaCustomDTO.dataTableDTO.columns);
      console.log(this.field.fechaCustomDTO.dataTableDTO.data);
       this.dataFecha = [];
      let f = null;
       this.fecha = null;
      if (this.field.fechaCustomDTO.dataTableDTO.data.length > 0) {
        // me ubico en la primer fecha disponible
        if (fechaPass) {
          this.fecha = fechaPass;
          f = this.fecha.format('DD-MM-YYYY');
        } else {
          f = this.field.fechaCustomDTO.dataTableDTO.data[0][0].value;
          console.log(f);
          this.fecha = moment(f, 'DD-MM-YYYY'); // add this 2 of 4
        }
        moment.locale('es');

        this.day = this.fecha.format('dddd');
        console.log("fecha: " +this.day);

        this.st = this.field.fechaCustomDTO.dataTableStDTO.data.filter(item => item[1].value === this.day).length > 0;

        this.form.get(this.field.name).setValue(this.fecha.toDate());
        this.dataFecha = this.field.fechaCustomDTO.dataTableDTO.data.filter(item => item[0].value === f);
        this.data = getData(this.dataFecha, this.field.fechaCustomDTO.dataTableDTO.columns);
        const fechaActual = moment(); 
        fechaActual.startOf('day');

        this.data.forEach(objeto => {
          if (moment(objeto.Fecha,"DD-MM-YYYY").isBefore(fechaActual) && (objeto.Estado==='Libre' ||objeto.Estado==='NoElegible')) {
            objeto.Estado = "NoElegible";
          }
        });
        this.data.sort(this.compararPorHora);
        this.setearprimerDiaMes(this.fecha);
        this.field.fechaCustomDTO.idSeleccionado = null;
        this.pintarDiasSel();
        this.fechaCel = f;
      } else {
        this.fecha = moment(this.field.fechaCustomDTO.fechaDesde, 'DD-MM-YYYY'); // add this 2 of 4
        this.form.get(this.field.name).setValue(this.fecha.toDate());
        this.setearprimerDiaMes(this.fecha);
      }
    }
   
    private compararPorHora(a, b) {
      const [horaA, minutoA] = a.Hora.split(':');
      const [horaB, minutoB] = b.Hora.split(':');
  
      const horaNumA = parseInt(horaA, 10);
      const minutoNumA = parseInt(minutoA, 10);
      const horaNumB = parseInt(horaB, 10);
      const minutoNumB = parseInt(minutoB, 10);
  
      if (horaNumA === horaNumB) {
          return minutoNumA - minutoNumB;
      } else {
          return horaNumA - horaNumB;
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
      let fechaHoy = moment();
      fechaHoy.startOf('day');
      for (let i = 0; i < canti; i ++) {
           if (elementos[i].hasAttribute('draggable') && elementos[i].classList.contains('p-ripple') &&
            !elementos[i].classList.contains('p-disabled')) {
            const elemo = <HTMLElement>elementos[i];
            let day = parseInt(elemo.firstChild.textContent); 
            const fAlmanaque = moment();
            fAlmanaque.set('year', this.fecha.get('year'));
            fAlmanaque.set('month', this.fecha.get('month'));
            fAlmanaque.set('date', day);
            fAlmanaque.startOf('day');
            if (fechaHoy.isBefore(fAlmanaque)) {
              elemo.style.backgroundColor = '#7ec481';
           }else{
            elemo.style.backgroundColor = '#d1d1d1';
           }
        }
      }
    }
 
    



}
