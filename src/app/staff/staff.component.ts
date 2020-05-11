import * as fromStaff from './state';
import * as moment from 'moment';

import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {GetStaffLists, SetLoadedStafflist} from '../redux/staff/staff.action';
import { LoadStaff, LoadStaffList, SelectStaffList } from './state/actions/staff.actions';
import {MatDialog, Sort} from '@angular/material';
import { Observable, forkJoin } from 'rxjs';
import {Store, select} from '@ngrx/store';
import { map, tap } from 'rxjs/operators';

import {AppState} from '../redux/app.state';
import {Departament} from '../models/hospital-departments';
import { DialogOverviewComponent } from '../common/dialogOverview/dialogOverview.component';
import {Hospital} from '../models/hospital';
import {MultyUploadComponent} from './multyupload/multyupload.component';
import {NewMemberComponent} from './new-member/new-member.component';
import {NewStaffListComponent} from './new-staff-list/new-staff-list.component';
import {NotifyService} from '../services/notify.service';
import { PrivilegesComponent } from '../common/privileges/privileges.component';
import {Profile} from '../models/profile';
import {Role} from '../models/roles';
import {Router} from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import {SortByPipe} from '../pipe/sort.pipe';
import { StaffList } from '../models/staff-list';
import {StaffService} from './service/staff.service';
import { ViewProfileComponent } from './view-profile/view-profile.component';

export enum ProvidersListType {
    Pending = 'Pending Providers',
    All = 'All Providers',
    Custom = 'Custom'
}

@Component({
    selector: 'idr-staff',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
    public myProfile: Profile;
    public val: boolean;
    public header: string[] = ['Name', 'QTY', 'Edited'];
    public teamList: any[] = [];
    private members: Profile[] = [];
    public listHeaderSingle: string[] = [
        'First Name',
        'Mid Name',
        'Last Name',
        'H.Dep',
        'Role',
        'Job'
    ];
    public teamListSingle: Object[] = [];
    private roles: Role[] = [];
    private hospital_department: Departament[] = [];
    public checkedTitle = '';
    public spinner = true;
    public loadProfile = false;
    public selectedUser: Object;
    private hospitals: Hospital[];
    private userHospital: Hospital;
    private editableListid: number;
    public myRole: boolean;

    public search: string;
    public listTypes = ProvidersListType;

    public searchListKeyword = '';
    public searchTableKeyword = '';

    public staffList$ = this.store.select(fromStaff.staffList);
    public staffTable$ = this.store.pipe(
        select(fromStaff.staffTable),
        tap(data => this.dataSource = data),
    );

    public dataSource = [];
    public _dataSource: Observable<any> = new Observable<any>();

    displayedColumns: string[] = [
        'select',
        'Name',
        'OnDuty',
        'OnCall',
        'Video',
        'Department',
        'Role',
        'Actions',
    ];



    // The one who wrote API was fired, shame too late
    public providersList$ = this.store.select('staffPage')
        .pipe(
            map(data => {
                let allList = [];
                let customList = [];
                let pendingList = [];

                // Extract all providers
                if (data['loadedList'] && data['loadedList'][0]) {
                    allList = data['loadedList'][0].participants;
                }

                // Extract custom & pended providers list with participants as list of ID's
                if (data['staffLists'] && data['staffLists'].length > 0) {

                    // Extract custom providers list
                    customList = data['staffLists'].filter(item => item.id > 0);

                    // Replace id with actual person entiry
                    customList.forEach(item => {
                        const participants = [];
                        item.participants.forEach(id => {
                            participants.push(allList.find(person => person.remote_id === id));
                        });
                        item.participants = participants;
                    });

                    // Extract pended list (array)
                    pendingList = data['staffLists']
                        .filter(item =>
                            item['default'] &&
                            item['default'].pended_users &&
                            item['default'].pended_users.participants &&
                            item['default'].pended_users.participants.length > 0
                        )
                        .map(item => item['default'].pended_users.participants);

                    // Replace id with actual person entiry
                    const pendingParticipants = [];
                    pendingList.forEach(item => {
                        item.forEach(id => {
                            pendingParticipants.push(allList.find(person => person.remote_id === id));
                        });
                    });
                    pendingList = pendingParticipants;


                }
                return {
                    pending: pendingList,
                    all: allList,
                    custom: customList
                };

            })
        );

    public selectedListType: ProvidersListType;
    public selectedList = this.store.pipe(
        select(fromStaff.selectedStaffList),
        tap(data => this._selectedList = data)
    );
    _selectedList: any;

    selection = new SelectionModel<any>(true, []);

    customForm: FormGroup;

    constructor(public dialog: MatDialog,
                private staffService: StaffService,
                private notify: NotifyService,
                private store: Store<AppState>,
                private sort: SortByPipe,
                private renderer: Renderer2,
                private el: ElementRef,
                private router: Router,
                private fb: FormBuilder,
        ) {
    }

    hasErrors(errors) {
        return this.customForm.errors;
    }

    submitForm() {
        console.log('SUBMIT:', this.customForm.valid, this.customForm.errors);
    }

    ngOnInit() {
        this.store.select('profilePage')
            .map(data => data.profile)
            .subscribe((_profile: Profile) => {
                this.myProfile = _profile;
            });

        this.customForm = this.fb.group({
            title: [null, [
                Validators.required,
                Validators.maxLength(3),
            ]],
        });

        this.store.dispatch(new LoadStaffList());

        const today = new Date();
        const yesterday = moment(today.setDate(today.getDate() - 1)).format('DD/MM/YYYY');
        this.teamListSingle = [];

        this.store.select('hospitalsPage').subscribe((hp) => {

            if (!hp) { return; }
            this.hospitals = hp.hospitals;
            this.hospitals.forEach(h => {
                this.hospital_department.push(...h.hospital_department);
            });
            this.store.select('profilePage').map(data => data.profile).subscribe((_profile: Profile) => {
                this.myRole = _profile.is_admin;
                this.userHospital = this.hospitals[_profile.hospital - 1];
            });
        });

        this.store.select('rolesPage').subscribe((_roles) => {
            this.roles = _roles.roles;

        });

        this.store.select('staffPage').subscribe((data) => {


            if (data['loadedList'] && data['loadedList'][0]) {
                this.teamListSingle = data['loadedList'][0].participants;
                this.checkedTitle = data['loadedList'][0].title;
            } else if (data['loadedList'] && !data['loadedList'].length) {
                this.teamListSingle = undefined;
            }

            if (!data['staffLists']) { return; }

            const defaultLists: any[] = [];
            const datePat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
            const temp = data['staffLists'].filter(x => {
                if (x.hasOwnProperty('default')) {
                    for (const prop in x['default']) {
                        let title: string;
                        switch (prop) {
                            case 'all_users':
                                title = 'All Members';
                                break;
                            case 'pended_users':
                                title = 'Pended Users';
                                break;
                        }
                        defaultLists.push({
                            'qty': x['default'][prop].participants.length,
                            'title': title,
                            'participants': x['default'][prop].participants
                        });
                    }
                    return;

                } else {
                    x['qty'] = x['participants'].length;
                    const tempD = moment(x.update_time).format('X');
                    if (!x.update_time.match(datePat) && x.update_time !== 'yesterday') {
                        x.update_time = moment(tempD, 'X').format('DD/MM/YYYY');
                        if (yesterday === x.update_time) {
                            x.update_time = 'yesterday';
                        }
                    }
                    return x;
                }
            });

            this.teamList = [...temp, ...defaultLists];

        });
        this.checkMembers();
    }

    getListName(listItem) {
        if (listItem) {
            return listItem.title;
        }
        // if(this.selectedListType === ProvidersListType.Custom) {
        //     return this.selectedList.title;
        // }
        // return this.selectedListType;
    }

    selectList(listItem) {
        this.store.dispatch(new SelectStaffList(listItem));
    }

    sortData(sort: Sort) {

    }

    deleteBulk() {

        const totalToDelete = this.selection.selected.length;

        const dialogRef = this.dialog
            .open(DialogOverviewComponent, {
                width: '342px',
                data: {
                    header: `Delete`,
                    body: `Are you sure you want to delete ${totalToDelete} member(s)?`
                }
            })
            .afterClosed()
            .subscribe(result => {
                if (result) {
                    const buik = [];
                    this.selection.selected.forEach((person) => {
                        if (this.myProfile.id !== person.id) {
                            buik.push(this.staffService.deleteUser(person.id));
                        }
                    });

                    forkJoin(buik).subscribe(() => {
                        this.store.dispatch(new LoadStaffList());
                        this.selection.clear();
                    });
                }
            });
    }

    deletePerson(person) {

        // Prevent deleting myself
        if (person.id === this.myProfile.id) {
            this.notify.notifyError('Cannot delete yourself');
            return;
        }

        this.dialog
            .open(DialogOverviewComponent, {
                width: '342px',
                data: {
                    header: `Delete`,
                    body: `Are you sure you want to delete \n ${person.first_name} ${person.last_name}?`
                }
            })
            .afterClosed()
            .subscribe(result => {
                if (result) {
                    this.staffService.deleteUser(person.id).subscribe((_d) => {
                        this.store.dispatch(new LoadStaffList());
                        // this.store.dispatch(new DeleteFromList({user_id: person.id, list_id: this.list_id}));
                    });
                }
            });
    }

    setPermissions(person) {
        this.staffService.getMemberPermissions(person.remote_id).subscribe((_permissions) => {
            this.dialog.open(PrivilegesComponent, {
                data: {
                    header: 'Update User Privilege',
                    canChanged: !this.myRole,
                    _permissions: _permissions,
                    id: person.remote_id
                }
            });
        });
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(items) {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.forEach(row => this.selection.select(row));
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.length;
        return numSelected === numRows;
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

    checkValue(item) {

    }

    checkMembers() {
        this.store.select('membersPage').subscribe((_allmembers) => {

            if (!_allmembers) { return; }
            this.members = _allmembers.members;
            if (!this.members || !this.members.length) { return; }
            this.staffService.getStaffList().subscribe((_staffLists: StaffList[]) => {


                if (this.checkedTitle === 'Pended Users' && _staffLists) {
                    this.onChooseData({
                        participants: _staffLists[_staffLists.length - 1]['default']['pended_users']['participants'],
                        qty: _staffLists[_staffLists.length - 1]['default']['pended_users']['participants'].length,
                        title: 'Pended Users'
                    });
                }

                this.store.dispatch(new GetStaffLists(_staffLists));
                this.spinner = false;
            }, err => {
                this.spinner = false;
                this.notify.notifyError(err);
            });
        });
    }

    multipleUpload() {
        const dialogRef = this.dialog.open(MultyUploadComponent, {
            width: '768px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.ngOnInit();
            }
        }, err => this.notify.notifyError(err));
    }

    newMember(): void {
        this.dialog.open(NewMemberComponent, {
            width: '768px',
            data: {
                header: 'Add New Member',
                hospital: this.userHospital
            }
        });
    }

    newList(): void {
        this.dialog.open(NewStaffListComponent, {
            width: '768px',
            data: {
                header: 'Create new list',
                ok: 'Save'
            }
        });
    }

    editList(element): void {
        this.dialog.open(NewStaffListComponent, {
            width: '768px',
            data: {
                header: 'Edit list',
                edit: true,
                id: element.id
            }
        });
    }

    showProfile(data: Profile): void {
        this.dialog.open(ViewProfileComponent, {
            width: '1024px',
            data: {
                header: 'Edit list',
                edit: true,
                data: data
            }
        });
    }

    onChooseData(data): void {


        this.closeProfile(false);
        this.editableListid = data.id;
        let teamList: any[] = [];
        if (!this.members) { return; }

        if (typeof data.participants[0] === 'object') {
            data.participants = data.participants.map(x => x.remote_id);
        }

        teamList = this.members.filter((x: Profile) => {
            return data.participants.find(y => y === x.remote_id);
        });
        if (teamList.length) {
            teamList.map(x => {
                const role = this.roles.filter(y => y.id === x.hospital_role);
                const hdep = this.hospital_department.filter(y => y.id === x.hospital_department);
                if (role.length) { x.hospital_role = role[0].title; }
                if (hdep.length) { x.hospital_department = hdep[0].title; }
                return x;
            });
        }
        this.store.dispatch(new SetLoadedStafflist({participants: teamList, title: data.title}));
    }

    selectUser(data: Profile): void {
        if (!data) { return; }
        this.loadProfile = true;
        this.selectedUser = data;
    }

    closeProfile(value: boolean): void {
        this.loadProfile = value;
    }

    toggleLists(val) {
        if (val) {
            this.renderer.addClass(this.el.nativeElement, 'slide');
            this.renderer.addClass(document.body, 'hidden');
        } else {
            this.renderer.removeClass(this.el.nativeElement, 'slide');
            this.renderer.removeClass(document.body, 'hidden');
        }
    }
}
