import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { AuthenticationService } from '../core/services/authentication.service';
import { markFormGroupTouched } from '../utilities/MarkFormGroupAsTouched';
import { SocialAuthService } from '@abacritt/angularx-social-login';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  public show_suc = 1; 
  public show_suc_error = '';
  public register_success = 0;
  public show_suc_msg = '';
  public show_group_error = '';
  public show_reg_error = '';
  public stdsucdata = 10;
  public show_alert = 1;
  public quali_list : any =[]; 
  public selection_on_quali : any =[]; 
  public myModal: any;
  public joinbtnjs: boolean = false;
  registerform: FormGroup 
  suc_form: FormGroup  
  constructor(private fb: FormBuilder,private authService: SocialAuthService,private _authenticationService: AuthenticationService, private router: Router) { 
    this.registerform = this.fb.group({ 
      name:['',[ Validators.required]],
      emailid:[''],
      mobile:['',[Validators.required]],  
      about:['',[Validators.required]], 
    });
    
    this.suc_form = this.fb.group({ 
      stdSuc:[''],
    })
  }

  ngOnInit() {  
    this._authenticationService.get_qualification_list().subscribe(data => { 
      this.quali_list = data;
      // console.log(this.quali_list)
    })  
  } 

  get_std_about(stdnm: any){
    // console.log(stdnm.target.value);
    let std_about = stdnm.target.value
    if(std_about=='Aditya'){
      this.joinbtnjs = false;
      this.show_suc = 2;
    }else{ 
      if(this.registerform.value.name!='' && this.registerform.value.mobile!='' && this.registerform.value.about!=''){ 
        this.joinbtnjs = true;
      }
      this.show_suc = 1;
    }
  }

  getSUC(stdsuc: any){ 
    this.show_reg_error = '';
    let std_suc = stdsuc.target.value;
    let std_mbl = this.registerform.value.mobile;
    if(std_suc!=null && std_suc.length==10){ 
      this.show_suc_error = '';
      // console.log(std_suc,std_mbl); 
      var obj = {
        "studentNo": std_suc,
        "mobileNo": std_mbl
      } 
      // console.log(obj)
      this._authenticationService.post_st_suc(obj).subscribe(data => {
        // console.log(data);
        if(data.result.length==0){
          this.stdsucdata = 2;
          if(std_mbl.length!=10){ 
            this.show_suc_error = "Enter Mobile Number of Length 10";
          }else{
            this.show_suc_error = '';
            this.show_suc_msg = "Student Data Not Found"; 
          }
        }else{ 
          this.stdsucdata = 1;
          this.show_suc_msg = ''; 
          this.joinbtnjs = true;
        } 
      }); 
    }
    else{
      this.show_suc_error = "Enter Maximum Lenght of 10"; 
    }
  }

  get_quali(stdquali: any){   
    // console.log(stdquali.target.value) 
    this.registerform.patchValue({
      stdgroup: '' 
    });
    let selected_quali = this.quali_list.filter((e: {_id: any; stream: any; }) => e._id.stream == stdquali.target.value);
    this.selection_on_quali = selected_quali[0]._id.exam;
    // console.log(this.selection_on_quali)
  }

  
  emailvalidation(email_validate: any){ 
    $('#emailid').on('keypress', function() {
      var re = /([A-Z0-9a-z_-][^@])+?@[^$#<>?]+?\.[\w]{2,4}/.test(email_validate.target.value);
      if(!re) {
          $('#error').show();
      } else {
          $('#error').hide();
      }
    })
  }

  onSubmit(){  
    // console.log(this.registerform.value)
    if(this.registerform.value.name.length<3 || this.registerform.value.name=='' || this.registerform.value.mobile.length!=10 || this.registerform.value.mobile=='' || this.registerform.value.about==''){  
      this.show_reg_error = '* Fields are required'
    }else{
    
      var obj = {
          "stdMobileNo": this.registerform.value.mobile,
          "stdName": this.registerform.value.name, 
          "stdAbout": this.registerform.value.about,
          "stdSuc": this.suc_form.value.stdSuc,
          "stdEmail": this.registerform.value.emailid, 
      } 
      //  console.log(obj)
    this._authenticationService.post_register(obj).subscribe(data => {
      // console.log(data)
      if (data.status == 402) { 
        this.show_reg_error = data.result;
      }
      else{
        if(data.result=='Mobile Number Already Registered'){
          this.show_reg_error = data.result; 
        }else{ 
          this.register_success = 1
          // alert("User registered Successfully..!")
          // window.location.href='#/login';
        }
      }
    })

  }
  }
 
}
