import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

@Component({
  selector: 'idr-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnDestroy {

    protected destroyed$: Subject<boolean> = new Subject();

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.destroyed$.unsubscribe();
    }
}
