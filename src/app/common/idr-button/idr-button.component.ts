import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'idr-button',
  templateUrl: './idr-button.component.html',
  styleUrls: ['./idr-button.component.scss']
})
export class IdrButtonComponent implements OnInit {
    @Output() clicked: EventEmitter<any> = new EventEmitter();
    @Input() icon = '';
    @Input() color = '';
    @Input() fill = '';
    @Input() disabled = false;
    constructor() { }

    ngOnInit() { }

    onClick($event) {
        this.clicked.emit($event)
    }
}
