import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'onGoingFilm'
})
export class OnGoingFilmPipePipe implements PipeTransform {

    transform(value: string): any {
        if (value.charAt(value.length) === '–') {
            return value.replace('–', ' - present');
        }
        return value;
    }

}
