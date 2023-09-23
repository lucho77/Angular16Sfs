import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { routing } from './pages.routing';
import { PagesComponent } from './pages.component';
import { HeaderComponent } from '../theme/components/header/header.component';
import { FooterComponent } from '../theme/components/footer/footer.component';
import { SidebarComponent } from '../theme/components/sidebar/sidebar.component';
import { VerticalMenuComponent } from '../theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from '../theme/components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from '../theme/components/breadcrumb/breadcrumb.component';
import { BackTopComponent } from '../theme/components/back-top/back-top.component';
import { UserMenuComponent } from '../theme/components/user-menu/user-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessagesComponent } from '../theme/components/messages/messages.component';
import { CommonModule } from '@angular/common';
import { FullScreenComponent } from '../theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from '../theme/components/applications/applications.component';
import { NgxBootstrapMultiselectModule } from 'ngx-bootstrap-multiselect';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DialogModule } from 'primeng/dialog';
import { BusquedaGenericaModule } from '../busquedaGenericaModule';


@NgModule({
  imports: [
    FormsModule,ReactiveFormsModule,CommonModule,DialogModule,
    NgbModule,NgxBootstrapMultiselectModule,NgScrollbarModule,BusquedaGenericaModule,
    routing
  ],
  declarations: [
    PagesComponent,
    MessagesComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    BackTopComponent,
    UserMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent, FooterComponent,
  ],
  providers: [
  ],

})
export class PagesModule { }
