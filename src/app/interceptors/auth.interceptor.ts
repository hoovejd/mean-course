import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  // this method is very cool!
  // it will intercept all outgoing requests (to the api) and set the user token in the authorization variable within the request header
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    if (authToken) {
      console.log('attaching outgoing token to api request: ' + authToken);
    } else {
      console.log('no token exists, you need to login!');
    }

    // you must not modify the original request, so clone it and set the token! Adding Bearer is just following convention!
    const authRequest = req.clone({ headers: req.headers.set('Authorization', `Bearer ${authToken}`) });
    return next.handle(authRequest);
  }
}
