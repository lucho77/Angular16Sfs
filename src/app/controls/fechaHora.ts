import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-fechaHora',
    templateUrl: './fechaHora.html',
    styleUrls: ['./fechaHora.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FechaHoraComponent implements OnInit {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Input() elindex: any;
    public fecha_Seleccionada: Date;
    public input;
    constructor() {}
    ngOnInit() {
        
    }
}
