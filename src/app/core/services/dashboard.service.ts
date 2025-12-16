import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import {  abhyasApi,touchstoneApi } from 'src/environments/environment.development';
 
@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }
  // profile_event(std_mbl: any):Observable<any>{
  //   return this._http.get<any>("https://abhyas.ai/api/v1/events/"+std_mbl)
  // }

  
  // get_practicetest(stdSuc: any):Observable<any>{
  //   return this._http.get<any>(`https://apis.aditya.ac.in/zoom/v23/api/vg/studetgroup/studentinfo/2267480307`+stdSuc)
  // }

  get_virtual_grp(stdSuc: any):Observable<any>{
    return this._http.get<any>(`https://apis.aditya.ac.in/zoom/v23/api/vg/studetgroup/studentinfo/`+stdSuc)
  }
  
}