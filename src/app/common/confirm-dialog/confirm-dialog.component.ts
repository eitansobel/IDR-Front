import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'idr-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
    public header = '';
    public body = '';
    constructor( @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ConfirmDialogComponent>, ) {
        if (this.data) {
            this.header = this.data.header;
            this.body = this.data.body;
        }
    }

    ngOnInit() {}

    closeDialog(flag) {
        this.dialogRef.close(flag);
    }

}
