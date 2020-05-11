import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    Renderer2,
    ViewChild
} from '@angular/core';
import {DeleteFromList, DeletePendedMember} from '../../redux/staff/staff.action';
import {
    RemovePatientFromParticipantList,
    TogglePatientStatus,
    UpdateUserParticipantList
} from '../../redux/profile/profile.action';
import {
    UpdateChosenPatientList,
    UpdateMyPatientStatus
} from '../../redux/patientsList/patientsList.action';

import {AppState} from '../../redux/app.state';
import {DeletePatientFromAll} from '../../redux/patients/patients.action';
import {DialogOverviewComponent} from '../dialogOverview/dialogOverview.component';
import {FilterPipe} from '../../pipe/filter.pipe';
import { HidePatient } from 'src/app/home/state/actions/home.actions';
import {MatDialog} from '@angular/material';
import {NotifyService} from '../../services/notify.service';
import { PatientBase } from 'src/app/models/patient-base';
import { PatientsList } from 'src/app/models/patients-list';
import {PatientsService} from '../../patients/services/patients.service';
import {PrivilegesComponent} from '../privileges/privileges.component';
import {SelectPipe} from '../../pipe/select.pipe';
import {SortByPipe} from '../../pipe/sort.pipe';
import {StaffService} from '../../staff/service/staff.service';
import {Store} from '@ngrx/store';

@Component({
    selector: 'idr-sortable-list',
    templateUrl: './sortable-list.component.html',
    styleUrls: ['./sortable-list.component.scss']
})
export class SortableListComponent implements OnInit, OnChanges {

    @Input() listHeader = [];
    @Input() listData = [];
    @Input() className;
    @Input() typeName = '';
    direc = false;
    selectedItem = {
        title: 'My Patients'
    };
    pages;
    temp;
    public start = 0;
    public end = 10;
    maxPages = 10;
    searchText;
    tempTitle;
    public id = localStorage.getItem('idrUserId');
    @Output() chosedData = new EventEmitter<any>();
    @Input() searchHolder = 'Search text';
    @Input() keys = [];
    @Input() myRole?;
    @Input() list_id?;
    @Input() listTitle = '';
    activeaPage;
    slideLeft = 5;
    disableClick = true;

    constructor(public dialog: MatDialog,
        private sort: SortByPipe,
        private filter: FilterPipe,
        public el: ElementRef,
        private store: Store<AppState>,
        private staffService: StaffService,
        private patService: PatientsService,
        private changeDetectorRef: ChangeDetectorRef,
        private ref: ChangeDetectorRef,
        public renderer: Renderer2,

        private notify: NotifyService) {
    }

    ngOnInit() {
        if (!this.listData || !this.listData.length) { return; }
        this.pages = Math.ceil((this.listData.length / this.maxPages));
        this.temp = this.listData;
        this.start = 0;
    }

    changeStatuspat(status, row) {
        this.store.dispatch(new HidePatient(row['id'], !status.checked));
        // this.patService.patientShow(!status.checked, id).subscribe((resp: any) => {
        this.store.dispatch(new UpdateMyPatientStatus({id: row['id'], status: !status.checked}));
        this.store.dispatch(new TogglePatientStatus(row['id']));
        // });
    }

    ngOnChanges() {
        if (!this.listData || !this.listData.length) { return; }
        if (this.tempTitle !== this.listTitle) {

            this.start = 0;
            this.end = this.maxPages;
            this.temp = this.listData;
            this.tempTitle = this.listTitle;

            if (!this.listData.length) { return; }
            if (this.className === 'tableList') {

                this.pages = Math.ceil((this.listData.length / this.maxPages));

                if (this.searchText) {
                    this.pages = Math.ceil((this.filter.transform(this.listData, this.keys, this.searchText).length / this.maxPages));
                }
            } else {

                if (this.typeName === 'stafflist') {
                    this.store.select('staffPage').subscribe((data) => {
                        if (!data['loadedList']) { return; }
                        if (data['loadedList'] && !data['loadedList'].length) {
                            if (this.listData.length) {
                                const allmembersList = this.listData.filter(x => x.title === 'All Members');
                                this.getData(allmembersList[0]);
                            }
                        }
                    });
                    this.listData = this.sort.transform(this.listData, this.keys[0], this.direc, 'id');

                } else if (this.typeName === 'patients') {

                    this.store.select('patListPage').subscribe((data) => {
                        if (data['chosenList'] && !data['chosenList'].length) {
                            if (this.listData) {
                                const allmembersList = this.listData.filter(x => x.title === 'My Patients');
                                if (!allmembersList.length) { return; }
                                this.getData(allmembersList[0]);
                            }
                        }
                    });
                }
            }
        } else {
            if (!this.listData.length) { return; }
            if (this.className === 'tableList') {

                this.pages = Math.ceil((this.listData.length / this.maxPages));

                if (this.searchText) {
                    this.pages = Math.ceil((this.filter.transform(this.listData, this.keys, this.searchText).length / this.maxPages));
                }
            }
        }
        if (this.className !== 'tableList') {
            this.listData = this.sort.transform(this.listData, this.keys[0], this.direc, 'id');
        }
    }

    sortable(index) {
        if (this.keys[index] === 'update_time') { return; }
        this.direc = !this.direc;
        this.listData = this.sort.transform(this.listData, this.keys[index], this.direc, 'id');
    }

    getData(data) {
        this.selectedItem = data;
        this.chosedData.emit(data);
    }

    deleteRow(index, id) {
        let deleteTitle: string;
        this.typeName === 'patients' ? deleteTitle = 'patient' : deleteTitle = 'user';
        const typeDelete = (this.listTitle === 'All Patients' || this.listTitle === 'All Members') ? 'archive' : 'delete';
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            width: '342px',
            data: {
                header: `${typeDelete} ${deleteTitle}`,
                body: `Are you sure you want to ${typeDelete} \n ${this.listData[index].first_name} ${this.listData[index].last_name}?`
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.listData.splice(index, 1);

                this.pages = Math.ceil((this.listData.length / this.maxPages));

                if (this.activeaPage >= this.pages) {
                    this.activePage(this.pages - 1);
                }
                if (this.listTitle === 'Pended Users') {
                    this.staffService.deleteUser(id).subscribe((_d) => {
                        this.store.dispatch(new DeletePendedMember({user_id: id, list_title: this.listTitle}));
                    });
                } else if (this.listTitle === 'My Patients') {
                    const filtredPatients = [];
                    this.listData.forEach((el) => {
                        if (el.remote_id !== id) {
                            filtredPatients.push(el.remote_id);
                        }
                    });
                    this.patService.setMyPatientList(filtredPatients).subscribe((_resp) => {
                        this.store.dispatch(new UpdateUserParticipantList(_resp['my_patients_list_participants']));
                    });
                } else if (this.listTitle === 'All Patients') {
                    this.patService.deletePatient(id).subscribe((_d) => {
                        this.store.dispatch(new RemovePatientFromParticipantList(id));
                        this.store.dispatch(new DeletePatientFromAll(id));
                    }, err => {
                        this.notify.notifyError(err);
                    });
                } else {
                    if (this.typeName === 'stafflist') {
                        this.staffService.deleteSelf(this.list_id).subscribe((_d) => {
                            this.store.dispatch(new DeleteFromList({user_id: id, list_id: this.list_id}));
                        });
                    } else {
                        const filtredPatients = [];

                        this.listData.forEach((el) => {
                            if (el.remote_id !== id) {
                                filtredPatients.push(el.remote_id);
                            }
                        });
                        this.patService.updateSingleList({
                            participants: filtredPatients,
                            title: this.listTitle
                        }, this.list_id).subscribe((_resp: PatientsList) => {
                            this.store.dispatch(new UpdateChosenPatientList(_resp));
                        });
                    }
                }
            }
        });

    }

    scrollDetect(evt) {
        if (!evt) { return; }
        this.slideLeft = evt.target.scrollLeft + 10;
        this.changeDetectorRef.detectChanges();
    }

    activePage(i) {

        this.activeaPage = i;
        this.start = i * this.maxPages;

        this.end = (i + 1) * this.maxPages;
    }

    filterUsers(searchText) {
        if (this.className === 'tableList') {
            this.pages = Math.ceil((this.filter.transform(this.listData, this.keys, searchText).length / this.maxPages));
        }
    }

    setPrivileges(id) {
        this.disableClick = false;
        this.staffService.getMemberPermissions(id).subscribe((_permissions) => {
            this.disableClick = true;
            this.dialog.open(PrivilegesComponent, {
                data: {
                    header: 'Update User Privilege',
                    canChanged: !this.myRole,
                    _permissions: _permissions,
                    id: id
                }
            });
        });
    }
}
