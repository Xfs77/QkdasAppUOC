import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrupationsWrapperComponent } from './agrupations-wrapper.component';

describe('AgrupationsWrapperComponent', () => {
  let component: AgrupationsWrapperComponent;
  let fixture: ComponentFixture<AgrupationsWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgrupationsWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgrupationsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
