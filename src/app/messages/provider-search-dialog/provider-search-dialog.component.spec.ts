import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderSearchDialogComponent } from './provider-search-dialog.component';

describe('ProviderSearchDialogComponent', () => {
  let component: ProviderSearchDialogComponent;
  let fixture: ComponentFixture<ProviderSearchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderSearchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
