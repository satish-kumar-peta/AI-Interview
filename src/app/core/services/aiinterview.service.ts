import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { intewrviewapi } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})

export class interviewService {
  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }


  getAiInterviewData(): Observable<any> {
    // return this._http.get<any>(`${intewrviewapi}/get-data/123456789`);
    return this._http.get<any>(`${intewrviewapi}/get-data/987654321`);
  }

  speechToText(data: FormData) {
    return this._http.post<any>('http://localhost:3000/stt', data);
  }

}
