import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrupationsComponent } from './agrupations.component';

describe('AgrupationsComponent', () => {
  let component: AgrupationsComponent;
  let fixture: ComponentFixture<AgrupationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgrupationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgrupationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
