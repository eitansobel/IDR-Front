import {Component, OnInit} from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
    selector: 'idr-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(
        private matIconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
        this.matIconRegistry.addSvgIcon(`icon-gear`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-gear.svg`));
        this.matIconRegistry.addSvgIcon(`icon-flag`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-flag.svg`));
        this.matIconRegistry.addSvgIcon(`icon-circle`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-circle.svg`));
        this.matIconRegistry.addSvgIcon(`icon-copy`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-copy.svg`));
        this.matIconRegistry.addSvgIcon(`icon-eye-show`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-eye-show-3.svg`));
        this.matIconRegistry.addSvgIcon(`icon-menu`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-menu.svg`));
        this.matIconRegistry.addSvgIcon(`icon-envelope`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-envelope.svg`));
        this.matIconRegistry.addSvgIcon(`icon-stethoscope`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-stethoscope.svg`));
        this.matIconRegistry.addSvgIcon(`icon-eye-hide`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-eye-hide.svg`));
        this.matIconRegistry.addSvgIcon(`icon-download`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-download.svg`));
        this.matIconRegistry.addSvgIcon(`icon-filter`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-filter.svg`));
        this.matIconRegistry.addSvgIcon(`icon-refresh`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-refresh.svg`));
        this.matIconRegistry.addSvgIcon(`icon-arrow-back`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-arrow-back.svg`));
        this.matIconRegistry.addSvgIcon(`icon-move`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-move.svg`));
        this.matIconRegistry.addSvgIcon(`icon-alert`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-alert.svg`));
        this.matIconRegistry.addSvgIcon(`icon-bell`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-bell.svg`));
        this.matIconRegistry.addSvgIcon(`icon-edit`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-edit.svg`));
        this.matIconRegistry.addSvgIcon(`icon-plus`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-plus.svg`));
        this.matIconRegistry.addSvgIcon(`icon-search`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-search.svg`));
        this.matIconRegistry.addSvgIcon(`icon-exclamation`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-exclamation.svg`));
        this.matIconRegistry.addSvgIcon(`icon-exclamation-outline`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-exclamation-outline`));
        this.matIconRegistry.addSvgIcon(`icon-close`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-close.svg`));
        this.matIconRegistry.addSvgIcon(`icon-attachment`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-attachment.svg`));
        this.matIconRegistry.addSvgIcon(`icon-add-user`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-add-user.svg`));
        this.matIconRegistry.addSvgIcon(`icon-login`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-login.svg`));
        this.matIconRegistry.addSvgIcon(`icon-check`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-check.svg`));
        this.matIconRegistry.addSvgIcon(`icon-trash`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-trash.svg`));
        this.matIconRegistry.addSvgIcon(`icon-plus`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-plus.svg`));
        this.matIconRegistry.addSvgIcon(`icon-storage`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-storage.svg`));
        this.matIconRegistry.addSvgIcon(`icon-video`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-video.svg`));
        this.matIconRegistry.addSvgIcon(`icon-undo`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-undo.svg`));
        this.matIconRegistry.addSvgIcon(`icon-suitcase`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-suitcase.svg`));
        this.matIconRegistry.addSvgIcon(`icon-pager`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-pager.svg`));
        this.matIconRegistry.addSvgIcon(`icon-sort`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-sort.svg`));
        this.matIconRegistry.addSvgIcon(`icon-more`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-more.svg`));
        this.matIconRegistry.addSvgIcon(`icon-home`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-home.svg`));
        this.matIconRegistry.addSvgIcon(`icon-key`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-key.svg`));
        this.matIconRegistry.addSvgIcon(`icon-on-call`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-on-call.svg`));
        this.matIconRegistry.addSvgIcon(`icon-asterisk`, sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-asterisk.svg`));

        this.matIconRegistry.addSvgIcon(`icon-message-arrow-up`,
            sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-message-arrow-up.svg`));
        this.matIconRegistry.addSvgIcon(`icon-message-arrow-down`,
            sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-message-arrow-down.svg`));

        this.matIconRegistry.addSvgIcon('icon-login-logo',
            sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-login-logo.svg`));
        this.matIconRegistry.addSvgIcon('icon-lock-logo',
            sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/icon-lock-logo.svg`));

    }
    ngOnInit() {}
}
