import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  private authStatusSub: Subscription;


  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });

    this.form = this.formBuilder.group({
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [Validators.required ] ]
    });
  }

  onLogin(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(this.form.value.email, this.form.value.password);
  }

  get controls() {
    return this.form.controls;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
