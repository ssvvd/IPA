import { NgModule  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'
import { HttpClient } from '@angular/common/http';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxSpinnerModule } from "ngx-spinner"; 
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialsComponent } from './materials.component';
import { MatMainTableComponent } from './mat-main-table/mat-main-table.component';
import { MatDetailsComponent } from './mat-details/mat-details.component';
import { MatStandardTableComponent } from './mat-standard-table/mat-standard-table.component';
import { PpAddFavoritComponent } from './pp-add-favorit/pp-add-favorit.component';
import { PpRequestMaterialComponent } from './pp-request-material/pp-request-material.component';
import { PpEditParamsComponent } from './pp-edit-params/pp-edit-params.component';
import { PpSetDefaultComponent } from './pp-set-default/pp-set-default.component';
import { HardnessSliderComponent } from './hardness-slider/hardness-slider.component';
import { MatSearchComponent } from './mat-search/mat-search.component';
import { MyMaterialsComponent } from './my-materials/my-materials.component';
import { MatFilterComponent } from './mat-filter/mat-filter.component';
import { DataTablesModule } from 'angular-datatables';
import { MaterilasRoutingModule } from './materilas-routing.module';

@NgModule({
  declarations: [
    MaterialsComponent,
    MatMainTableComponent,
    MatDetailsComponent,
    MatStandardTableComponent,
    PpAddFavoritComponent,
    PpRequestMaterialComponent,
    PpEditParamsComponent,
    PpSetDefaultComponent,
    HardnessSliderComponent,
    MatSearchComponent,
    MyMaterialsComponent,
    MatFilterComponent
  ],
  imports: [
    MaterilasRoutingModule,
    CommonModule,
    FormsModule,   
    HttpClientModule,
    Ng5SliderModule , 
    NgxSpinnerModule,
    ReactiveFormsModule,
    DataTablesModule
     ,TranslateModule.forRoot({
      extend:true,
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }) 
  ], 
  entryComponents:[

    PpAddFavoritComponent,
    PpRequestMaterialComponent,
    PpEditParamsComponent,
    PpSetDefaultComponent
        
  ],
  exports: [RouterModule]
})
export class MaterialsModule { }


export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http,'assets/i18n/', '.json');  
}