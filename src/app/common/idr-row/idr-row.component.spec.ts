import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrRowComponent } from './idr-row.component';

describe('IdrRowComponent', () => {
  let component: IdrRowComponent;
  let fixture: ComponentFixture<IdrRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
