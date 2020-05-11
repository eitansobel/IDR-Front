import {HomePatient, NestedColumn} from '../models/home';

import {Alert} from '../models/alert';
import {DataColumn} from '../models/data-columns';
import {Departament} from '../models/hospital-departments';
import {Hospital} from '../models/hospital';
import { MyPatient } from '../models/my-patients';
import {Patient} from '../models/patient';
import { PatientBase } from '../models/patient-base';
import { PatientFolder } from '../models/patient-folder';
import { PatientPage } from '../models/patient-page';
import {PatientsList} from '../models/patients-list';
import {Profile} from '../models/profile';
import {Role} from '../models/roles';
import {StaffList} from '../models/staff-list';
import { UpdateFolderSummary } from '../models/patient-folder-summary';

export interface AppState {
    alertPage: {
        alerts: Alert[]
    };
    alertSingle: {
        setAlert: any[]
    };
    departmentPage: {
        departments: Departament[]
    };
    rolesPage: {
        roles: Role[]
    };
    hospitalsPage: {
        hospitals: Hospital[]
    };
    profilePage: {
        profile: Profile,
        partialProfile: Profile
    };
     patListPage: {
        patientsLists: PatientsList[]
    };
    staffPage: {
        staffLists: StaffList[]
    };
    dataColumnPage: {
        dataColumns: DataColumn[]
    };
    nestedColumnsPage: {
        nestedColumns: NestedColumn[]
    };
    homePatientsPage: {
        // homePatients: HomePatient[]
        selectedPatient: PatientBase,
        selectedProvider: any, // TODO: Introduce model
        selectedFolder?: UpdateFolderSummary,
        selectedSubFolder?: UpdateFolderSummary,
        patientPage: PatientPage,
        myPatients: MyPatient[],
        patientBaseList: PatientBase[],
        patientFolders: any, // { <patient id>: { <folder> }}
        patientProviders: any,
        hideFolders: boolean,
        updates: any[]
    };
    homePatientUpdatesPage: {
        seenExcludeList: any[]
    };
    loadedStaffListPage: {
        staffLists: any[]
    };
    membersPage: {
        members: Profile[]
    };
    patientsPage: {
        patients: Patient[]
    };
    membersPhoto: {
        photo
    };
    tokenStatus: {
        tokenStatus
    };
}
