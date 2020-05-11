import { LoadDepartmentsSuccess, StaffActions, StaffActionsTypes } from '../actions/staff.actions';

import { Profile } from 'src/app/models/profile';

export interface StaffState {
    staff: Profile[];
    staffList: any[];
    staffTable: any[];
    selectedStaffList: any;
    error: any;
    departments: any[];
};

const initialState: StaffState = {
    staff: [],
    staffList: [],
    staffTable: [],
    selectedStaffList: {},
    error: null,
    departments: []
};

export function StaffReducer(state = initialState, action: StaffActions): StaffState {
    switch (action.type) {
        case StaffActionsTypes.LoadStaffSuccess: {

            // add department & role name by id
            action.payload.forEach(person => {
                const hospital = state.departments.find(d => d.hospital_id === person.hospital);
                if(hospital){
                    const department = hospital.hospital_department.find(d => d.id === person.hospital_department);
                    if(department){
                        person['hospital_department_name'] = department.title;
                    }

                    const role = hospital.hospital_role.find(r => r.id === person.hospital_role);
                    if (role) {
                        person['hospital_role_name'] = role.title;
                    }
                }
            });

            let selectedStaffList = {};
            if(state.selectedStaffList.id) {
                const match = state.staffList.find(list => list.id === state.selectedStaffList.id)
                if (match) {
                    selectedStaffList = match;
                }
            }

            return {
                ...state,
                staff: [ ...action.payload ],
                selectedStaffList: selectedStaffList || state.selectedStaffList
            };
        }
        case StaffActionsTypes.LoadStaffListSuccess: {
            const staffList = action.payload.filter(item => item.id > 0).sort((a, b) => a.title.localeCompare(b.title));
            const systemItems = action.payload.find(item => item.default);
            let selectedStaffList = state.selectedStaffList;

            if (systemItems) {
                const all = systemItems.default.all_users.participants;
                const pended = systemItems.default.pended_users.participants;
                staffList.unshift({ id: -2, system: true, title: 'Pended Providers', participants: pended });
                staffList.unshift({ id: -1, system: true, title: 'All Providers', participants: all });
            }

            if(!state.selectedStaffList.participants) {
                selectedStaffList = staffList[0];
            }
            console.log('selectedStaffList', selectedStaffList)

            return {
                ...state,
                staffList: [ ... staffList ],
                selectedStaffList: selectedStaffList
            };
        }
        case StaffActionsTypes.SelectStaffList: {
            const profiles = [];
            const selectedStaffList = action.payload || state.selectedStaffList;

            if (state.staff.length > 0 && selectedStaffList.participants) {
                selectedStaffList.participants.forEach((remote_id: number) => {
                    const match = state.staff.find(person => person.remote_id === remote_id);
                    if (match) {
                        profiles.push(match);
                    }
                });
            }
            return {
                ...state,
                staffTable: [ ...profiles ],
                selectedStaffList: selectedStaffList
            };
        }
        case StaffActionsTypes.LoadDepartmentsSuccess: {
            return {
                ...state,
                departments: [...action.payload]
            };
        }
        case StaffActionsTypes.Error: {
            return {
                ...state,
                error: action.payload
            };
        }
        case StaffActionsTypes.ResetStore: {
            state = initialState;
            return {
                ...state,
            };
        }
        default: {
            return {
                ...state,
            };
        }
    }
}
