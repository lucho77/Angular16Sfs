import { Component, ViewEncapsulation, Input, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
})
export class EditorComponent implements OnInit {

  @Input() field: any = {};
  @Input() form: FormGroup;
  @Input() elindex: any;


  constructor() {
     // this.ckeditorContent = '<div>Hey we are testing CKEditor</div>';
   }
   ngOnInit() {
     console.log('Los this.Editor.plugins del Editor son estos : ');
   }
/*
  public onReady(editor) {
    console.log('listo');
    this.form.controls[this.field.name].setValue(this.field.valueNew);
    editor.ui.view.editable.element.parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.view.editable.element
    );

  }
  */
  onFocus(event: any) {
      console.log('editor is focused');
  }
  onBlur(event: any) {
  }

}
