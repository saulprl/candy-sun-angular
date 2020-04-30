import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mustMatch } from './must-match.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  private authStatusSub: Subscription;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });

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
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.createUser(this.form.value.name, this.form.value.surname, this.form.value.dob,
      this.form.value.email, this.form.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
