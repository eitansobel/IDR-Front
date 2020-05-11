import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
    selector: 'idr-icon',
    templateUrl: './idr-icon.component.html',
    styleUrls: ['./idr-icon.component.scss']
})
export class IdrIconComponent implements OnInit {
    @Input() icon: string;
    @Input() color: string;
    @Input() config: any;
    @Input() folder = false;
    @Input() size: any;
    @HostBinding('class.idr-icon') selfClass = true;
    constructor(
        private matIconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        if (this.icon) {
            this.matIconRegistry.addSvgIcon(
                this.icon,
                this.sanitizer.bypassSecurityTrustResourceUrl(
                    `assets/icons/${this.icon}.svg`
                )
            );
        }
    }
}
