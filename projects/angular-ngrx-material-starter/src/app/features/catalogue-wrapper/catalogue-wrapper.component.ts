import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'anms-catalogue-wrapper',
  templateUrl: './catalogue-wrapper.component.html',
  styleUrls: ['./catalogue-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogueWrapperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
