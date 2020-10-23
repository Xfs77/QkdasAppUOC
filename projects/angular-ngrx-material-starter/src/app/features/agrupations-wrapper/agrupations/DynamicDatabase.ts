import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DynamicFlatNode } from './DynamicFlatNode';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { map, mergeMap, take } from 'rxjs/operators';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { Agrupation, rootAgrupation } from '../../../core/agrupation/agrupation.models';
import { selectChildren } from '../../../core/agrupation/agrupation.selectors';
import { agrupationGet } from '../../../core/agrupation/agrupation.action';
import { parseJsonSchemaToCommandDescription } from '@angular/cli/utilities/json-schema';


/***
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 ***/
@Injectable({ providedIn: 'root' })
export class DynamicDatabase {

  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;

  constructor(
    public store$: Store) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, this);
  }

  /*** Initial data from database ***/
  initialData(): void {
    return this.dataSource.toggleNode(new DynamicFlatNode(rootAgrupation(), 0, true), true);
  }

  /*** Get's children of a node. Firstly, checks the store, if no data, then fetch data from database ***/
  getChildren(node: Agrupation): Observable<Agrupation[]> {
    return this.store$.select(selectChildren, node.id).pipe(
      take(1),
      map(res => {
        if (res && Object.values(res).length > 0) {
          return (Object.values(res) as Agrupation[]);
        } else {
          this.store$.dispatch(agrupationGet({ payload: { agrupation: node } }));
          return ([]);
        }
      }));
  }

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.node.hasChildren ;

}

/***
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 ***/
export class DynamicDataSource implements DataSource<DynamicFlatNode> {

  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  constructor(private _treeControl: FlatTreeControl<DynamicFlatNode>,
              private _database: DynamicDatabase) {
  }

  get data(): DynamicFlatNode[] {
    return this.dataChange.value;
  }

  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  addChildren(node: DynamicFlatNode, children: DynamicFlatNode[]) {
    if (children.length > 0) {

      this.removeChildren(node);
      const index = this.indexNode(node);

      let countChildren = 0;

      for (let i = index + 1; i < this.data.length
      && this.data[i].level > node.level; i++, countChildren++) {
      }

      if (index === -1) {
        this.data.splice(index , countChildren, ...children);

      } else {
        this.data.splice(index + 1, countChildren, ...children);

      }

      if (node.node.id !==  'root') {
        this.data[this.indexNode(node)].expandable = true;
        if (!this._treeControl.isExpanded(this.data[this.indexNode(node)])) {
          this._treeControl.toggle(this.data[this.indexNode(node)]);
        }
      }

      this.refreshState()
      this.data = this.data
    }

  }

  removeChildren(node: DynamicFlatNode): void {

    const index = this.indexNode(node);
    if (index >= 0) {
      let countChildren = 0;
      for (let i = index + 1; i < this.data.length
      && this.data[i].level > node.level; i++, countChildren++) {
      }
      this.data.splice(index + 1, countChildren);
    } else {
      this.data = [];
    }

    this.refreshState()
    this.data = this.data
  }
  getChildren(node: DynamicFlatNode): number {

    const index = this.indexNode(node);
    let countChildren = 0;
    if (index >= -1) {
      for (let i = index + 1; i < this.data.length
      && this.data[i].level > node.level; i++, countChildren++) {
      }
    } else {
      this.data = [];
    }
   return countChildren;
  }

  getNodeIndex(node: DynamicFlatNode) {
    if (node.node.id === 'root') {
      return -1;
    }
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].node.id === node.node.id) {
        return i;
      }
    }
  }

  removeNode(parent: DynamicFlatNode, node: DynamicFlatNode): boolean {
    const index = this.getNodeIndex(node);

    this.data.splice(index, 1);

    if (this.getChildren(parent) === 0 && parent.node.id !== 'root') {
      this.data[this.getNodeIndex(parent)].expandable = false;
    }

    this.refreshState();
    this.data = this.data;
    return true;
  }

  indexParent(node: DynamicFlatNode): number {
    const index = this.indexNode(node);
    let i = index - 1;

    for (i; i >= 0; i--) {
      if (this.data[i].level < node.level) {
        break;
      }
    }
    return i;
  }

  getParent(node: DynamicFlatNode): DynamicFlatNode {
    let parent = new DynamicFlatNode(rootAgrupation(), 0, false);

    const i = this.indexParent(node);

    if (i >= 0) {
      parent = this.data[i];
    }

    return parent;
  }

  getLevel(node: Agrupation): number {
    if (node.id === 'root') {
      return 0;
    }
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].node.id === node.id) {
        return this.data[i].level;
      }
    }
  }

  indexNode(node: DynamicFlatNode): number {
    if (node.node.id === 'root') {
      return -1;
    }
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].node.id === node.node.id) {
        return i;
        break;
      }
    }
  }

  refreshState() {
    const tmp = [...this.data.slice()];
    this.dataChange.next(null);
    this.dataChange.next(tmp);
  }

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  /***
   *  Handle expand/collapse behaviors.
   *  Added: expand selected node getting children.
   *  Removed: collapse selected node deleting children from tree
   ***/
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
    this.dataChange.next(this.data);
  }

  /***
   * Toggle the node, remove from display list
   * Expand -> true : Then gets children of selected node in the tree.
   * Expand -> false: Then removes children of selected node in the tree.
   ***/
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    if (!expand) {
      this.removeChildren(node);
    } else {
      this._database.getChildren(node.node).pipe(
        take(1),
        map(children => children
          .map(item => new DynamicFlatNode(item, node.level + 1, item.hasChildren)
          )
        )).subscribe(res => {
        this.addChildren(node, res)
      });
    }
  }
}

