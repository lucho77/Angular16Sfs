import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByAbecedario'
})
export class SortByAbecedarioPipe implements PipeTransform {

  transform(array: any[], campo: string): any[] {
    if (!array || array.length === 0) {
      return array;
    }

    return array.sort((a, b) => {
      const valorA = (a[campo] || '').toLowerCase(); // Manejo de valores undefined
      const valorB = (b[campo] || '').toLowerCase(); // Manejo de valores undefined

      return valorA.localeCompare(valorB);
    });
  }

}
