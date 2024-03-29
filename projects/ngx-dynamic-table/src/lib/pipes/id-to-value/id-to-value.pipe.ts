import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe transforms an id to a value.
 */
@Pipe({
  name: 'idToValue'
})
export class IdToValuePipe implements PipeTransform {
  /**
   * This function returns a readable value.
   * @param {string}  value - value that should be transformed
   * @param {any[]}   kat   - table with id and value
   */
  transform(value: string, kat: any[]): string {
    console.log('kat: ', kat)
    let item = kat.find((item: { id: string, bezeichnung: string }) => item.id === value)
    if (item.hasOwnProperty('bezeichnung')) return item.bezeichnung
    if (item.hasOwnProperty('item')) return item.item
    return value
  }
}
