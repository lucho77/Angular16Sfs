import { BusquedaGenericaComponent } from './controls/busquedaGenerica';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericFinderComponent } from './pages/genericFinder/genericFinder.component';

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule
    ],
    declarations: [
        BusquedaGenericaComponent, GenericFinderComponent,
    ],
    exports: [BusquedaGenericaComponent]

  })
  export class BusquedaGenericaModule {
  }
