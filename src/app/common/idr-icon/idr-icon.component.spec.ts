import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrIconComponent } from './idr-icon.component';

describe('IdrIconComponent', () => {
  let component: IdrIconComponent;
  let fixture: ComponentFixture<IdrIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
