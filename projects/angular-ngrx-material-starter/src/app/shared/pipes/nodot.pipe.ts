
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noDot'
})
export class NodotPipe implements PipeTransform {

  transform(value: string): string {
    if (value !== undefined && value !== null) {
      return value.replace(/\./g, '');
    } else {
      return '';
    }
  }
}
