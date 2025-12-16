import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique'
})
export class UniquePipe implements PipeTransform {
  transform(value: any, key: string): any {
    const uniqueValues = [...new Set(value.map((item: { [x: string]: any; }) => item[key]))];
    return uniqueValues;
  }
}
