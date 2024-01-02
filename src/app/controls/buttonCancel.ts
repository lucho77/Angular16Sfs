import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isMobile } from 'mobile-device-detect';
import { EsMobileService } from '../_services/es-mobile.service';


@Component({
    selector: 'app-button-cancel',
    templateUrl: './buttonCancel.html',
    styleUrls: ['./buttonCancel.scss']

})
export class ButtonCancelComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Output()acciones = new EventEmitter<any>();
    constructor(public EMS:EsMobileService) {

    }
    executeAction() {
        console.log( 'ejecuto un boton');
        this.acciones.emit(this.field);

    }
}
