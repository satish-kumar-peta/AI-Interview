import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import {  abhyasApi,touchstoneApi } from 'src/environments/environment.development';
 
@Injectable({
  providedIn: 'root'
})

export class adminService { 
  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }
 
  post_login(obj: any): Observable<any> { 
    return this._http.post<any>(`${abhyasApi}/student/login`, obj) 
  }  

  logout(): void {
    localStorage.clear();
    window.location.href = "/login";
  } 

}
