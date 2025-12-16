import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from "@ng-select/ng-select";

import { StudentRoutingModule } from './student-routing.module';
import { ScreensComponent } from './screens/screens.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from "../shared/shared.module";
import { MathJaxDirective } from '../directives/math-jax.directive';

import { searchFilterPipe } from '../utilities/search-filter.pipe';  
import { CapitalizePipe } from '../utilities/capitalize.pipe';

@NgModule({
    declarations: [
        ScreensComponent,
        DashboardComponent,
        MenuComponent,
        MathJaxDirective,
        searchFilterPipe,
        CapitalizePipe,
    
    ],
    imports: [
        CommonModule,
        StudentRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule
        
    ],
    bootstrap: []
})
export class StudentModule { }
