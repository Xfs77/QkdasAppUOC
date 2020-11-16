import { NgModule } from '@angular/core';
import { CartComponent } from './cart/cart.component';
import { CartWrapperComponent } from './cart-wrapper.component';
import { SharedModule } from '../../shared/shared.module';
import { CartWrapperRoutingModule } from './cart-wrapper-routing.module';
import { AddressWrapperComponent } from './address-wrapper/address-wrapper.component';
import { AddressComponent } from './address-wrapper/address/address.component';
import { MatStepperModule } from '@angular/material/stepper';



@NgModule({
  declarations: [CartComponent, CartWrapperComponent, AddressComponent, AddressWrapperComponent],
  imports: [
    SharedModule,
    CartWrapperRoutingModule,
    MatStepperModule
  ],
  exports: [
    CartWrapperComponent
  ]
})
export class CartWrapperModule { }
