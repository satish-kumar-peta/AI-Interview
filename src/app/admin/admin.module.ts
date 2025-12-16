import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MenuComponent } from './menu/menu.component';
import { adminScreensComponent } from './screens/screens.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { BlankpageComponent } from './screens/blankpage/blankpage.component';
import { AiinterviewComponent } from './screens/aiinterview/aiinterview.component';


@NgModule({
  declarations: [
    MenuComponent,
    adminScreensComponent,
    DashboardComponent,
    BlankpageComponent,
    AiinterviewComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
