import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByTime'
})
export class SortByTimePipe implements PipeTransform {

  transform(value: any[]): any[] {
    return value.sort((n1,n2) => 
    {
      return n1.time - n2.time; 
    });
  }

}
