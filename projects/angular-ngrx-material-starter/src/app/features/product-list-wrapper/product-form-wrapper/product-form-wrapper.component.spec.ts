import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormWrapperComponent } from './product-form-wrapper.component';

describe('ProductFormWrapperComponent', () => {
  let component: ProductFormWrapperComponent;
  let fixture: ComponentFixture<ProductFormWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFormWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
