import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, Observer } from 'rxjs'
import { Router } from '@angular/router'
import { EventService } from './eventlog.service';
import { abhyasApi, touchstoneApi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router, private _eventservice: EventService) { }


  // ************************ Login Api ****************** 
  post_login(obj: any): Observable<any> {
    return this._http.post<any>(`${abhyasApi}/student/login`, obj)
  }

  // ************************ Register Api ****************** 
  post_register(body: any): Observable<any> {
    return this._http.post<any>(`${abhyasApi}/student/registration`, body);
  }

  post_st_suc(body: any): Observable<any> {
    return this._http.post<any>(`${abhyasApi}/student/verifysucmobile/`, body);
  }

  get_qualification_list(): Observable<any> {
    return this._http.get<any>(`${abhyasApi}/qualification`);
  }

  update_registerprogram(suc: any, obj: any): Observable<any> {
    return this._http.patch<any>(`${abhyasApi}/student/updateprofile/` + suc, obj)
  }

  logout(stddata: any): void {

    const videoPlayMongo =
    {
      "userId": stddata.stdSuc,
      "eventCategory": 'Logout',
      "eventDetails": stddata,
      "title1": "Logout",
      "result": "Logout"
    }
    this._eventservice.post_event(videoPlayMongo).subscribe(
      (eventdata: any) => { })
    localStorage.clear();
    window.location.href = "https://abhyas.ai/beta/#/login";
  }


  getIpAddress(): Observable<any> {
    return this._http.get('https://api64.ipify.org?format=json');
  }

  getCurrentLocation(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: any) => {
            observer.next(position);
            observer.complete();
          },
          (error: any) => observer.error(error),
          { timeout: 10000, maximumAge: 60000 } // Set timeout to 10 seconds and maximumAge to 1 minute
        );
      } else {
        observer.error('Geolocation is not supported by your browser.');
      }
    });
  }
  

}
