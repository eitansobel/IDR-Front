import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrDialogWrapComponent } from './idr-dialog-wrap.component';

describe('IdrDialogWrapComponent', () => {
  let component: IdrDialogWrapComponent;
  let fixture: ComponentFixture<IdrDialogWrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrDialogWrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrDialogWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
