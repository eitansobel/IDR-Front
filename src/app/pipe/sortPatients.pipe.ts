import {Pipe, PipeTransform} from '@angular/core';

import { orderBy } from 'lodash';

@Pipe({
    name: 'sortPatientsBy'
})
export class SortPatientsByPipe implements PipeTransform {
    transform(array: Array<any>, sort_by: number, order: number): any {

        if (!array) { return; }
        if (!array.length) { return; }
        let s: string;
        let o: any;
        if (sort_by === 1) { s = 'ssn'; }
        if (sort_by === 2) { s = 'first_name'; }
        if (sort_by === 3) { s = 'last_name'; }
        if (sort_by === 4) { s = 'birth_date'; }
        if (sort_by === 5) { s = 'room'; }
        // if (sort_by === 1) { s = 'patient.ssn'; }
        // if (sort_by === 2) { s = 'patient.first_name'; }
        // if (sort_by === 3) { s = 'patient.last_name'; }
        // if (sort_by === 4) { s = 'patient.birth_date'; }
        // if (sort_by === 5) { s = 'patient.room'; }
        if (order === 1) { o = 'asc'; }
        if (order === 2) { o = 'desc'; }
        return orderBy(array, [s], [o]);
    }
}
