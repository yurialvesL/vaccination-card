import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { CreateVaccineResponseDto } from './models/response/create-vaccine-respnse.dto';
import { CreateVaccineRequestDto } from './models/request/create-vaccine-request.dto';
import { Observable } from 'rxjs/internal/Observable';
import { GetAllVaccinesResponseDto } from './models/response/get-all-vaccines-response.dto';
import { DeleteVaccineResponseDto } from './models/response/delete-vaccine-response.dto';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {
  private baseUrl: string = environment.baseUrls.vaccinationCardBackendUrl;
  private headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_TOKEN' };

  constructor(private http: HttpClient) { }

  createVaccine(data: CreateVaccineRequestDto, token: string): Observable<CreateVaccineResponseDto> {
    this.headers.Authorization = `Bearer ${token}`;
    return this.http.post<CreateVaccineResponseDto>(`${this.baseUrl}/vaccine/CreateVaccine`, data, { headers: this.headers });
  }

  getAllVaccines(token: string): Observable<GetAllVaccinesResponseDto> {
    this.headers.Authorization = `Bearer ${token}`;
    return this.http.get<GetAllVaccinesResponseDto>(`${this.baseUrl}/vaccine/GetAllVaccines`, { headers: this.headers });
  }

  deleteVaccine(vaccineId: string, token: string): Observable<DeleteVaccineResponseDto> {
    this.headers.Authorization = `Bearer ${token}`;
    let httpParams = new HttpParams().set('vaccineId', vaccineId);

    return this.http.delete<DeleteVaccineResponseDto>(`${this.baseUrl}/vaccine/DeleteVaccine/DeleteVaccine`, { headers: this.headers, params: httpParams });
  } 
}