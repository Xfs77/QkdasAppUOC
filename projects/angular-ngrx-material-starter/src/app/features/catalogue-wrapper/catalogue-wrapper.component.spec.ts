import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueWrapperComponent } from './catalogue-wrapper.component';

describe('CatalogueWrapperComponent', () => {
  let component: CatalogueWrapperComponent;
  let fixture: ComponentFixture<CatalogueWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
