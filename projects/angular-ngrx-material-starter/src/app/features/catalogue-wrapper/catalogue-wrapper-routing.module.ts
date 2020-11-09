import { RouterModule, Routes } from '@angular/router';
import { CatalogueWrapperComponent } from './catalogue-wrapper.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CatalogueWrapperComponent,
    data:  {title: 'Catálogo'},
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueWrapperRoutingModule {}
