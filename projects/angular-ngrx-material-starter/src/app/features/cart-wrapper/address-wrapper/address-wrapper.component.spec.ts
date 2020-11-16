import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressWrapperComponent } from './address-wrapper.component';

describe('AddressWrapperComponent', () => {
  let component: AddressWrapperComponent;
  let fixture: ComponentFixture<AddressWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
