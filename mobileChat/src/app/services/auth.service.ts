import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: Http) { }
  login(email: String, password: String): Promise<any> {
    const data = {email: email, clave: password};
    return this.http.post(environment.api + 'login/cuenta', JSON.stringify(data)).toPromise()
    .then( r =>
      r.json()
    ).catch( error => {
      error.json();
    });
  }
}
