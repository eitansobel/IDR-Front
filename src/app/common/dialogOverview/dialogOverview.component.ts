import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'idr-dialog-overview',
    templateUrl: 'dialog-overview.component.html',
    styleUrls: ['dialog-overview.component.scss']
})
export class DialogOverviewComponent {
    public promoListText = '';
    public headerText = '';
    hideCancel = false;
    constructor( @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<DialogOverviewComponent>, ) {
        if (this.data) {
            this.promoListText = this.data.body;
            this.headerText = this.data.header;

            if (this.data.buttons) {
                this.hideCancel = true;
            }
        }
    }

    closeDialog(flag) {
        this.dialogRef.close(flag);
    }
}
