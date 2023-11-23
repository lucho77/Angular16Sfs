import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, NgZone, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isMobile } from 'mobile-device-detect';
import { take } from 'rxjs';

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
    constructor(private _ngZone: NgZone) {}

    @ViewChild('autosize') autosize: CdkTextareaAutosize;

    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
      }

}
