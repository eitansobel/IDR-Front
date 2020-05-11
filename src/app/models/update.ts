export class Update {
    id?: number;
    active: boolean;
    content: string;
    doctor: any;
    files: any[];
    flagged: boolean;
    flagged_custom: boolean;
    folder: any;
    patient: number;
    remind_time?: any;
    expired: boolean;
    created: any;
    seen: boolean;

    constructor(data?: any) {
        if (data) {
            this.id = data.id || void 0;
            this.active = data.active || false;
            this.content = data.content || void 0;
            this.doctor = data.doctor || void 0;
            this.flagged = data.flagged || false;
            this.flagged_custom = data.flagged_custom || false;
            this.folder = data.folder || void 0;
            this.patient = data.patient || void 0;
            this.remind_time = data.remind_time || void 0;
            this.created = data.created || void 0;
            this.files = data.files || void 0;
            this.seen = data.seen || false;
        }
    }
}
