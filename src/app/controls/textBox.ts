import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


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

    constructor() {

    }
}
