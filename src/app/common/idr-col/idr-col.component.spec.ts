import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrColComponent } from './idr-col.component';

describe('IdrColComponent', () => {
  let component: IdrColComponent;
  let fixture: ComponentFixture<IdrColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
