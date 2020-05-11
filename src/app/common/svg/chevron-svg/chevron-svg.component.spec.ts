import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChevronSvgComponent } from './chevron-svg.component';

describe('ChevronSvgComponent', () => {
  let component: ChevronSvgComponent;
  let fixture: ComponentFixture<ChevronSvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChevronSvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChevronSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
