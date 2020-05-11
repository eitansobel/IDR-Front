import * as fromActions from './state/actions/home.actions';
import * as fromHome from './state';

import { ActivatedRoute, NavigationEnd, Params, Router, UrlSegment } from '@angular/router';
import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
    ChangeChatsReadStatus,
    CopyNestedColumn,
    EditNestedCell,
    GetHomePatients,
    GetNestedColumns,
    HideNestedColumn,
    HomeHidePatientFolders,
    MyPatients,
    PatientBaseList,
    SelectedFolder,
    SelectedPatient,
    SelectedProvider,
    SetPatientPage,
    UpdateMyPatient,
    Updates
} from '../redux/home/home.actions';
import { HomePatient, NestedColumn } from '../models/home';
import { Store, select } from '@ngrx/store';
import { exhaustMap, filter, map } from 'rxjs/operators';

import { AppState } from '../redux/app.state';
import { BaseComponent } from '../common/base/base.component';
import { Chat } from '../models/chat';
import { ChatService } from '../messages/services/chat.service';
import { DataColumn } from '../models/data-columns';
import { DataColumnPopupComponent } from '../data-columns/data-column-popup/data-column-popup.component';
import { DataColumnsService } from '../data-columns/services/data-columns.service';
import { DataColumnsUpdateIntervalMapService } from '../data-columns/services/data-columns-update-interval-map.service';
import { DialogOverviewComponent } from '../common/dialogOverview/dialogOverview.component';
import { DomSanitizer } from '@angular/platform-browser';
import { EditCellPopupComponent } from './edit-cell-popup/edit-cell-popup.component';
import { HomeService } from './services/home.service';
import { MatDialog } from '@angular/material';
import { MyPatient } from '../models/my-patients';
import { NgScrollbar } from 'ngx-scrollbar';
import { NotifierService } from 'angular-notifier';
import { NotifyService } from '../services/notify.service';
import { Pages } from '../models/pages';
import { Patient } from '../models/patient';
import { PatientBase } from '../models/patient-base';
import { PatientFolder } from '../models/patient-folder';
import { PatientPage } from '../models/patient-page';
import { PatientsService } from '../patients/services/patients.service';
import { Refresh } from './state/actions/home.actions';
import { RouterService } from '../services/router.service';
import { SortPatientPopupComponent } from './sort-patient-popup/sort-patient-popup.component';
import { SortPatientsByPipe } from '../pipe/sortPatients.pipe';
import { State } from './state/reducers';
import { TogglePatientStatus } from '../redux/profile/profile.action';
import { Update } from '../models/update';
import { UpdateFolderSummary } from '../models/patient-folder-summary';
import { UpdateMyPatientStatus } from '../redux/patientsList/patientsList.action';
import { UpdatesService } from './services/updates.service';
import { UserPermissionService } from '../services/user-permission.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'idr-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [UpdatesService, RouterService]
})

export class HomeComponent extends BaseComponent implements OnInit, OnDestroy, AfterContentChecked {
    @ViewChild('tableSidebar') tableSidebar: ElementRef;
    @ViewChild('tableHeader') tableHeader: ElementRef;

    itemsTest$: Observable<any> = this.store2.pipe(
        select(fromHome.getState)
    );

    public allPatients$ = this.store.pipe(select(fromHome.getAllPatients));

    public patients$ = this.store.pipe(
        select(fromHome.getState),
        map(state => {
            if (state.sort) {
                return this.sort.transform(state.myPatients, state.sort.sortBy, state.sort.order);
            }
            return state.myPatients;
        })
    );
    public hideFolders$ = this.store.pipe(select(fromHome.getHideFolders));
    public updateFolders$ = this.store.pipe(select(fromHome.getUpdateFolders));
    public selectSubFolder$ = this.store.pipe(select(fromHome.getSelectedSubFolder));
    public selectPatient$ = this.store.pipe(select(fromHome.getSelectedPatient));

    public selectedPage: Pages;
    public updates: any[];

    public imageUrl: string = environment.settings.imageUrl;
    public nestedColumnList: NestedColumn[];
    public myPatients: MyPatient[];
    //public patientBaseList: PatientBase[];
    private patientColumnMap = {};
    public userId = Number(localStorage.getItem('idrUserId'));
    choosedChat = {
        id: null
    };
    sticky = false;
    showChatWindow = false;
    choosedPatient: number;
    public patientProfileData: Patient;
    public patientSearchText: string;
    public patientSearchKeys = ['first_name', 'last_name'];
    public showPatientProfile = false;
    public viewProfileIsEdited = true;
    public cellColorState = {};
    public selectedMyPatientId: number;
    //public selectedSubFolder: UpdateFolderSummary;
    private readonly notifier: NotifierService;
    // private routeParams = new BehaviorSubject<Params>(null);
    private routeParams: Params = null;

    private patient_sort_by;
    private patient_order;

    constructor(
        public dialog: MatDialog,
        private userPermissionService: UserPermissionService,
        private store: Store<AppState>,
        private store2: Store<State>,
        private chatService: ChatService,
        private sort: SortPatientsByPipe,
        private patientsService: PatientsService,
        private notify: NotifyService,
        private notifierService: NotifierService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private homeService: HomeService,
        private cdref: ChangeDetectorRef
    ) {
        super();
        this.notifier = notifierService;
        //this.patientBaseList = [];
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => {
                    let route = this.activatedRoute.firstChild;
                    let child = route;
                    while (child) {
                        if (child.firstChild) {
                            child = child.firstChild;
                            route = child;
                        } else {
                            child = null;
                        }
                    }
                    return route;
                }),
            )
            .subscribe((route: ActivatedRoute) => {
                if (route) {
                    this.routeParams = (route.params as BehaviorSubject<Params>).getValue();
                }
            });

        this.store.dispatch(new fromActions.LoadPatients());

        // this.itemsTest$.pipe(
        //     ).subscribe(q => {
        //         console.log('q', q);
        //     })

    }
    ngAfterContentChecked() {

        this.cdref.detectChanges();

    }

    ngOnInit() {

        // this.store
        //     .select('homePatientsPage')
        //     .subscribe(stored => {
        //         // const visibleMyPatients = stored.myPatients.filter(mp => mp.show);
        //         // this.myPatients = visibleMyPatients;
        //         //this.patientBaseList = stored.patientBaseList;
        //         //this.selectedSubFolder = stored.selectedSubFolder;
        //         //this.hideFolders = stored.hideFolders;
        //         // if (stored.markAllAsSeen) {
        //         //     this.markAllAsSeen();
        //         // }
        //     });

        // this.store
        //     .select('profilePage')
        //     .map(data => data.profile)
        //     .subscribe((_profile) => {
        //         this.patient_sort_by = _profile.patient_sort_by;
        //         this.patient_order = _profile.patient_order;
        //         this.getPatientBaseList();
        //     });

        // TODO: Cleanup obsolete MyPatients from api/doctor/<id>/
        // this.store
        //     .select('profilePage')
        //     .takeUntil(this.destroyed$)
        //     .subscribe(_profile => {
        //         if (!_profile.profile.my_patients_list_participants) { return; }

        //         const myPatients = _profile.profile.my_patients_list_participants;
        //         const myPatientsOrdered = this.sort.transform(myPatients, _profile.profile.patient_sort_by, _profile.profile.patient_order);
        //         this.store.dispatch(new MyPatients(myPatientsOrdered));

        //         // TODO: Prototype. Restore view state by url params
        //         // if (this.routeParams && this.routeParams.patientId) {
        //         //     const myPatient = myPatients.find(q => {
        //         //         return q.patient.remote_id.toString() === this.routeParams.patientId.toString();
        //         //     });
        //         //     if (myPatient && !this.selectedPage) {
        //         //         if (this.router.url.indexOf('patients') !== -1) {
        //         //         } else if (this.router.url.indexOf('providers') !== -1) {
        //         //         } else if (this.router.url.indexOf('messages') !== -1) {
        //         //         }
        //         //         // this.store.dispatch(new SelectedPatient(myPatient));
        //         //     }
        //         // }
        //     });
    }

    ngOnDestroy() {
        this.store2.dispatch(new fromActions.ResetStore());
    }

    // getPatientBaseList() {
    //     this.homeService.getPatientsHeaders().subscribe((patients: PatientBase[]) => {
    //         const patientsOrdered = this.sort.transform(patients, this.patient_sort_by, this.patient_order);
    //         this.store.dispatch(new PatientBaseList (patientsOrdered));
    //     });
    // }

    userCanSeeColumnButton(buttonType, column): boolean {
        return this.userPermissionService.userCanSeeColumnButton(buttonType, column);
    }

    refresh() {
        this.store2.dispatch(new Refresh());
    }

    userCanSeeCellButton(buttonType, cell, column): boolean {
        return this.userPermissionService.userCanSeeCellButton(buttonType, cell, column);
    }

    userCanSeeLockButton(cellInstance, columnInstance): boolean {
        return this.userPermissionService.userCanSeeLockButton(cellInstance, columnInstance);
    }

    getLockedClass(cellInstance) {
        return cellInstance.is_private ? 'default red' : 'default';
    }

    // #region Chat

    openChat(cell, column) {
        this.choosedPatient = undefined;
        if (cell.chat) {
            this.choosedPatient = undefined;
            this.chatService.getChat(cell.chat.id).subscribe((_chat: any) => {
                this.choosedChat = _chat;
                this.showChatWindow = true;
                this.store.dispatch(new ChangeChatsReadStatus(this.choosedChat));
            });
        } else {
            this.chatService.createChat({
                participants: [column.author.id],
                patient: cell.patient
            }).subscribe((_chat: any) => {
                this.choosedChat = _chat;
                this.showChatWindow = true;
            });
        }
    }

    createChat(patient) {
        this.showChatWindow = true;
        this.choosedPatient = patient;
    }

    createdChat(chat: Chat) {
        this.choosedPatient = undefined;
        this.choosedChat = chat;
    }

    updateChat(mess) {
        if (this.choosedChat.id === mess.chat) {
            this.chatService.updateMessagesLog(mess);
        }
    }

    closeChat() {
        this.choosedChat = {
            id: null
        };
        this.showChatWindow = false;
    }

    // #endregion Chat

    sortPatients() {
        this.dialog.open(SortPatientPopupComponent, {
            width: '485px',
            data: {
                header: 'Sort Patients'
            }
        });
    }

    importPatients() {
        this.notify.notifyError('TODO: Implement Patients Import');
    }

    openPatientProfile(patient, previewMode = true) {
        this.showPatientProfile = true;
        this.viewProfileIsEdited = previewMode;
        this.patientsService.getSinglePatient(patient.id).subscribe((_resp: any) => {
            this.patientProfileData = _resp;
        });
    }

    closePatientProfile(event) {
        this.showPatientProfile = false;
        this.viewProfileIsEdited = true;
    }

    patientHidden(patient: PatientBase) {
        this.store2.dispatch(new fromActions.HidePatient(patient.id));
        // this.patientsService
        //     .patientShow(false, patient.id)
        //     .subscribe((resp: any) => {
        //         // this.selectedPage = null;
        //         this.store.dispatch(new fromActions.SelectPage(null));
        //         // this.store.dispatch(new UpdateMyPatient(evt));
        //         // this.store.dispatch(new SelectedFolder(null));
        //         // this.store.dispatch(new SelectedPatient(null));
        //         // this.getPatientBaseList();
        //     });
    }

    pageChanged(evt: PatientPage) {
        this.selectedPage = evt.page;
        // this.store.dispatch(new SelectedPatient(evt.patient));
        // this.store.dispatch(new SelectedFolder(null));
        // this.store.dispatch(new SelectedProvider(null));

        // this.store.dispatch(new fromActions.SelectFolder(null));
        // this.store.dispatch(new fromActions.SelectProvider(null));
        //this.store.dispatch(new fromActions.SelectPatient(evt.patient));

        this.store.dispatch(new fromActions.SelectPage(evt));
        //this.store.dispatch(new fromActions.SetUpdateSeen({ update: new Update({ id: 202 }) , seen: false}));

        switch (evt.page) {
            case Pages.Patients:
                const url1 = `dashboard/home/patients/${evt.patient.remote_id}/0`;
                this.router.navigateByUrl(url1);
                break;
            case Pages.Providers:
                const url = `dashboard/home/providers/${evt.patient.remote_id}/0`;
                this.router.navigateByUrl(url);
                break;
            case Pages.Messages:
                this.router.navigateByUrl(`dashboard/home/messages/${evt.patient.remote_id}`);
                break;
        }
    }

    viewSubForAll() {
        //this.hideFolders = true;
        this.store.dispatch(new fromActions.HideFolders(true));
    }

    viewAllUpdates() {
        //this.selectedSubFolder = null;
        //this.hideFolders = false;
        this.store.dispatch(new fromActions.HideFolders(false));
        this.store.dispatch(new fromActions.SelectFolder(null));
        // this.store.dispatch(new HomeHidePatientFolders(false));
        // this.store.dispatch(new SelectedFolder(null));
    }

    unselectFolder() {
        this.store.dispatch(new fromActions.SelectFolder(null));
        // this.store.dispatch(new SelectedFolder(null));
    }

    markAllAsSeen(excludeIds: any[] = []) {
        // Call Effect
        // this.store.dispatch();
        this.homeService.markAllAsSeen(excludeIds);
    }

}


