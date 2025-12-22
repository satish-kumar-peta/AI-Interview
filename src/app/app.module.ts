import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule,HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule,routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider
} from '@abacritt/angularx-social-login';
import { HeadersInterceptor } from './interceptor/headers.interceptor';
import { googleclientID } from './utilities/socialauth';
import { SharedModule } from './shared/shared.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {DataTablesModule} from 'angular-datatables';
import { RegistrationComponent } from './registration/registration.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { StudentComponent } from './screens/student/student.component';
import { AIInterviewComponent } from './src/app/student/screens/aiinterview/aiinterview.component';


@NgModule({
  
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ForgetpasswordComponent,
    StudentComponent,
    AIInterviewComponent,
    
    
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SocialLoginModule,
    routingComponents,
    SharedModule,
    CommonModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule
  ],
  providers: [
    {provide: LocationStrategy, useClass:HashLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
  },HttpClient,
  
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              googleclientID
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  
  ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
