export class Sort {
    sortBy: number;
    order: number;
    constructor(data?: any) {
        if (data) {
            this.sortBy = data.sortBy || void 0;
            this.order = data.order || void 0;
        }
    }
}
