import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrDatePickerComponent } from './idr-date-picker.component';

describe('IdrDatePickerComponent', () => {
  let component: IdrDatePickerComponent;
  let fixture: ComponentFixture<IdrDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
