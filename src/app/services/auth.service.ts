import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from '../models/auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenTimer: NodeJS.Timer;
  private isAuthenticated: boolean = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post('http://localhost:3000/api/user/signup', authData).subscribe((response) => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string; expiresIn: number }>('http://localhost:3000/api/user/login', authData).subscribe((response) => {
      this.token = response.token;
      if (this.token) {
        const expiresInDuration = response.expiresIn; // get token expiration duration from api
        this.tokenTimer = setTimeout(() => {
          // create callback timer that calls logout after timer expires
          this.logout();
        }, expiresInDuration * 1000);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        console.log('got new incoming token from api: ' + this.token);
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }
}
