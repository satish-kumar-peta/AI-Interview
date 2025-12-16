import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { AuthenticationService } from '../core/services/authentication.service';
import { markFormGroupTouched } from '../utilities/MarkFormGroupAsTouched';
import { SocialAuthService } from '@abacritt/angularx-social-login';


@Component({
  selector: 'app-selectprogram',
  templateUrl: './selectprogram.component.html',
  styleUrls: ['./selectprogram.component.css']
})
export class SelectprogramComponent {
  public show_suc = 1;
  public show_suc_error = '';
  public show_suc_msg = '';
  public show_group_error = '';
  public show_reg_error = '';
  public stdsucdata = 10;
  public show_alert = 1;
  public quali_list: any = [];
  public selection_on_quali: any = [];
  public myModal: any;
  public joinbtnjs: boolean = false;
  public registerform: FormGroup
  public suc_form: FormGroup
  public logininfo: any = [];
  public selected_program_name: any = [];

  constructor(private fb: FormBuilder, private authService: SocialAuthService, private _authenticationService: AuthenticationService, private router: Router) {
    this.registerform = this.fb.group({
      year: ['', [Validators.required]],
      stdgroup: ['', [Validators.required]],
      quali: ['', [Validators.required]]
    });

    this.suc_form = this.fb.group({
      stdSuc: [''],
    })
  }

  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // console.log(this.logininfo)
    this._authenticationService.get_qualification_list().subscribe(data => {
      this.quali_list = data;
      var filtered_quali = this.quali_list.filter((e: { inst_id: any; })=> e.inst_id == this.logininfo.stdInst)
      // console.log(filtered_quali)
      if(filtered_quali.length>0){
        this.selected_program_name = filtered_quali 
      }
      else{
        this.selected_program_name = this.quali_list 
      }
    })
  }

  get_std_about(stdnm: any) { 
    if (this.registerform.value.quali != null || this.registerform.value.year != null) {
      this.joinbtnjs = true;
    } 
  } 

  get_quali(stdquali: any) {
    // console.log(stdquali.target.value) 
    this.registerform.patchValue({
      stdgroup: ''
    });
    let selected_quali = this.quali_list.filter((e: { streamcode: any; stream: any; }) => e.streamcode == stdquali.target.value);
    this.selection_on_quali = selected_quali[0].exam;
    // console.log(this.selection_on_quali)
  } 

  emailvalidation(email_validate: any) {
    $('#emailid').on('keypress', function () {
      var re = /([A-Z0-9a-z_-][^@])+?@[^$#<>?]+?\.[\w]{2,4}/.test(email_validate.target.value);
      if (!re) {
        $('#error').show();
      } else {
        $('#error').hide();
      }
    })
  } 

  onSubmit() {
    if (this.registerform.value.stdgroup == undefined) {
      this.show_group_error = "Please select course";
    }
    else {
      var obj = {
        "stdCourse": this.registerform.value.stdgroup,
        "stdYear": this.registerform.value.year,
        "stdQualification": this.registerform.value.quali
      }  

      // console.log(obj);

      this._authenticationService.update_registerprogram(this.logininfo.stdSuc, obj).subscribe(data => { 
        //  console.log(data)
        localStorage.setItem('logindata', JSON.stringify(data.result[0]));
        localStorage.setItem('stdQualification', data.result[0].stdQualification);
        localStorage.setItem('studentprograms', JSON.stringify(data.result[0].stdCourse[0])); 
        window.location.href = '#/student/dashboard'; 
      })

    }
  }

}
