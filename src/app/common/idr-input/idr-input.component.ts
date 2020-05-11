import {
    Component,
    HostBinding,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    forwardRef
} from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator
} from '@angular/forms';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'idr-input',
    templateUrl: './idr-input.component.html',
    styleUrls: ['./idr-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IdrInputComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => IdrInputComponent),
            multi: true
        }
    ]
})
export class IdrInputComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
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

    private _value: string;

    @HostBinding('style.opacity')
    get opacity() {
        return this.disabled ? 0.25 : 1;
    }

    public _control: FormControl;

    get value(): string {
        return this._value;
    }

    set value(val: string) {
        this._value = val;
    }

    constructor(
        public sanitizer: DomSanitizer
    ) {}
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
        this.onChange($event);
    }

    // validates the form, returns null when valid else the validation object
    // in this case we're checking if the json parsing has passed or failed from the onChange method
    public validate(control: FormControl): ValidationErrors {
        this._control = control;
        return control.valid ? null : control.errors;
    }

    private getMessage(type: string, params: any) {
        return IdrInputComponent.errorMessages[type](params);
    }
}
