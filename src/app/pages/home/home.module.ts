import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { routing } from './home.routing';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
// Calendarios y fechas

import { JwtInterceptor } from '../../_helpers/jwt.interceptor';
import { ErrorInterceptor } from '../../_helpers/error.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AutocompleteComponent } from 'src/app/controls/autoComplete';
import { BusquedaGenericaComponent } from 'src/app/controls/busquedaGenerica';
import { BusquedaGenericaTextComponent } from 'src/app/controls/busquedaGenericaText';
import { ButtonComponent } from 'src/app/controls/button';
import { ButtonCancelComponent } from 'src/app/controls/buttonCancel';
import { CardsComponent } from 'src/app/controls/cards';
import { CheckBoxComponent } from 'src/app/controls/checkBox';
import { ComboComponent } from 'src/app/controls/combo';
import { FechaComponent } from 'src/app/controls/fecha';
import { FechaHoraComponent } from 'src/app/controls/fechaHora';
import { FechaCustomComponent } from 'src/app/controls/fechaCustom';
import { LabelComponent } from 'src/app/controls/label';
import { LinkComponent } from 'src/app/controls/link';
import { RadioComponent } from 'src/app/controls/radio';
import { TextAreaComponent } from 'src/app/controls/textArea';
import { TextBoxComponent } from 'src/app/controls/textBox';
import { ClockComponent } from 'src/app/controls/clock/clock.component';
import { EditorComponent } from 'src/app/controls/editor/editor.component';
import { FileUploaderComponent } from 'src/app/controls/fileUpload/file-uploader.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TabularABMFinderComponent } from './reportdef/tabular/tabularabmfinder.component';
import { DialogModule } from 'primeng/dialog';
import { TabularComponent } from './reportdef/tabular/tabular.component';
import { FormularioComponent } from './reportdef/formulario/formulario.component';
import { MessagesModule } from 'primeng/messages';
import { FieldBuilderComponent } from './reportdef/formulario/fieldBuilder';
import { InfoAreaComponent } from './areaInfo/infoArea.component';
import { InfoNotificationComponent } from './infoNotification/infoNotification.component';
import { ConfirmDialogComponent } from '../confirmDialog/confirmDialog.component';
import { ReportdefComponent } from './reportdef/reportdef.component';
import { GenericFinderService } from '../genericFinder/genericFinder.service';
import { ToolbarModule} from 'primeng/toolbar';
import { BusquedaGenericaModule } from 'src/app/busquedaGenericaModule';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { AutoCompleteModule } from 'primeng/autocomplete';

// Formatos customizados
export const MY_MOMENT_FORMATS = {
  parseInput: 'LL LT',
  fullPickerInput: 'DD-MM-YYYY HH:mm',
  datePickerInput: 'LL',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  imports: [
    CommonModule,routing, FormsModule,ToolbarModule,ButtonModule,
   DirectivesModule, NgbModule, ReactiveFormsModule,BusquedaGenericaModule,
    NgScrollbarModule,AngularEditorModule,DialogModule,MessagesModule,EditorModule,AutoCompleteModule,
    ToastrModule.forRoot(),

  ],
  declarations: [
    HomeComponent,ReportdefComponent, AutocompleteComponent,BusquedaGenericaTextComponent,ButtonComponent,FieldBuilderComponent,
    ButtonCancelComponent,CardsComponent,CheckBoxComponent,ComboComponent,TabularABMFinderComponent,InfoAreaComponent,InfoNotificationComponent,
    FechaComponent,FechaHoraComponent,FechaCustomComponent,LabelComponent,LinkComponent,RadioComponent,
    TextAreaComponent,TextBoxComponent,ClockComponent,EditorComponent,FileUploaderComponent,LinkComponent,TabularComponent,FormularioComponent
 

  ],
  providers: [
    GenericFinderService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    // { provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS},

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})

export class HomeModule { }
