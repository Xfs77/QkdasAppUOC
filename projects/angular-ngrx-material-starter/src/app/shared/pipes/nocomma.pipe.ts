
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noComma'
})
export class NocommaPipe implements PipeTransform {

  transform(value: string): string {
    if (value !== undefined && value !== null) {
      return value.replace(/,/g, '');
    } else {
      return '';
    }
  }
}
