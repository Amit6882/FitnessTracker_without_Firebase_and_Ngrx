import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, finalize } from 'rxjs/operators';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //Angular HTTP Interceptor: Modify Headers, Catch Errors and Trace Requests

        // TODO: replace hard coded token with actual token
        const TOKEN = 'xxx.yyy.zzz';

        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${TOKEN}`
            }
        });

        return next.handle(req)
        .pipe(
            // retry on failure
            retry(2),
            
            //Handle Error
            catchError((error: HttpErrorResponse) => {
                // TODO: Add error handling logic here
                alert(`HTTP ERROR: ${req.url}`);
                return throwError(error);
            }),

            finalize(() => {
                const profilingMsg = `${req.method} "${req.urlWithParams}"`;
                console.log(profilingMsg);
            })
            
            
        );
    }

}