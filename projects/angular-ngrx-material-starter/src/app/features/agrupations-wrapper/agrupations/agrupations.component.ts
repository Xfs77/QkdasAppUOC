import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter, OnChanges, SimpleChanges, Inject, Optional, OnDestroy
} from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DynamicFlatNode } from './DynamicFlatNode';
import { DynamicDatabase, DynamicDataSource } from './DynamicDatabase';
import { Agrupation, rootAgrupation } from '../../../core/agrupation/agrupation.models';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { selectAgrupationSelected } from '../../../core/agrupation/agrupation.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'anms-agrupations',
  templateUrl: './agrupations.component.html',
  styleUrls: ['./agrupations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgrupationsComponent implements OnInit, OnDestroy {

  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;

  @Input() editionMode: boolean; // Indicates if we show editing tools
  @Input() currentSelected: Agrupation; // Current selected agrupation
  @Output() selectedAgrupEvent: EventEmitter<Agrupation> = new EventEmitter<Agrupation>(); // Selected agrupation
  @Output() removeAgrupationEvent: EventEmitter<{parent: Agrupation, agrupation: Agrupation}> = new EventEmitter<{parent: Agrupation, agrupation: Agrupation}>();
  @Output() addAgrupationEvent: EventEmitter<{parent: Agrupation, agrupation: Agrupation, edit: boolean}> = new EventEmitter<{parent: Agrupation, agrupation: Agrupation, edit: boolean}>();

  edit = false; // Indicates that we are editing an existing Agrupation
  new = false; // Indicates that we are creating a new Agrupation
  currentNode: DynamicFlatNode; // Current node we are editing. Var used in the template.
  private onDestroy = new Subject();

  constructor(
    public database: DynamicDatabase,
    public store$: Store,
    @Optional() private dialogRef: MatDialogRef<AgrupationsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data
  ) {

    this.treeControl = this.database.treeControl;
    this.dataSource = this.database.dataSource;


  }

  ngOnInit(): void {
    // We load first level of our agrupation collection
    this.database.initialData();
    this.store$.select(selectAgrupationSelected).pipe(takeUntil(this.onDestroy)).subscribe(res => {
      if (res) {
        this.currentSelected = res;
      }
    })
  }


  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: DynamicFlatNode) => {
    return _nodeData.node.description === '';
  }

  /** Adds an empty agrupation to the parent node **/
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
  /** Edits selected node **/
  editAgrupation(node: DynamicFlatNode) {
    this.edit = true;
    this.currentNode = node;
  }

  /** Cancel new or edit node **/
  cancelAgrupation(node: DynamicFlatNode) {
    // If we are creating a new Agrupation and cancel we have to remove that agrupation from dataSource
    if (this.new) {
      this.removeAgrupation(node);
    }
    this.edit = false;
    this.new = false;
  }

  /** Remove selected node **/
  removeAgrupation(node: DynamicFlatNode) {
    const parent = this.dataSource.getParent(node);

    this.removeAgrupationEvent.emit({parent: parent.node, agrupation: node.node});
  }

  /** Save node **/
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

  /** Actions when we select an agrupation **/
  onSelectAgrupation(node: Agrupation)  {
    if (!this.editionMode) {
      // In smaller screen we close Agrupations list after the selection
      if (this.dialogRef) {
        this.dialogRef.close(node);
      }
      this.currentSelected = node;
      this.selectedAgrupEvent.emit(node);
    }
  }

  /** Class that formats selected node **/
  isSelected(node: Agrupation) {
    if (this.currentSelected && this.currentSelected.id === node.id) {
      return 'isSelected';
    }
    return '';
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}
