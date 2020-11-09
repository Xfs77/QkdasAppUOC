import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'anms-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndicatorComponent implements OnInit {

  @Input() index: number;
  @Input() activeIndex: number;

  constructor() { }

  ngOnInit(): void {
  }

  onLoad() {
    console.log('onload')
  }
}
