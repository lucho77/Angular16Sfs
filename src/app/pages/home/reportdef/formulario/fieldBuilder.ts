import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormdataReportdef } from '../../../../_models/formdata';


@Component({
  selector: 'app-field-builder',
  templateUrl: './fieldBuilder.html',
  styleUrls: ['./fieldBuilder.scss'],


})
export class FieldBuilderComponent implements OnInit {
  @Input() field: any;
  @Input() form: any;
  @Input() elindex: any;
  @Output()accionesDina = new EventEmitter<any>();

  @Input() dataForm: FormdataReportdef[];
  loading: boolean;

  constructor() { }

  ngOnInit() {
    this.loading = false;
  }
  processSpinner(event) {
    this.loading = event;
 }

 processActions(event) {
  this.accionesDina.emit(event);
}

// LEO
pintarClaseDiv(valor: number) {
  let result = 1;
  result = valor;
  let cadenaClase = '';
  Number.isNaN(result) ? cadenaClase = 'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-4 cl-de-ancho-chi-mov-form' :
  cadenaClase = 'col-xs-12 col-sm-12 col-md-' + result + ' col-lg-' + result + ' col-xl-' + result + ' mb-4 cl-de-ancho-chi-mov-form';
  return cadenaClase;
  }

  pintarClaseFechaDiv(valor: number) {
      let result = 1;
      result = valor;
      let cadenaClase = '';
      cadenaClase = 'col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-4 cl-de-ancho-chi-mov-form';

      return cadenaClase;
      }

}
