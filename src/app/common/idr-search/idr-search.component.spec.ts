import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrSearchComponent } from './idr-search.component';

describe('IdrSearchComponent', () => {
  let component: IdrSearchComponent;
  let fixture: ComponentFixture<IdrSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
