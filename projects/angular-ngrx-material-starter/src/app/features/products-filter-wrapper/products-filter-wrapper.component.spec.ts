import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsFilterWrapperComponent } from './products-filter-wrapper.component';

describe('ProductsFilterWrapperComponent', () => {
  let component: ProductsFilterWrapperComponent;
  let fixture: ComponentFixture<ProductsFilterWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsFilterWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsFilterWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
