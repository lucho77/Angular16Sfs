import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-fechaHora',
    templateUrl: './fechaHora.html',
})
export class FechaHoraComponent implements OnInit {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Input() elindex: any;
    @Input() esambula: number;
    public fecha_Seleccionada: Date;
    constructor() {
        console.log('Variable de SL : ');
        console.log(this.field);
    }
    ngOnInit() {
        this.fecha_Seleccionada = this.field.valueNew ? this.ngConvertFecha(this.field.valueNew) : null;
        console.log('this.fecha_Seleccionada');
        console.log(this.fecha_Seleccionada);
        this.form.get(this.field.name).setValue(this.fecha_Seleccionada);
    }
    ngConvertFecha(pfecha: string) {
        const now = moment(pfecha);
        return new Date(+(now.format('YYYY')), +(now.format('MM')) - 1 , +(now.format('DD'))
        , +(now.format('HH')) , +(now.format('mm')));
    }

}
