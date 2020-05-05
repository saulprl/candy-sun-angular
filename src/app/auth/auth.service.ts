import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: string;
  private userName: string;
  private token: string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  createUser(name: string, surname: string, dob: Date, email: string, password: string) {
    const authData = new AuthData(email, password);
    authData.setName(name);
    authData.setSurname(surname);
    authData.setDob(dob);

    this.http.post(BACKEND_URL + 'signup', authData).subscribe(response => {
      this.router.navigate(['/employees']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string) {
    const authData = new AuthData(email, password);

    this.http.post<{ token: string, expiresIn: number, userId: string, userName: string }>(
      BACKEND_URL + 'login',
      authData
    )
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      const name = response.userName;
      this.userName = name;

      if (token) {
        this.userId = response.userId;

        const expiresIn = response.expiresIn;
        this.setAuthTimer(expiresIn);

        this.isAuthenticated = true;
        this.authStatusListener.next(true);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + (expiresIn * 1000));

        this.saveAuthData(token, expirationDate, this.userId, this.userName);

        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }

    const now = new Date();
    const expiresIn = authInfo.expiration.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  getUserId() {
    return this.userId;
  }

  getUserName() {
    return this.userName;
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ', duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, userName: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    this.userName = localStorage.getItem('userName');

    if (!token || !expiration) {
      return;
    }

    return {
      token,
      expiration: new Date(expiration),
      userId
    };
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  }
}
