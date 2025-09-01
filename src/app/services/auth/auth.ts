import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { LoginRequestDto } from './models/request/login-request.dto';
import { Observable } from 'rxjs';
import { LoginResponseDto } from './models/response/login-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.baseUrls.vaccinationCardBackendUrl;
  private headers = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }


  loginPerson(loginRequestDto: LoginRequestDto): Observable<LoginResponseDto>{

    return this.http.post<LoginResponseDto>(`${this.baseUrl}/auth/login`, loginRequestDto, { headers: this.headers });
  }
}