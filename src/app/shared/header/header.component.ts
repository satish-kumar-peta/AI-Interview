import { Component,OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent { 
  public logininfo : any=[];  
  public stdprograminfo : any=[]; 
  public togglevalue: Number=0;
  public errorimg : any = String;

  constructor( private _authenticationService: AuthenticationService){}

 
  
 menuchange(){

  const box = document.getElementById('appbody');

  if (this.togglevalue==0) {
     box?.classList.add('toggle-sidebar');
     this.togglevalue=1;
  }else{
    box?.classList.remove('toggle-sidebar');
    this.togglevalue=0;
  } 
 }
  selectmobilemenu:number;

  ngOnInit(){ 
    this.selectmobilemenu=0
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    this.stdprograminfo = localStorage.getItem('studentprograms');
    this.stdprograminfo = JSON.parse(this.stdprograminfo) 
    this.errorimg = "assets/img/profile.jpg"; 
  } 

  logout(): void {
    this._authenticationService.logout(this.logininfo);
  }


  gotomenu(x:number){
    this.selectmobilemenu=x
  }
}
