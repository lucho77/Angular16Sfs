import { Error } from '../_models/error';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { RefreshTokenResponse } from '../_models/refreshTokenResponse';
import { DTOError } from '../_models/dtoError';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private refreshSubject: Subject<RefreshTokenResponse> = new Subject<RefreshTokenResponse>();

    constructor(private authenticationService: AuthenticationService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log('entro al interceptor');
             // console.log(err);
             if (err.status === 401) {
                // auto logout if 401 response returned from api
                const currentUser = JSON.parse(localStorage.getItem('currentUser')!);

                if(currentUser.refreshToken){
                        this.refreshToken(currentUser).subscribe({
                            next:(data)=>{
                                if(data.tokenError){
                                    console.error('Error change token ');

                                    this.authenticationService.logout();
                                    location.reload();                
    
                                }
                                console.log('change token with succes');
                                return;
                            },error:(e)=>{
                                console.error('Error change token ');

                                this.authenticationService.logout();
                                location.reload();                
                            }
                            

                        });
                }
            }else if (err.status === 500){
                if (err.error !== 'undefined') {
                    const error = new Error(err.error.mensaje, err.error.errorBusiness, err.error.tokenError, err.error.tokenExpired,
                         false, null, null, null, null, null);
                    console.log('error business');
                     console.log(error);
                   // this.errorService.setError(error);
                   return throwError(() => error);
                } else {
                    console.log('error grave ');
                    const error = new Error('Error Grave', false, false, false, true, null, null, null, null, null);
                    // this.errorService.setError(error);
                    return throwError(() => error);
                }
    
            }
//            const error = err.error;
            // this.errorService.limpiar();
         }));
    }

    private refreshToken(user:any):Observable<RefreshTokenResponse>{
          return new Observable<RefreshTokenResponse>((observer) => {
        this.authenticationService.refreshToken(user).subscribe(
            {
                next: (token) => {
                    if(token.tokenError){
                        this.refreshSubject.next(token);
                    }else{
                        user.token = token.token;
                        user.refreshToken = token.refreshToken;
                        localStorage.setItem('currentUser',JSON.stringify(user));
                        this.refreshSubject.next(token);

                    }
                },error: (e)=>{
                    let t = new RefreshTokenResponse();
                    t.tokenError = true;
                    let error = new DTOError();
                    error.mensaje ="se ha producido un error al intentar refrescar el token";
                    this.refreshSubject.next(t);
                }
            });
        
        })
    };
}
