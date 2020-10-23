import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter, OnChanges, SimpleChanges
} from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DynamicFlatNode } from './DynamicFlatNode';
import { DynamicDatabase, DynamicDataSource } from './DynamicDatabase';
import { Agrupation, rootAgrupation } from '../../../core/agrupation/agrupation.models';
import { Store } from '@ngrx/store';


@Component({
  selector: 'anms-agrupations',
  templateUrl: './agrupations.component.html',
  styleUrls: ['./agrupations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgrupationsComponent implements OnInit, OnChanges {

  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;

  @Input() editionMode: boolean; // Indicates if we show editing tools
  @Input() currentSelected: Agrupation;
  @Output() selectedAgrupEvent: EventEmitter<Agrupation> = new EventEmitter<Agrupation>(); // Selected agrupation
  @Output() removeAgrupationEvent: EventEmitter<any> = new EventEmitter<any>(); // any = {parent: Object, agrupation: Object}
  @Output() addAgrupationEvent: EventEmitter<any> = new EventEmitter<any>(); // any = {parent: Object, agrupation: Object, editionMode: true/false}

  edit = false; // Indicates that we are editing an existing Agrupation
  new = false; // Indicates that we are creating a new Agrupation
  currentNode: DynamicFlatNode; // Current node we are editing. Var used in the template.

  constructor(
    public database: DynamicDatabase,
    public store$: Store
  ) {

    this.treeControl = this.database.treeControl;
    this.dataSource = this.database.dataSource;


  }

  ngOnInit(): void {}


  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: DynamicFlatNode) => {
    return _nodeData.node.description === '';
  }

  addEmptyAgrupation(parent: DynamicFlatNode) {
    this.new = true;

    const emptyAgr = {} as Agrupation;
    emptyAgr.id = Date.now().toString();
    emptyAgr.description = '';
    emptyAgr.path = [];

    let parentAgrup = {} as Agrupation;

    if (parent) {
      parentAgrup = parent.node;
      emptyAgr.path = parent.node.path;
      emptyAgr.path = [...emptyAgr.path].concat([parent.node.id]);
      emptyAgr.pathDescription = parent.node.pathDescription;
    } else {
      parentAgrup = rootAgrupation();
    }

    this.addAgrupationEvent.emit({parent: parentAgrup, agrupation: emptyAgr, edit: false});
  }

  editAgrupation(node: DynamicFlatNode) {
    this.edit = true;
    this.currentNode = node;
  }

  cancelAgrupation(node: DynamicFlatNode) {
    // If we are creating a new Agrupation and cancel we have to remove that agrupation from dataSource
    if (this.new) {
      this.removeAgrupation(node);
    }
    this.edit = false;
    this.new = false;
  }

  removeAgrupation(node: DynamicFlatNode) {
    const parent = this.dataSource.getParent(node);

    this.removeAgrupationEvent.emit({parent: parent.node, agrupation: node.node});
  }

  saveAgrupation(node: DynamicFlatNode, descr: string, edit: boolean) {
    this.edit = false;
    this.new = false;

    const dynamicNodeUpdated = {
      ...node,
      node: {
        ...node.node,
        description: descr
      }
    };

    dynamicNodeUpdated.node.description = descr;
    const parent = this.dataSource.getParent(node);

    if (dynamicNodeUpdated.level === 1) {
      dynamicNodeUpdated.node.pathDescription = descr + ' ';
    } else {
      dynamicNodeUpdated.node.pathDescription = `${parent.node.pathDescription}> ${dynamicNodeUpdated.node.description}`;
    }

    this.addAgrupationEvent.emit({parent: parent != null ? parent.node : rootAgrupation(), agrupation: dynamicNodeUpdated.node, edit});
  }

  onSelectAgrupation(node: Agrupation)  {
    this.currentSelected = node;
    this.selectedAgrupEvent.emit(node);
  }

  isSelected(node: Agrupation) {
    if (this.currentSelected && this.currentSelected.id === node.id) {
      return 'isSelected';
    }
    return '';
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
