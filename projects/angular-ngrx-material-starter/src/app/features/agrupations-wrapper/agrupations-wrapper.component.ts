import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Agrupation } from '../../core/agrupation/agrupation.models';
import { Store } from '@ngrx/store';
import { DynamicDatabase } from './agrupations/DynamicDatabase';
import {
  agrupationRemove,
  agrupationUpdate,
  currentSelectedAgrupation
} from '../../core/agrupation/agrupation.action';
import { $e } from 'codelyzer/angular/styles/chars';
import { map, take } from 'rxjs/operators';
import { DynamicFlatNode } from './agrupations/DynamicFlatNode';

@Component({
  selector: 'anms-agrupations-wrapper',
  templateUrl: './agrupations-wrapper.component.html',
  styleUrls: ['./agrupations-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgrupationsWrapperComponent implements OnInit {

  constructor(
    public database: DynamicDatabase,
    public store$: Store
  ) { }

  ngOnInit(): void {
    // We load first level of our agrupation collection
    this.database.initialData();
  }

  selectAgrup($event: Agrupation) {
    this.store$.dispatch(currentSelectedAgrupation({payload: {agrupation: $event}}));
  }

  addAgrupation($event) {
    this.store$.dispatch(agrupationUpdate({payload: {parent: $event.parent, agrupation: $event.agrupation, edit: $event.edit}}));
  }

  removeAgrupation($event) {
    this.store$.dispatch(agrupationRemove({payload: {parent: $event.parent, agrupation: $event.agrupation}}));
  }
}
