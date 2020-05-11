import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrSelectComponent } from './idr-select.component';

describe('IdrSelectComponent', () => {
  let component: IdrSelectComponent;
  let fixture: ComponentFixture<IdrSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
