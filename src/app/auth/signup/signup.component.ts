import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mustMatch } from './must-match.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [ '', Validators.required ],
      surname: [ '', Validators.required ],
      dob: [ new Date(), Validators.required ],
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [Validators.required, Validators.minLength(8) ] ],
      confirmPassword: [ '', Validators.required ]
    },
    {
      validators: mustMatch('password', 'confirmPassword')
    });
  }

  get controls() {
    return this.form.controls;
  }

  onSignup(): void {

  }
}
