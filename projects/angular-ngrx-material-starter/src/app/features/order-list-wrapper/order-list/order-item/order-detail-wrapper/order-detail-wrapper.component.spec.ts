import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailWrapperComponent } from './order-detail-wrapper.component';

describe('OrderDetailWrapperComponent', () => {
  let component: OrderDetailWrapperComponent;
  let fixture: ComponentFixture<OrderDetailWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
