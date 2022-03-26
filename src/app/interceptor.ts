import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(
        private cookieService:CookieService
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add the authorization headers
        const cloneReq = req.clone({
            setHeaders: {
                Authorization: localStorage.getItem('Token')!
            }
        })

        // call the next interceptor if there is any
        return next.handle(cloneReq).pipe(
            retry(1)
        );
  }
}