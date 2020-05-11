import { Patient } from './patient';
import { Update } from './update';

export class MyPatient {
    id: number;
    patient: Patient;
    updates: Update[];
    show: boolean;

    constructor(myPatient: MyPatient) {
        this.id = myPatient.id;
        this.patient = myPatient.patient;
        this.show = myPatient.show;
    }
}
