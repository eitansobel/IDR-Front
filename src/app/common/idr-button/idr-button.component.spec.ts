import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrButtonComponent } from './idr-button.component';

describe('IdrButtonComponent', () => {
  let component: IdrButtonComponent;
  let fixture: ComponentFixture<IdrButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
