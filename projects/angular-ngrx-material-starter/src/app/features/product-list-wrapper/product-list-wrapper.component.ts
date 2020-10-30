import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'anms-product-list-wrapper',
  templateUrl: './product-list-wrapper.component.html',
  styleUrls: ['./product-list-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListWrapperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
