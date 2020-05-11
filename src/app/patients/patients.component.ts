import * as fromPatients from './state';
import * as moment from 'moment';

import {
    AddPatlist,
    DeletePatlist,
    UpdateChosenPatientList,
    UpdateMyPatientStatus
} from '../redux/patientsList/patientsList.action';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import {
    Component,
    ElementRef,
    OnInit,
    Pipe,
    PipeTransform,
    Renderer2,
    ViewChild
} from '@angular/core';
import { DeletePatientFromAll, GetPatients } from '../redux/patients/patients.action';
import {
    GetPatientsLists,
    SetChosenPatientList
} from '../redux/patientsList/patientsList.action';
import { MatDialog, MatTableDataSource, Sort } from '@angular/material';
import { RemovePatientFromParticipantList, TogglePatientStatus, UpdateUserParticipantList } from '../redux/profile/profile.action';
import { Store, select } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs/operators';

import { AppState } from '../redux/app.state';
import { DialogOverviewComponent } from '../common/dialogOverview/dialogOverview.component';
import { HidePatient } from './state/actions/patients.actions';
import { LoadPatientsList } from './state/actions/patients.actions';
import { MultyUploadComponent } from './multyupload/multyupload.component';
import { NewMemberComponent } from './new-member/new-member.component';
import { NewPatListComponent } from './new-pat-list/new-pat-list.component';
import { NotifyService } from '../services/notify.service';
import { Patient } from '../models/patient';
import { PatientsList } from '../models/patients-list';
import { PatientsService } from './services/patients.service';
import { SelectionModel } from '@angular/cdk/collections';
import { State } from './state/reducers';

export enum PatientsListType {
    MyPatients = 'My Patients',
    AllPatients = 'All Patients',
    Custom = 'Custom'
}

@Component({
    selector: 'idr-patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
    @ViewChild('idr-patients') patientWrap: ElementRef;

    public searchText = '';
    private visibilityColName = 'Visibility';

    // sortedData: PeriodicElement[];
    displayedColumns: string[] = [
        'select',
        'Name',
        'DOB',
        'Age',
        'MRN',
        'Visibility',
        'Actions',
    ];
    // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<any>(true, []);

    public search = '';
    public header: string[] = ['Name', 'QTY', 'Edited'];
    public patientLists: any[];

    private patients: Patient[];
    public listHeaderSingle: string[] = [
        'First Name',
        'Mid Name',
        'Last Name',
        'DOB',
        'Age'
    ];
    public spinner = true;
    public loadProfile = false;
    public chosedProfile: Patient;
    public myRole: boolean;
    public editableListId: number;
    public chosenPatientListTitle = 'My Patients';
    private myPatientsObj: {};
    public patientsListSingle: Object[] = [];
    public combinedPatientLists: any[] = [];
    val = false;

    public searchListKeyword = '';
    public searchPatientKeyword = '';

    // DATA: All Patients
    public allPatients$ = this.store2.pipe(
        select(fromPatients.getPatients),
        tap(q => this.setDataSource())
    );

    // DATA: Custom Patients List
    public patientsList$ = this.store2.pipe(
        select(fromPatients.getPatientsList),
        map(data => {
            return data;
            //return data.filter(item => item.title.toLowerCase().startsWidth(this.searchListKeyword));
        }),
        tap(q => this.setDataSource())
    );

    // DATA: My Patients
    public myPatients$ = this.store
        .select('profilePage')
        .pipe(
            map(data => {
                if (data.profile.my_patients_list_participants) {
                    return data.profile.my_patients_list_participants.map(item => {
                        return Object.assign(item.patient, { show: item.show });
                    });
                }
            }),
            tap(q => this.setDataSource())
        );


    public selectedListType = PatientsListType.MyPatients;
    public listTypes = PatientsListType;
    public selectedList: any;
    public _dataSource: Observable<any> = new Observable<any>();


    constructor(
        public dialog: MatDialog,
        private patientsService: PatientsService,
        public store: Store<AppState>,
        public store2: Store<State>,
        private renderer: Renderer2,
        private el: ElementRef,
        private notify: NotifyService
    ) {
        // Load patients list for left column
        this._dataSource = this.myPatients$;
        this.store2.dispatch(new LoadPatientsList());
    }

    ngOnInit() {

        // Get patients ...
        this.store
            .select('patientsPage')
            .subscribe(_patientsStore => {
                this.patients = _patientsStore.patients;
                console.log('this.patients', this.patients)
                if (!this.patients.length) {
                    return;
                }
                this.patientsService.getPatList().subscribe(
                    (_patLists: any) => {
                        if (!_patLists[_patLists.length - 1]['all_patients']) {
                            return;
                        }
                        console.log('_patLists', _patLists)
                        this.patientLists = _patLists;
                        this.generatePatientLists();
                    },
                    err => {
                        this.notify.notifyError(err);
                    }
                );
            });

        // Get user profile to retrive My Patients
        this.store
            .select('profilePage')
            .pipe(
                tap(data => console.log('data', data))
            )
            .map(x => x.profile)
            .subscribe(_profile => {

                this.myRole = _profile.is_admin;

                if (!_profile['my_patients_list_participants']) {
                    return;
                }

                const myPatients = _profile['my_patients_list_participants'].map(x => {
                    return Object.assign(x.patient, { show: x.show }); // obsolete {id: x.id, show: x.show}
                });

                this.myPatientsObj = {
                    title: 'My Patients',
                    participants: myPatients
                };

                this.generatePatientLists();
            });

        // Filter Patients by selection list
        this.store.select('patListPage').subscribe(data => {
                console.log('patListPage data', data)

            if (data['chosenList'] && data['chosenList'][0]) {

                this.patientsListSingle = data['chosenList'][0].participants;
                this.chosenPatientListTitle = data['chosenList'][0].title;

            } else if (data['chosenList'] && !data['chosenList'].length) {

                this.patientsListSingle = undefined;

            }

            this.combinedPatientLists = data['patientsLists'];
            this.patientLists = this.combinedPatientLists.slice(1);
            console.log('this.patientLists', this.patientLists)
        });
    }

    setDataSource() {
        switch(this.selectedListType){
            case PatientsListType.MyPatients:{
                this._dataSource = this.myPatients$;
                break;
            }
            case PatientsListType.AllPatients:{
                this._dataSource = this.allPatients$;
                break;
            }
            case PatientsListType.Custom:{
                this._dataSource = this.patientsList$.pipe(
                    map(data => {
                        const list = data.filter(q => q.id === this.selectedList.id);
                        return list.map(q => q.participants)[0];
                    }),
                );
                break;
            }
        }
    }

    filterPeople(keyword) {

    }

    selectPatientsList(listType: PatientsListType, patientsList?: any) {
        this.selectedListType = listType;
        this.selectedList = null;
        switch(listType){
            case PatientsListType.MyPatients:{
                this._dataSource = this.myPatients$;
                break;
            }
            case PatientsListType.AllPatients:{
                this._dataSource = this.allPatients$;
                break;
            }
            case PatientsListType.Custom:{
                this.selectedList = patientsList;
                this._dataSource = of(this.selectedList.participants);
                break;
            }
        }
    }

    deletePerson(person) {
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            width: '342px',
            data: {
                header: `Remove Patient`,
                body: `Are you sure you want to remove \n ${person.first_name} ${person.last_name}?`
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

                this._dataSource
                    .pipe(
                        map(list => {
                            return list
                                .map(p => p.remote_id)
                                .filter(remote_id => remote_id !== person.remote_id)
                        }),
                        take(1)
                    ).subscribe(idList => {

                        switch(this.selectedListType){
                            case this.listTypes.MyPatients: {
                                this.updateMyPatientsList(idList);
                                break;
                            }
                            case this.listTypes.AllPatients: {
                                // Delete patient
                                // this.updatePatientsList(idList);
                                this.deletePatient(person.remote_id);
                                break;
                            }
                            case this.listTypes.Custom: {
                                this.updatePatientsList(idList);
                            }
                        }
                    });
            }
        });

    }

    updateMyPatientsList(idList) {
        this.patientsService
            .setMyPatientList(idList).subscribe((_resp) => {
                this.store.dispatch(new UpdateUserParticipantList(_resp['my_patients_list_participants']));
            });
    }

    updatePatientsList(idList) {
        this.patientsService
            .updateSingleList(
                {
                    participants: idList,
                    title: this.selectedList.title
                },
                this.selectedList.id
            )
            .subscribe((_resp: PatientsList) => {
                this._dataSource = of(_resp.participants);
                this.store.dispatch(new LoadPatientsList());
                this.store.dispatch(new UpdateChosenPatientList(_resp));
            });
    }

    deletePatient(remote_id) {
        this.patientsService
            .deletePatient(remote_id).subscribe((_d) => {
                this.store.dispatch(new LoadPatientsList());
                this.store.dispatch(new RemovePatientFromParticipantList(remote_id));
                this.store.dispatch(new DeletePatientFromAll(remote_id));
            }, err => {
                this.notify.notifyError(err);
            });
    }

    getPatientListName() {
        if(this.selectedListType === PatientsListType.Custom){
            return this.selectedList.title;
        }
        return this.selectedListType;
    }

    checkValue(item) {
        console.log('==============check value item', item);
    }


    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        // const numSelected = this.selection.selected.length;
        // const numRows = this.dataSource.data.length;
        // return numSelected === numRows;
        return false;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        // this.isAllSelected()
        //     ? this.selection.clear()
        //     : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${
            this.selection.isSelected(row) ? 'deselect' : 'select'
        } row ${row.position + 1}`;
    }

    toggleVisibility($event, person){
        this.store2.dispatch(new HidePatient(person.id, !$event.checked));
        this.store.dispatch(new UpdateMyPatientStatus({id: person.id, status: !$event.checked}));
        this.store.dispatch(new TogglePatientStatus(person.id));
    }

    sortData(sort: Sort) {
        // const data = ELEMENT_DATA.slice();
        // if (!sort.active || sort.direction === '') {
        //     this.sortedData = data;
        //     return;
        // }
        // console.log('---- sort', sort, data);
        // this.sortedData = data.sort((a, b) => {
        //     const isAsc = sort.direction === 'asc';
        //     switch (sort.active) {
        //         case 'name':{
        //             const res = compare(a.name, b.name, isAsc);
        //             console.log('res', res)
        //             return res;
        //         }
        //         case 'symbol':
        //             return compare(a.symbol, b.symbol, isAsc);
        //         case 'weight':{
        //             console.log('a.weight', a.weight, b.weight)
        //             const res = compare(a.weight, b.weight, isAsc);
        //             console.log('res', res)
        //             return res;
        //         }
        //         default:
        //             return 0;
        //     }
        // });
    }

    changeSearch($event) {}

    generatePatientLists() {
        if (
            !this.myPatientsObj ||
            !this.chosenPatientListTitle ||
            !this.patientLists
        ) {
            return;
        }
        this.store.dispatch(
            new GetPatientsLists([this.myPatientsObj, ...this.patientLists])
        );

        if (this.chosenPatientListTitle === 'My Patients' && !this.spinner) {
            this.onChooseData(this.myPatientsObj);
        }

        this.spinner = false;
    }

    onChooseData(data): void {
        if (!data) {
            return;
        }
        this.closeProfile(false);
        this.editableListId = data.id;
        if (!this.patients) {
            return;
        }
        this.store.dispatch(
            new SetChosenPatientList({
                participants: data.participants,
                title: data.title
            })
        );
    }

    newList(): void {
        this.dialog.open(NewPatListComponent, {
            width: '750px',
            data: {
                header: 'Create new list',
                ok: 'Save'
            }
        });
    }

    chosedPfData(data: Patient): void {
        if (!data) {
            return;
        }
        this.loadProfile = true;
        this.chosedProfile = data;
    }

    closeProfile(value: boolean): void {
        this.loadProfile = value;
    }

    multipleUpload() {
        const dialogRef = this.dialog.open(MultyUploadComponent, {
            width: '750px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.patientsService.getAllPatients().subscribe(
                    (_patients: Patient[]) => {
                        this.store.dispatch(new GetPatients(_patients));
                    },
                    err => {
                        this.notify.notifyError(err);
                    }
                );
            }
        });
    }

    newMember() {
        this.dialog.open(NewMemberComponent, {
            width: '750px',
            data: {
                header: 'Add New Member'
            }
        });
    }

    editPatientsList(): void {
        const data = {
            header: 'Edit list',
            edit: true,
            id: this.selectedList ? this.selectedList.id : null
        };

        if(this.selectedListType === this.listTypes.MyPatients) {
            data.id = 'My Patients';
        }

        this.dialog.open(NewPatListComponent, {
                width: '750px',
                data: data
            })
            .afterClosed()
            .subscribe((result) => {
                if(result > 0) {
                    this.store.dispatch(new LoadPatientsList());
                }
            });

        // if (this.chosenPatientListTitle !== 'My Patients') {
        //     this.dialog.open(NewPatListComponent, {
        //         width: '750px',
        //         data: {
        //             header: 'Edit list',
        //             edit: true,
        //             id: this.editableListId
        //         }
        //     });
        // } else {
        //     this.dialog.open(NewPatListComponent, {
        //         width: '750px',
        //         data: {
        //             header: 'Edit list',
        //             edit: true,
        //             id: 'My Patients'
        //         }
        //     });
        // }
    }

    editList(): void {
        if (this.chosenPatientListTitle !== 'My Patients') {
            this.dialog.open(NewPatListComponent, {
                width: '750px',
                data: {
                    header: 'Edit list',
                    edit: true,
                    id: this.editableListId
                }
            });
        } else {
            this.dialog.open(NewPatListComponent, {
                width: '750px',
                data: {
                    header: 'Edit list',
                    edit: true,
                    id: 'My Patients'
                }
            });
        }
    }

    deleteCreatedList(list) {
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            width: '400px',
            data: {
                header: 'Delete patient list',
                body: `Are you sure you want to delete "${list.title}" list?`
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.patientsService.removeList(list.id).subscribe(
                    resp => {
                        this.store.dispatch(new DeletePatlist(list.id));
                    },
                    err => {
                        this.notify.notifyError(err);
                    }
                );
            }
        });
    }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Pipe({name: 'hasId'})
export class HasIdPipe implements PipeTransform {

    transform(patientsList: any[]): any[] {
        patientsList.find(q => q.all_patients);
        return ;
        // if (patientsList) {
        //     return patientsList.filter((template: any) => template.category === category.id);
        // }
    }
}
