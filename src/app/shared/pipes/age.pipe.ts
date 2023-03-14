import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  transform(value: string): number {
    const birthdate = dayjs(value);
    const age = dayjs().diff(birthdate, 'year');

    return age;
  }
}
