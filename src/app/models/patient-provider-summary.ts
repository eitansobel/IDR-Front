export class PatientProviderSummary {
    //public id: number; // Provider id
    public full_name: string;
    public title: string;
    public total: number;
    public unseen: number;
    constructor(data?: any) {
        if (data) {
            this.full_name = data.full_name;
            this.title = data.title;
            this.total = data.total;
            this.unseen = data.unseen;
        }
    }
}
