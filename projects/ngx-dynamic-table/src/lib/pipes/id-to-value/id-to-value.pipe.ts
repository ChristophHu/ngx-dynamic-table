import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idToValue'
})
export class IdToValuePipe implements PipeTransform {
  transform(value: string, kat: any[]): string {
    console.log('kat: ', kat)
    let item = kat.find((item: { id: string, bezeichnung: string }) => item.id === value)
    if (item.hasOwnProperty('bezeichnung')) return item.bezeichnung
    if (item.hasOwnProperty('item')) return item.item
    return value
  }
}
