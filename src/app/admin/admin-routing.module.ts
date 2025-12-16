import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankpageComponent } from './screens/blankpage/blankpage.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { adminScreensComponent } from './screens/screens.component';
import {AiinterviewComponent} from './screens/aiinterview/aiinterview.component';

const routes: Routes = [
  {
    path:'',
    component: adminScreensComponent,
    children:[
      {
        path:'',
        component: DashboardComponent
      },
      {
        path:'dashboard',
        component: DashboardComponent
      },
      {
        path:'blankpage',
        component: BlankpageComponent
      },
      {
        path:'aiinterview',
        component: AiinterviewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
