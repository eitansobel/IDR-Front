import { ColumnDoctor } from './profile';

export class UpdateFolder {
    id?: number;
    update_interval?: any;
    group_id?: number;
    author?: ColumnDoctor;
    title: string;
    is_hidden?: boolean;
    is_private?: boolean;
    order?: number;
    authors_in_group?: Number[];
    subfolders?: any[];
    parent_id?: number;
    expired?: boolean; //

    constructor(data?: UpdateFolder) {

        this.id = data.id || void 0;
        this.update_interval = data.update_interval || void 0;
        this.group_id = data.group_id || void 0;
        this.author = data.author || void 0;
        this.title = data.title || void 0;
        this.is_hidden = data.is_hidden || void 0;
        this.is_private = data.is_private || void 0;
        this.order = data.order || void 0;
        this.authors_in_group = data.authors_in_group || void 0;
        this.subfolders = data.subfolders || void 0;
        this.parent_id = data.parent_id || void 0;
        // TODO: REWRITE: too ambitious initialization
        // [
        //     this.update_interval,
        //     this.group_id,
        //     this.author,
        //     this.title,
        //     this.is_hidden,
        //     // this.is_private, // TODO: uncoment once constructor rewritten
        //     this.order,
        //     this.authors_in_group
        // ] = dataColumn;
    }
}

export interface UpdateFolders {
    updateFolders: UpdateFolder[];
}
