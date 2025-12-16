import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { ForgotService } from '../core/services/forgot.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent {

  logdata: FormGroup;  
  frg_pass_error='';
  show_error =1;
   
  constructor(private fb: FormBuilder, private _authenticationService: ForgotService, private router: Router) { 
    this.logdata = this.fb.group({
      stdMobileNo: ['', [Validators.required]],
      
    });  
  }
  
  forgot() {
    let stdMobileNo = this.logdata.value.stdMobileNo; 
   
    this._authenticationService.forgotpassword(stdMobileNo).subscribe((data)=>{
    //  console.log(data)
     if(data.result=='Mobile Number Not Registered'){
        this.frg_pass_error =data.result;
        this.show_error = 1
     }
     else{
        this.show_error=2
     } 
    }); 
  }
  
  chng_(){
    this.frg_pass_error =''
  }
}
