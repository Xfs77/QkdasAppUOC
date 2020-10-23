export interface  AgrupationState {
  agrupations: { [key: string]: Agrupation };
  currentSelectedAgrup: { [key: string]: Agrupation };
  children: { [key: string]: { [key: string]: Agrupation }; };
}

export interface Agrupation {
  id: string;
  description: string;
  path: string[];
  pathDescription: string;
  hasChildren: boolean;
  hasItems: boolean;
}

export function rootAgrupation() {
  return {
    id: 'root',
    description: '',
    path: [],
    pathDescription: '',
    hasChildren: false,
    hasItems: true
  };
}
