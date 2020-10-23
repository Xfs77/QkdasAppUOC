import { Agrupation } from '../../../core/agrupation/agrupation.models';

/** Flat node with expandable and level information */
export class DynamicFlatNode {
  constructor(public node: Agrupation, public level = 0, public expandable = false) {
  }

}
