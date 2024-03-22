import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: any, limit: number = 20, startAt: number = 0, ellipsis: string = '...'): any {
    if (value.length > 10) {
      return value.substr(startAt, limit) + ellipsis
    }
    return value
  }
}
