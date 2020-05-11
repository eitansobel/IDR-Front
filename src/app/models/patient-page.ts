import { Pages } from './pages';
import { PatientBase } from './patient-base';

export class PatientPage {
    public patient: PatientBase;
    public page: Pages;
    constructor(patient: PatientBase, page: Pages) {
        this.patient = patient;
        this.page = page;
    }
}
