import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isMobile } from 'mobile-device-detect';

@Component({
    selector: 'app-textarea',
    templateUrl: './textArea.html',
    styleUrls: ['./textArea.scss']

})
export class TextAreaComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Input() elindex: any;
    mobile: boolean = isMobile;
    tablet: boolean = screen.width > 600;
    constructor() {

    }
}
