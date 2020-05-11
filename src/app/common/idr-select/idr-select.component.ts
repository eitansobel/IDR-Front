import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Component({
    selector: 'idr-select',
    templateUrl: './idr-select.component.html',
    styleUrls: ['./idr-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IdrSelectComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => IdrSelectComponent),
            multi: true
        }
    ]
})
export class IdrSelectComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
    private static readonly errorMessages = {
        'required': () => 'This field is required',
        'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
        'maxlength': (params) => 'The max allowed number of characters is ' + params.requiredLength,
        'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
        'years': (params) => params.message,
        'countryCity': (params) => params.message,
        'uniqueName': (params) => params.message,
        'telephoneNumbers': (params) => params.message,
        'email': (params) => params.message,
        'password': (params) => params.message,
        'telephoneNumber': (params) => params.message,
        'invalid_characters': (params) => params.message,
        'match': (params) => params.message
    };

    @Input() type = 'text';
    @Input() label;
    @Input() formControlName;
    @Input() edit;
    @Input() placeholder = '—';
    @Input() disabled = false;
    @Input() items: any = [];
    @Output() modelChanged = new EventEmitter<any>();

    public _control: FormControl;

    private _value: any;

    get value(): any {
        return this._value;
    }

    set value(val: any) {
        this._value = val;
    }

    constructor() {}

    ngOnInit() {}


    isValid(): boolean {
        return this._control &&
            !this._control.errors &&
            !this._control.invalid;
    }

    listOfErrors(): string[] {
        if(this._control && this._control.errors){
            const result = Object.keys(this._control.errors)
                .map(field => this.getMessage(field, this._control.errors[field]));
            return result;
        }
        return [];
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
        if(this._value !== value){
            this._value = value;
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

    // Allows Angular to disable the input.
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onModelChange($event) {
        console.log('onModelChange', $event)
        this.onChange($event);
        this.modelChanged.emit($event);
    }

    // validates the form, returns null when valid else the validation object
    // in this case we're checking if the json parsing has passed or failed from the onChange method
    public validate(control: FormControl): ValidationErrors {
        this._control = control;
        return control.valid ? null : control.errors;
    }

    private getMessage(type: string, params: any) {
        return IdrSelectComponent.errorMessages[type](params);
    }
}
