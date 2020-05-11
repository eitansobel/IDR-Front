import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'acronym'
})
export class AcronymPipe implements PipeTransform {
    transform(value: any): any {
        if (!value) {
            return;
        }
        const matches = value.match(/\b(\w)/g); // ['J','S','O','N']
        const acronym = matches.join('');

        return acronym.length > 1 ? acronym[0] + acronym[1] : acronym[0];
    }
}
