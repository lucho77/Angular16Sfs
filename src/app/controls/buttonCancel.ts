import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isMobile } from 'mobile-device-detect';


@Component({
    selector: 'app-button-cancel',
    templateUrl: './buttonCancel.html',
    styleUrls: ['./buttonCancel.scss']

})
export class ButtonCancelComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Output()acciones = new EventEmitter<any>();
    mobile: boolean = isMobile;
    tablet: boolean = screen.width > 600;
    constructor() {

    }
    executeAction() {
        console.log( 'ejecuto un boton');
        this.acciones.emit(this.field);

    }
}
