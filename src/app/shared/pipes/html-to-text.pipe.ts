import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlToText',
  standalone: true,
})
export class HtmlToTextPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace(/<\/?[^>]+(>|$)/g, '') : '';
  }
}
