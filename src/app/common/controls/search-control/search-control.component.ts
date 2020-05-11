import {Component, ElementRef, Input, OnChanges, ViewChild, forwardRef} from '@angular/core';
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';

import {ValueAccessorBase} from '../../../models/value-accessor';

@Component({
  selector: 'idr-search-control',
  templateUrl: './search-control.component.html',
  styleUrls: ['./search-control.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchControlComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => SearchControlComponent),
            multi: true,
        }]
})
export class SearchControlComponent extends ValueAccessorBase<string> implements OnChanges {
    @Input() placeholder = '-';
    @Input() control;
    @ViewChild('input') input: ElementRef;
    public searchText: string;
    ngOnChanges() {
        if (!this.control) { return; }
        this.input.nativeElement.value = this.control.value;
    }
}

