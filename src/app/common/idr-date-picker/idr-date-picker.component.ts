import * as moment from 'moment';

import { Component, Input, OnChanges, OnInit, SimpleChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

export class DateModel {
    public _date: string;
    public day: number = 1;
    public month: number = 1;
    public year: number = 1930;
    get date() {
        return moment(`${this.year}-${this.month}-${this.day}`).format('YYYY-MM-DD');
    }
    set date(value) {
        const date = moment(value);
        if (date.isValid()) {
            this.day = date.date();
            this.month = date.month() + 1;
            this.year = date.year();
        }
    }
    constructor(date?: string) {
        this.date = date;
    }
}

@Component({
    selector: 'idr-date-picker',
    templateUrl: './idr-date-picker.component.html',
    styleUrls: ['./idr-date-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IdrDatePickerComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => IdrDatePickerComponent),
            multi: true
        }
    ]
})
export class IdrDatePickerComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {

    @Input() formControlName;
    @Input() edit = false;
    @Input() label;
    @Input() placeholder = '—';

    public startYear = 1930;
    public lastYear = (new Date()).getFullYear();
    public dateModel: DateModel = new DateModel();


    public days: any[] = [];
    public years: any[] = [];
    public months = [
        { id: 1, title: 'January' },
        { id: 2, title: 'February' },
        { id: 3, title: 'March' },
        { id: 4, title: 'April' },
        { id: 5, title: 'May' },
        { id: 6, title: 'June' },
        { id: 7, title: 'July' },
        { id: 8, title: 'August' },
        { id: 9, title: 'September' },
        { id: 10, title: 'October' },
        { id: 11, title: 'November' },
        { id: 12, title: 'December' }
    ];

    private _value: string;

    get value(): string {
        return this.dateModel.date;
    }

    set value(val: string) {
        this.dateModel = new DateModel(val);
    }

    public _control: FormControl;

    constructor() {}

    dayChanged (value) {
        this.onChange(this.value);
    }

    monthChanged (value) {
        this.onChange(this.value);
    }

    yearChanged (value) {
        this.onChange(this.value);
    }

    ngOnInit() {
        if (!this.years.length) {
            for (let i = this.startYear; i <= this.lastYear; i++) {
                this.years.push({ id: i, title: i });
            }
        }

        this.days = Array(31)
            .fill(1)
            .map((x, i) => {
                const id = ++i;
                if (id < 10) {
                    return { id: id, title: '0' + id };
                } else {
                    return { id: id, title: '' + id };
                }
            });
    }

    isValid(): boolean {
        return this._control &&
            !this._control.errors &&
            !this._control.invalid;
    }

    ngOnChanges(changes: SimpleChanges): void {
        // trigger validation
        this.onChange(this.value);
    }

    // Function to call when the input changes.
    onChange = (value: string) => {};

    // Function to call when the input is touched (when a input is clicked).
    onTouched = () => {};

        // Allows Angular to update the model (input).
    // Update the model and changes needed for the view here.
    writeValue(value: string): void {
        if(this.dateModel.date !== value){
            this.value = value;
            this.onChange(this.value);
        }
    }

    // Allows Angular to register a function to call when the model (input) changes.
    // Save the function as a property to call later here.
    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    // Allows Angular to register a function to call when the input has been touched.
    // Save the function as a property to call later here.
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    onModelChange($event) {
        this.onChange($event);
    }

    // validates the form, returns null when valid else the validation object
    // in this case we're checking if the json parsing has passed or failed from the onChange method
    public validate(control: FormControl): ValidationErrors {
        this._control = control;
        return control.valid ? null : control.errors;
    }
}
