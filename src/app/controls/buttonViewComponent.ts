import { Input, EventEmitter, OnInit, Output, Component } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
    selector: 'app-button-view',
    template: `
    <button (click)="onClick()" class="btn btn-info" >{{ renderValue }}</button>
    `,
  })
  export class ButtonViewComponent implements ViewCell, OnInit {
    renderValue: string;

    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
      this.renderValue = this.value.toString().toUpperCase();
    }

    onClick() {
        console.log('esto hago en el click');
        console.log(this.rowData);
        console.log(this.value);
        this.save.emit(this.rowData);
    }
  }
