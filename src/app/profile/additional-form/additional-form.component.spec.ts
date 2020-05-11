import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalFormComponent } from './additional-form.component';

describe('AdditionalFormComponent', () => {
  let component: AdditionalFormComponent;
  let fixture: ComponentFixture<AdditionalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
