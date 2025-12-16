import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
 
@Injectable({
  providedIn: 'root'
})

export class InterceptorService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

 
  
  post_log(obj: any): Observable<any> { 

    //return obj;

    return this._http.post<any>(`https://apis.aditya.ac.in/kafka/producer/httpintercept-abhyaslog`, obj) 
  }
  

}
