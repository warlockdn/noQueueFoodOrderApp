import { Injectable, Injector } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ConstantsProvider } from '../constants/constants';
// import { AuthProvider } from '../auth/auth';

@Injectable()
export class InterceptorProvider implements HttpInterceptor {

  constants: any;

  constructor(public inject: Injector) {
    // this.constants = inject.get(ConstantsProvider);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const constants = this.inject.get(ConstantsProvider);

    if (constants.token) {
      request = request.clone({
        headers: request.headers.set('x-access-token', constants.token)
      });
    }

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        if (event.body.token) {
          constants.setToken(event.body.token);
        }
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 || err.status === 403) {
          console.log('Authentication Error');
          // this.auth.logout().then((response) => {
          //   this.router.navigate(['/login']);
          // })
        }
      }
    });
  }

}