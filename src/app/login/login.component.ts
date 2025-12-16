import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { AuthenticationService } from '../core/services/authentication.service';
import { EventService } from '../core/services/eventlog.service';
import { concat } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  ipAddress: string;
  device_info: any;
  ngOnInit() {
    // if (localStorage.getItem('logindata')) {
    //       this.router.navigate(['student']);
    // }
    this.IPAddress_get()
  }


  public show_log_error = '';

  logdata: FormGroup;
  constructor(private fb: FormBuilder, private _authenticationService: AuthenticationService, private router: Router, private _eventservice: EventService) {
    this.logdata = this.fb.group({
      stdMobileNo: ['', [Validators.required]],
      stdPwd: ['', [Validators.required]],
    });
  }

  onLogin() {
    // console.log(this.logdata.value)
    let stdMobileNo = this.logdata.value.stdMobileNo;
    let stdPwd = this.logdata.value.stdPwd;

    var obj = {
      "stdMobileNo": stdMobileNo,
      "stdPwd": stdPwd,
    };
    // console.log(obj); 
    this._authenticationService.post_login(obj).subscribe(data => {
      // console.log(data);
      if (data.result.length == 0) {
        this.show_log_error = "Invalid Credentials";
      } else {
        if (data.result == 'Mobile number not registered') {
          this.show_log_error = data.result;
        } else {
          this.show_log_error = '';
          data.result[0].device_info = this.device_info
          data.result[0].validation = 1
          const videoPlayMongo =
          {
            "userId": stdMobileNo,
            "eventCategory": 'Login',
            "eventDetails": data.result[0],
            "title1": data.result[0].stdQualification,
            "result": "Login",
            "device_info": this.device_info
          }
          this._eventservice.post_event(videoPlayMongo).subscribe(
            (eventdata: any) => {

              // console.log(eventdata);

              // console.log(data.result[0]);
                if(data.result[0].stdQualification=='' || data.result[0].stdQualification==undefined){
                  localStorage.setItem('logindata',JSON.stringify(data.result[0]));
                  window.location.href='#/login'  
                }else{
                  localStorage.setItem('logindata',JSON.stringify(data.result[0]));
                  localStorage.setItem('stdQualification',data.result[0].stdQualification);
                  localStorage.setItem('studentprograms',JSON.stringify(data.result[0].stdCourse[0]));
                  window.location.href='#/admin'  
                }
            })

        }
      }
    });
  }

  clearfunction() {
    this.show_log_error = '';
  }

  gotoForgot() {
    window.location.href = '#/forgetpassword'
  }

  IPAddress_get() {
    this._authenticationService.getIpAddress().subscribe(data => {
      this.ipAddress = data.ip;
      // console.log('User IP Address:', this.ipAddress);
      this.getLocation()
    })
  }

  getLocation() {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const browserName = navigator.appName;
    const browserVersion = navigator.appVersion;
    const platform = navigator.platform;
    const language = navigator.language;
    var device_address: any = {}
    // console.log(navigator.geolocation)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Reverse geocoding using Nominatim
          const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
          // console.log(nominatimApiUrl)

          fetch(nominatimApiUrl)
            .then(response => response.json())
            .then(data => {
              data.address.latitude = latitude
              data.address.longitude = longitude
              device_address.address = data.address;
              // Parse the address as needed for your application logic.
            })
            .catch(error => {
              console.error("Error fetching address information:", error);
            });
        },
        (error) => {
          // Handle geolocation errors as before.
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    device_address.browserinfo = {
      "userAgent": userAgent,
      "BrowserName": browserName,
      "BrowserVersion": browserVersion,
      "Platform": platform,
      "Language": language,
      "ScreenSize": screenWidth + "x" + screenHeight,
    }
    device_address.ip_Address = this.ipAddress
    this.device_info = device_address
    // console.log(device_address)

  }

  @HostListener('document:keyup.enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.logdata.valid) {
      this.onLogin();
    }
  }

}


