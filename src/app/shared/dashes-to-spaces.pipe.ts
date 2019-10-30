import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dashesToSpaces'
})
export class DashesToSpacesPipe implements PipeTransform {

    transform(value: string, character: string): string {
        return value.replace(character, ' ');
    }

}
