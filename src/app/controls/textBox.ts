import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EsMobileService } from '../_services/es-mobile.service';


@Component({
    selector: 'app-textbox',
    templateUrl: './textBox.html',
    styleUrls:[ './textBox.scss']

})
export class TextBoxComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Input() elindex: any;

    constructor(public EMS:EsMobileService) {}
}
