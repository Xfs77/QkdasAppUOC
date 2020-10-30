import { Agrupation } from '../agrupation/agrupation.models';
import { EntityState } from '@ngrx/entity';

export interface ProductFormState extends  EntityState<ImageData> {
  product:  Product ;
  existMain: boolean;
}

export interface Product {

  active: boolean;
  likes: number;
  agrupation: Agrupation;
  reference: string;
  descr: string;
  quantity: number;
  price: number;
  mainImage: ImageData;
  images?: ImageData[];
}

export interface ImageData {
  id: string;
  urls: ImageUrls;
  isMain: boolean;
  file: any;
}

export function emptyImageData() {
  return {
    id: null,
    urls: emptyImageUrls(),
    isMain: false,
    file: null
  };
}

function emptyImageUrls() {
  return {
    imgSM: null,
    imgM: null,
    imgL: null,
    imgXL: null
  };
}

export interface ImageUrls {
  imgSM: string;
  imgM: string;
  imgL: string;
  imgXL: string;
}

export function emptyProduct() {
  return {
    active: true,
    likes: 0,
    agrupation: null,
    reference: null,
    descr: null,
    quantity: 1,
    price: null,
    mainImage: null,
  };
}
