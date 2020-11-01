import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  Input, EventEmitter
} from '@angular/core';
import { Agrupation } from '../../../core/agrupation/agrupation.models';

@Component({
  selector: 'anms-products-filter',
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsFilterComponent {
  @Input() currentSelectedAgrup: Agrupation;
  @Output() selectedAgrupEvent: EventEmitter<Agrupation> = new EventEmitter<Agrupation>(); // Indicates the selected agrupation


  constructor() {}

  onSelectAgrup($event: Agrupation) {
    this.selectedAgrupEvent.emit($event);
  }
}
