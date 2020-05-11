import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule, MatSelectModule } from '@angular/material';

import { AccountFormComponent } from './account-form/account-form.component';
import { AdditionalFormComponent } from './additional-form/additional-form.component';
import { AuthService } from '../auth/services/auth.service';
import { AvatarFormComponent } from './avatar-form/avatar-form.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { CropImageComponent } from './crop-image/crop-image.component';
import { HospitalDepartmentService } from '../services/hospital.structure.service';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatDialogModule } from '@angular/material/dialog';
import { Ng4FilesModule } from './../ng4-files';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { PersonalFormComponent } from './personal-form/personal-form.component';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileService } from './service/profile.service';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../common/common-share.module';

@NgModule({
    declarations: [
        ProfileComponent,
        CropImageComponent,
        ChangePassComponent,
        PersonalFormComponent,
        ContactFormComponent,
        AdditionalFormComponent,
        AccountFormComponent,
        AvatarFormComponent
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ImageCropperModule,
        MatDialogModule,
        SharedComponentModule,
        Ng4FilesModule,
        NgSelectModule,
        RouterModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    providers: [
        ProfileService,
        AuthService,
        HospitalDepartmentService
    ],
    exports: [
        PersonalFormComponent,
        ContactFormComponent,
        AdditionalFormComponent,
        AccountFormComponent,
        AvatarFormComponent
    ],
    entryComponents: [
        CropImageComponent,
        ChangePassComponent,
        PersonalFormComponent,
        AccountFormComponent
    ]
})
export class ProfileModule { }
