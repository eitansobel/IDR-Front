export class PatientBase {
    id: number;
    age: string;
    birth_date: string;
    expired: number;
    first_name: string;
    remote_id: number;
    last_name: string;
    mrn: string;
    room: string;
    ssn: string;
    unseen: number;

    constructor(patient?: any) {
        if (patient) {
            this.id = patient.id;
            this.age = patient.age || void 0;
            this.birth_date = patient.birth_date || void 0;
            this.expired = patient.expired || void 0;
            this.first_name = patient.first_name || void 0;
            this.last_name = patient.last_name || void 0;
            this.mrn = patient.mrn || void 0;
            this.room = patient.room || void 0;
            this.ssn = patient.ssn || void 0;
            this.unseen = patient.unseen || void 0;
        }
    }
}
