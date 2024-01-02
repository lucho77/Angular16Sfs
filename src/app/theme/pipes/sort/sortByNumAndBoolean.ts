import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByNumAndBoolean'
})
export class sortByNumAndBoolean implements PipeTransform {

  transform(value: any[], conf:{campo:number, boolean:string}): any[] {

    if (!value || value.length === 0) {
      return value;
    }
    return value.sort((n1,n2) => 
    {

      let val1 = n1[conf.campo]
      let val2 = n2[conf.campo]

      if (!n1[conf.boolean] && n2[conf.boolean]) {
        return -1; 
      } else if (n1[conf.boolean] && !n2[conf.boolean]) {
        return 1;
      }

      return val1 - val2; 
    });
  }

}
