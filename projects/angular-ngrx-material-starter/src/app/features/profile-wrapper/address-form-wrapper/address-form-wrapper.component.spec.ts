import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFormWrapperComponent } from './address-form-wrapper.component';

describe('AddressFormWrapperComponent', () => {
  let component: AddressFormWrapperComponent;
  let fixture: ComponentFixture<AddressFormWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressFormWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
