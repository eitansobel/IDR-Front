import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrInputComponent } from './idr-input.component';

describe('IdrInputComponent', () => {
  let component: IdrInputComponent;
  let fixture: ComponentFixture<IdrInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
