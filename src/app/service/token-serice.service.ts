import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenSericeService implements HttpInterceptor{

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('login')) {
      return next.handle(req);
    }else{
    const token=sessionStorage.getItem('token')
     const modifiedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` 
      }
    });
    return next.handle(modifiedRequest);}
  }
}
