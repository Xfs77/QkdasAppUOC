import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordFormWrapperComponent } from './password-form-wrapper.component';

describe('PasswordFormWrapperComponent', () => {
  let component: PasswordFormWrapperComponent;
  let fixture: ComponentFixture<PasswordFormWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordFormWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordFormWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
