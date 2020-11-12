import { NgModule } from '@angular/core';
import { CartComponent } from './cart/cart.component';
import { CartWrapperComponent } from './cart-wrapper.component';
import { SharedModule } from '../../shared/shared.module';
import { CartWrapperRoutingModule } from './cart-wrapper-routing.module';



@NgModule({
  declarations: [CartComponent, CartWrapperComponent],
  imports: [
    SharedModule,
    CartWrapperRoutingModule
  ],
  exports: [
    CartWrapperComponent
  ]
})
export class CartWrapperModule { }
