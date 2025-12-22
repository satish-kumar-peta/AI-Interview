import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { ScreensComponent } from './screens/screens.component';
import { InstructionComponent } from './screens/instruction/instruction.component';
import { AiinterviewComponent } from './screens/aiinterview/aiinterview.component';

const routes: Routes = [
  {
    path:'',
    component: ScreensComponent,
    children:[
      {
        path:'',
        component:DashboardComponent
      },
      {
        path:'dashboard',
        component:DashboardComponent
      },

       {
        path:'instruction',
        component:InstructionComponent
      },
        {
        path:'aiinterview',
        component:AiinterviewComponent
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
