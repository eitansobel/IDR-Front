import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface IFile {
    path: string;
    filename: string;
    filetype?: string;
    data?: FormData;
}

@Component({
    selector: 'idr-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {
    public filesUploaded: IFile[] = [];

    @Output() filesChange = new EventEmitter();
    @Output() filesUpdated = new EventEmitter();

    @Input()
    get files() {
        return this.filesUploaded;
    }

    set files(val) {
        this.filesUploaded = val;
        this.filesChange.emit(this.filesUploaded);
    }

    constructor() {
    }

    public uploadFile(event) {
        if ( event.target.files && event.target.files.length > 0 ) {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                this.setupReader(files[i]);
            }

        }
    }

    public setupReader(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
            const loadedFile = {
                path: e.target.result,
                filename: file.name,
                filetype: file.type
            };
            this.filesUploaded.push(loadedFile);
            this.filesUpdated.emit({ type: 'create', file: loadedFile });
        };
    }

    public remove(index: number) {
        this.filesUpdated.emit({ type: 'remove', file: this.files[index] });
        this.files.splice(index, 1);
    }
}
