import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { AcronymPipe } from '../pipe/acronym.pipe';
import { AlertCheckboxComponent } from './controls/alert-checkbox/alert-checkbox.component';
import { ArrowSvgComponent } from './svg/arrow-svg/arrow-svg.component';
import { BackBtnComponent } from './btns/back-btn/back-btn.component';
import { BaseComponent } from './base/base.component';
import { ChevronSvgComponent } from './svg/chevron-svg/chevron-svg.component';
import { ClosePopupSvgComponent } from './svg/close-popup-svg/close-popup-svg.component';
import { CloseRoundSvgComponent } from './svg/close-round-svg/close-round-svg.component';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CountryContactsComponent } from './country-contacts/country-contacts.component';
import { CropSvgComponent } from './svg/crop-svg/crop-svg.component';
import { CrossSvgComponent } from './svg/cross-svg/cross-svg.component';
import { DateSelectComponent } from './date-select/date-select.component';
import { DefaultBtnComponent } from './btns/default-btn/default-btn.component';
import { DialogOverviewComponent } from './dialogOverview/dialogOverview.component';
import { DropdownSvgComponent } from './svg/dropdown-svg/dropdown-svg.component';
import { FileNamePipe } from '../pipe/fileName.pipe';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FilterPipe } from '../pipe/filter.pipe';
import { FormWrapComponent } from './form-wrap/form-wrap.component';
import { IdrButtonComponent } from './idr-button/idr-button.component';
import { IdrCheckboxComponent } from './controls/idr-checkbox/idr-checkbox.component';
import { IdrColComponent } from './idr-col/idr-col.component';
import { IdrDatePickerComponent } from './idr-date-picker/idr-date-picker.component';
import { IdrDialogWrapComponent } from './idr-dialog-wrap/idr-dialog-wrap.component';
import { IdrIconComponent } from './idr-icon/idr-icon.component';
import { IdrInputComponent } from './idr-input/idr-input.component';
import { IdrInputPassComponent } from './controls/idr-input-pass/idr-input-pass.component';
import { IdrModalWrapComponent } from './idr-modal-wrap/idr-modal-wrap.component';
import { IdrRowComponent } from './idr-row/idr-row.component';
import { IdrSearchComponent } from './idr-search/idr-search.component';
import { IdrSelectComponent } from './idr-select/idr-select.component';
import { InputTextComponent } from './controls/idr-input-text/idr-input-text.component';
import { KeyIconSvgComponent } from './svg/key-icon-svg/key-icon-svg.component';
import { LocalTimePipe } from '../pipe/localTime.pipe';
import { LockSvgComponent } from './svg/lock-svg/lock-svg.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MessageSvgComponent } from './svg/message-svg/message-svg.component';
import { Ng4FilesModule } from './../ng4-files';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { NoDataComponent } from './no-data/no-data.component';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PaginationComponent } from './pagination/pagination.component';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PhoneMaskDirective } from '../directives/phone.mask.directive';
import { PortalModule } from '@angular/cdk/portal';
import { PrivilegesComponent } from './privileges/privileges.component';
import { SearchControlComponent } from './controls/search-control/search-control.component';
import { SelectPipe } from '../pipe/select.pipe';
import { ServerErrorComponent } from './server-error/server-error.component';
import { SortByPipe } from '../pipe/sort.pipe';
import { SortableListComponent } from './sortable-list/sortable-list.component';
import { SsnMaskDirective } from '../directives/ssn.mask.directive';
import { TextareaComponent } from './controls/textarea/textarea.component';
import { TimeSetupComponent } from './time-setup/time-setup.component';
import { ValidationErrorComponent } from './validation-error/validation-error.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

export const MY_MOMENT_FORMATS = {
    parseInput: 'l LT',
    fullPickerInput: 'l LT',
    datePickerInput: 'l',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
    declarations: [
        CrossSvgComponent,
        LockSvgComponent,
        MessageSvgComponent,
        ValidationErrorComponent,
        DefaultBtnComponent,
        BackBtnComponent,
        InputTextComponent,
        IdrCheckboxComponent,
        IdrModalWrapComponent,
        IdrInputPassComponent,
        TimeSetupComponent,
        ServerErrorComponent,
        DropdownSvgComponent,
        DialogOverviewComponent,
        AlertCheckboxComponent,
        FormWrapComponent,
        ClosePopupSvgComponent,
        DateSelectComponent,
        CropSvgComponent,
        SortableListComponent,
        ArrowSvgComponent,
        PaginationComponent,
        FilterPipe,
        SelectPipe,
        SortByPipe,
        FileNamePipe,
        AcronymPipe,
        LocalTimePipe,
        KeyIconSvgComponent,
        PrivilegesComponent,
        CountryContactsComponent,
        TextareaComponent,
        SearchControlComponent,
        CloseRoundSvgComponent,
        PhoneMaskDirective,
        SsnMaskDirective,
        ChevronSvgComponent,
        NoDataComponent,
        BaseComponent,
        IdrDialogWrapComponent,
        FileUploaderComponent,
        ConfirmDialogComponent,
        IdrColComponent,
        IdrRowComponent,
        IdrButtonComponent,
        IdrSearchComponent,
        IdrIconComponent,
        IdrInputComponent,
        IdrSelectComponent,
        IdrDatePickerComponent
    ],
    imports: [
        CommonModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        OwlMomentDateTimeModule,
        MatDialogModule,
        PortalModule,
        MatRadioModule,
        FormsModule,
        Ng4FilesModule,
        NgSelectModule,
        ReactiveFormsModule,
        NgScrollbarModule,
        MatSlideToggleModule,
        MatIconModule,
        PerfectScrollbarModule,
        MatTooltipModule,
        MatSelectModule
    ],
    providers: [
        SortByPipe,
        FilterPipe,
        SelectPipe,
        {
            provide: OWL_DATE_TIME_FORMATS,
            useValue: MY_MOMENT_FORMATS
        },
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
    exports: [
        CrossSvgComponent,
        LockSvgComponent,
        MessageSvgComponent,
        ValidationErrorComponent,
        DefaultBtnComponent,
        InputTextComponent,
        IdrCheckboxComponent,
        IdrModalWrapComponent,
        IdrInputPassComponent,
        TimeSetupComponent,
        ServerErrorComponent,
        BackBtnComponent,
        DropdownSvgComponent,
        DialogOverviewComponent,
        AlertCheckboxComponent,
        FormWrapComponent,
        ClosePopupSvgComponent,
        DateSelectComponent,
        CropSvgComponent,
        SortableListComponent,
        ArrowSvgComponent,
        PaginationComponent,
        FilterPipe,
        SortByPipe,
        SelectPipe,
        AcronymPipe,
        FileNamePipe,
        LocalTimePipe,
        KeyIconSvgComponent,
        PrivilegesComponent,
        CountryContactsComponent,
        TextareaComponent,
        SearchControlComponent,
        CloseRoundSvgComponent,
        SsnMaskDirective,
        PhoneMaskDirective,
        ChevronSvgComponent,
        NoDataComponent,
        BaseComponent,
        IdrDialogWrapComponent,
        FileUploaderComponent,
        ConfirmDialogComponent,
        PerfectScrollbarModule,
        IdrColComponent,
        IdrRowComponent,
        IdrButtonComponent,
        IdrSearchComponent,
        IdrIconComponent,
        IdrInputComponent,
        MatTooltipModule,
        IdrSelectComponent,
        IdrDatePickerComponent
    ],
    entryComponents: [
        ConfirmDialogComponent,
        DialogOverviewComponent,
        PrivilegesComponent
    ],
})
export class SharedComponentModule {
}
