import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import {  abhyasApi,touchstoneApi } from 'src/environments/environment.development';
 
@Injectable({
  providedIn: 'root'
})

export class ForgotService {
 
  constructor(private readonly _http: HttpClient, private readonly _router: Router) { } 
  
  forgotpassword(obj: any): Observable<any> { 
    return this._http.get<any>(`${abhyasApi}/student/forgotpwd/`+obj);

  }
}
