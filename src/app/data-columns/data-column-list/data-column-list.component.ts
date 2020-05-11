import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output
} from '@angular/core';
import {
    CopyColumn,
    DeleteColumn,
    GetColumns,
    UpdateColumn
} from '../../redux/dataColumns/data-column.action';

import { AppState } from '../../redux/app.state';
import { ChatService } from '../../messages/services/chat.service';
import { ConfirmDialogComponent } from 'src/app/common/confirm-dialog/confirm-dialog.component';
import { DataColumn } from '../../models/data-columns';
import { DataColumnPopupComponent } from '../data-column-popup/data-column-popup.component';
import { DataColumnsService } from '../services/data-columns.service';
import { DataColumnsUpdateIntervalMapService } from '../services/data-columns-update-interval-map.service';
import { DialogOverviewComponent } from '../../common/dialogOverview/dialogOverview.component';
import { FilterPipe } from '../../pipe/filter.pipe';
import { MatDialog } from '@angular/material';
import { NotifyService } from '../../services/notify.service';
import { SortByPipe } from '../../pipe/sort.pipe';
import { Store } from '@ngrx/store';
import { UserPermissionService } from '../../services/user-permission.service';

@Component({
    selector: 'idr-data-column-list',
    templateUrl: './data-column-list.component.html',
    styleUrls: ['./data-column-list.component.scss']
})
export class DataColumnListComponent
    implements OnInit, AfterViewInit, OnChanges {
    @Output() chosedData = new EventEmitter<any>();
    @Input() listHeader = [];
    @Input() searchHolder = 'Search text';
    @Input() sortableKeys = [];
    @Input() searchKeys = [];

    public direc: boolean = false;
    public active: number = null;
    public dataColumnList: DataColumn[] = [];
    private initDataColumnList: DataColumn[] = [];
    public updateNeededMap: {};
    public pages;
    public start = 0;
    public end = 10;
    public maxPages = 10;
    public searchText;
    public currentPageIndex = 0;
    public slideLeft = 5;
    public offsetHeightVal: number;

    constructor(
        private dataColumnsUpdateIntervalMapService: DataColumnsUpdateIntervalMapService,
        private userPermissionService: UserPermissionService,
        private sort: SortByPipe,
        private filter: FilterPipe,
        private notify: NotifyService,
        private store: Store<AppState>,
        private dataService: DataColumnsService,
        private chatService: ChatService,
        public dialog: MatDialog,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        // this.offsetHeightVal = this.offset(
        //     document.querySelector('.table .content')
        // ).top;
    }

    ngOnInit() {
        // this.offsetHeightVal = this.offset(
        //     document.querySelector('.table .content')
        // ).top;

        this.store.select('dataColumnPage').subscribe(_dataColumns => {
            // Update folder list data from store
            if (this.initDataColumnList.length && !_dataColumns['columns'].length) {
                this.dataColumnList = _dataColumns['columns'];
            }

            this.initDataColumnList = _dataColumns['columns'];

            if (this.initDataColumnList.length) {
                if (this.active !== null) {
                    this.sortable(this.active, true);
                } else {
                    this.dataColumnList = _dataColumns['columns'];
                }
            }

            // TODO: OBSOLETE: Pager
            // this.getPages();
        });

        // this.updateNeededMap = this.dataColumnsUpdateIntervalMapService.keyValueMap;
        // this.chatService.notifications.subscribe(notif => {
        //     this.dataService.webSocketActionManager(
        //         notif,
        //         this.initDataColumnList,
        //         this.store
        //     );
        // });
    }

    ngOnChanges() {
        // TODO: OBSOLETE: Pager
        // this.getPages();
    }

    // TODO: OBSOLETE: Pager
    // getPages() {
    //     this.start = 0;
    //     this.end = this.maxPages;
    //     if (!this.dataColumnList.length) { return; }
    //     this.pages = Math.ceil(this.dataColumnList.length / this.maxPages);
    //     if (this.searchText) {
    //         this.pages = Math.ceil(
    //             this.filter.transform(
    //                 this.dataColumnList,
    //                 this.sortableKeys,
    //                 this.searchText
    //             ).length / this.maxPages
    //         );
    //     }
    //     if (this.currentPageIndex >= this.pages) {
    //         this.activePage(this.currentPageIndex - 1);
    //     } else {
    //         this.activePage(this.currentPageIndex);
    //     }
    // }

    sortable(index, refresh = false) {
        if (!refresh) {
            this.direc = !this.direc;
        }
        this.dataColumnList = this.sort.transform(
            this.initDataColumnList,
            this.sortableKeys[index],
            this.direc
        );
    }

    deleteRow(index, column) {
        if (!this.userCanSeeButton('delete', column)) {
            this.notify.notifyError('You do not have permissions to delete this folder.')
            return;
        }

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '342px',
            data: {
                header: 'Delete Folder',
                body: `Are you sure you want to delete folder ${
                    this.dataColumnList[index].title
                }?`
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.dataService.deleteDataColumn(column.id).subscribe(
                    _d => {
                        this.store.dispatch(new DeleteColumn(column));
                    },
                    err => {
                        this.notify.notifyError(err);
                    }
                );
            }
        });
    }

    copyRow(index, id) {
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            width: '342px',
            data: {
                header: 'Copy Column',
                body: `Are you sure you want to copy ${
                    this.dataColumnList[index].title
                } column?`
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.dataService.copyDataColumn(id).subscribe((_data: DataColumn) => {
                    this.store.dispatch(new CopyColumn(_data));
                });
            }
        });
    }

    toggleColumn(status, id) {
        this.dataService
            .toggleDataColumn(id, { is_hidden: status.checked })
            .subscribe((resp: DataColumn) => {
                this.store.dispatch(new UpdateColumn(resp));
            });
    }

    activePage(i) {
        this.currentPageIndex = i;
        this.start = i * this.maxPages;
        this.end = (i + 1) * this.maxPages;
    }

    filterUsers(searchText) {
        this.pages = Math.round(
            this.filter.transform(
                this.dataColumnList,
                this.sortableKeys,
                searchText
            ).length / this.maxPages
        );
    }

    editDataColumn(columnInstance): void {
        if (!this.userCanSeeButton('edit', columnInstance)) {
            this.notify.notifyError('You do not have permissions to edit this folder.')
            return;
        }
        this.dialog.open(DataColumnPopupComponent, {
            width: '440px',
            data: {
                header: 'Edit Update Folder',
                columnInstance: columnInstance
            }
        });
    }

    userCanSeeButton(buttonType, column): boolean {
        return this.userPermissionService.userCanSeeColumnButton(
            buttonType,
            column
        );
    }

    setNewColumnOrder(e: any) {
        if (e.type === 'drop') {
            const newOrderData = this.dataColumnList.map((item, index) => {
                return { column_id: item.id, order: index + 1 };
            });
            this.active = null;
            this.dataService
                .setDataColumnOrder({ order_list: newOrderData })
                .subscribe((_resp: DataColumn[]) => {
                    const cols = _resp.filter(col => !col.parent_id);
                    this.store.dispatch(new GetColumns(cols));
                });
        }
    }

    // scrollDetect(evt) {
    //     if (!evt) { return; }
    //     this.slideLeft = evt.target.scrollLeft + 10;
    //     this.changeDetectorRef.detectChanges();
    // }

    // offset(el) {
    //     const rect = el.getBoundingClientRect(),
    //         scrollLeft =
    //             window.pageXOffset || document.documentElement.scrollLeft,
    //         scrollTop =
    //             window.pageYOffset || document.documentElement.scrollTop;
    //     return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    // }
    ngAfterViewInit() {}
}
