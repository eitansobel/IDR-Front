import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsByFolderComponent } from './patients-by-folder.component';

describe('PatientsByFolderComponent', () => {
  let component: PatientsByFolderComponent;
  let fixture: ComponentFixture<PatientsByFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientsByFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsByFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
