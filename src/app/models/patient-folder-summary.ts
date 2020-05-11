export class UpdateFolderSummary {
    public id: number; // update folder id
    public active: boolean;
    public expired: boolean;
    public parent_id: number;
    public subfolders: any;
    public title: string;
    public total: number;
    public unseen: number;
    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.active = data.active;
            this.expired = data.expired;
            this.parent_id = data.parent_id;
            this.subfolders = data.subfolders;
            this.title = data.title;
            this.total = data.total;
            this.unseen = data.unseen;
        }
    }
}
