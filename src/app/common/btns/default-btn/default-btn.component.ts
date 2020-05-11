import {Component, EventEmitter, Input, Optional, Output} from '@angular/core';

@Component({
    selector: 'idr-default-btn',
    templateUrl: './default-btn.component.html',
    styleUrls: ['./default-btn.component.scss']
})
export class DefaultBtnComponent {
    @Input() className = 'default';
    @Input() disabled: any;
    @Output() onClick = new EventEmitter<any>();

    handleClick(event: any) {
        this.onClick.emit(event);
    }
}
