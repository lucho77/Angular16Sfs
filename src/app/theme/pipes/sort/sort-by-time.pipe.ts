import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByNum'
})
export class SortByTimePipe implements PipeTransform {

  transform(value: any[], campo: number): any[] {

    if (!value || value.length === 0) {
      return value;
    }
    return value.sort((n1,n2) => 
    {

      let val1 = n1[campo]
      let val2 = n2[campo]
      return val1 - val2; 
    });
  }

}
