import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormdataReportdef } from 'src/app/_models/formdata';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input() enable: boolean;
  @Input() listRequest: FormdataReportdef[];

  getObjDTOFilter(objs: any[], id: string): string{
    for (let ob of objs) {
      if (ob.id == Number.parseInt(id))
        return ob.value;
    }
    return "";
  }
  getBooleanString(value) :string{
    return value == 1 || value == 'true' ? 'Si' : 'No';
  }

}
