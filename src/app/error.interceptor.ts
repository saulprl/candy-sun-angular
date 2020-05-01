import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error desconocido.';
        if (error.error.message) {
          errorMessage = error.error.message;
        }

        this.dialog.open(ErrorComponent,
          {
            data: {
              message: errorMessage
            }
          }
        );

        return throwError(error);
      })
    );
  }
}
