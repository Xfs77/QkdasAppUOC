import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormWrapperComponent } from './user-form-wrapper.component';

describe('UserFormWrapperComponent', () => {
  let component: UserFormWrapperComponent;
  let fixture: ComponentFixture<UserFormWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFormWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
