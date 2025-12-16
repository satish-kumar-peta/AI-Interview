import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StudentModule } from './student/student.module'
import { RegistrationComponent } from './registration/registration.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';

const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'forgetpassword',
    component:ForgetpasswordComponent
  },
  {
    path:'registration',
    component:RegistrationComponent
  },
  {
    path:'student',
    loadChildren: () => import('./student/student.module').then(module => module.StudentModule),
    canActivate : [AuthGuard]
  },
  {
    path:'admin',
    loadChildren: () => import('./admin/admin.module').then(module => module.AdminModule),
    canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),FormsModule, ReactiveFormsModule, HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ AdminModule,StudentModule ]
