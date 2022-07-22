import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from '../models/auth-data.model';
import { environment } from 'src/environments/environment';

const USER_URL = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenTimer: any;
  private isAuthenticated: boolean = false;
  private token: string;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    return this.http.post(`${USER_URL}/signup`, authData).subscribe({
      complete: () => this.router.navigate(['/']),
      error: (e) => this.authStatusListener.next(false)
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string; expiresIn: number; userId: string }>(`${USER_URL}/login`, authData).subscribe({
      next: (response) => {
        this.token = response.token;
        if (this.token) {
          const expiresInDurationMilliseconds = response.expiresIn * 1000;
          this.setAuthTimer(expiresInDurationMilliseconds);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          console.log('got new incoming token from api: ' + this.token);
          this.saveAuthData(this.token, new Date(new Date().getTime() + expiresInDurationMilliseconds), this.userId);
          this.router.navigate(['/']);
        }
      },
      error: (e) => this.authStatusListener.next(false)
    });
  }

  loadExistingAuth() {
    const authInformation = this.getAuthData();
    if (!authInformation) return;
    const expiresInMilliseconds = authInformation.expirationDate.getTime() - new Date().getTime();
    if (expiresInMilliseconds > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresInMilliseconds);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  // create callback timer that calls logout after timer expires
  private setAuthTimer(milliseconds: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, milliseconds);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) return;
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
