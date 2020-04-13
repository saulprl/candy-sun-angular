import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [Validators.required ] ]
    });
  }

  onLogin(): void {

  }

  get controls() {
    return this.form.controls;
  }

}
