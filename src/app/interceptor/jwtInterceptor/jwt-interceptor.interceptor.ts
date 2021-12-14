import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '@app/services/auth/auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor( private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("Interceptor generated", request.url)

    const authReq = request.clone({
      setHeaders: {
        'X-api-key-access': `123456789`,
      }
    })

    if( !request.url.includes("login") || !request.url.includes("product")){  
      const authToken = this.authService.userTokenValue;
      const authHeaderReq = request.clone({
        setHeaders: {
          'X-api-key-access': `123456789`,
          'authorization': `Bearer ${authToken}`
        }
      })
      
      return next.handle(authHeaderReq)
        .pipe(catchError((err: HttpErrorResponse) => {
          if(err.status === 403 || err.status === 401){ 
            this.authService.logout();
            return throwError(err);
          }else{ 
            return throwError(err);
          }
        }))
    }

    return next.handle(authReq);
  }
}
