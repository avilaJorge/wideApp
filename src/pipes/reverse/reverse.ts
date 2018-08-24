import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ReversePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'reverse',
  pure: false
})
export class ReversePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(values) {
    if (values) {
      return values.reverse();
    }
  }
}
