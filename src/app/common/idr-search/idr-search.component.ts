import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueAccessorBase } from 'src/app/models/value-accessor';

@Component({
    selector: 'idr-search',
    templateUrl: './idr-search.component.html',
    styleUrls: ['./idr-search.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IdrSearchComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => IdrSearchComponent),
            multi: true,
        }]
})
export class IdrSearchComponent extends ValueAccessorBase<string> implements OnChanges {
    @ViewChild('input') input: ElementRef;
    @Input() control;
    @Input() placeholder = '';
    @Input() icon = 'search';
    public searchText: string;
    ngOnChanges() {
        if (!this.control) { return; }
        this.input.nativeElement.value = this.control.value;
    }
}
