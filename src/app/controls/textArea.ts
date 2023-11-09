import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-textarea',
    templateUrl: './textArea.html',
    styleUrls: ['./textArea.scss']

})
export class TextAreaComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Input() elindex: any;
    @Input() esambula: number;

    constructor() {

    }
}
