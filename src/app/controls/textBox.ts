import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isMobile } from 'mobile-device-detect';


@Component({
    selector: 'app-textbox',
    templateUrl: './textBox.html',
    styleUrls:[ './textBox.scss']

})
export class TextBoxComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Input() elindex: any;
    @Input() esambula: number; 

    mobile: boolean = isMobile;
    tablet = screen.width > 600 ;

    constructor() {}
}
