import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListWrapperComponent } from './order-list-wrapper.component';

describe('OrderListWrapperComponent', () => {
  let component: OrderListWrapperComponent;
  let fixture: ComponentFixture<OrderListWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderListWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
