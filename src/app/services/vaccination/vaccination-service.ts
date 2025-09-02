import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment/environment.prod';
import { CreateVaccinationResponseDto } from './models/response/create-vaccination-response.dto';
import { CreateVaccinationRequestDto } from './models/request/create-vaccination-request.dto';
import { Observable } from 'rxjs/internal/Observable';
import { GetVaccinationByPersonIdResponseDto } from './models/response/get-vaccination-by-personId-response.dto';
import { DeleteVaccinationByIdResponseDto } from './models/response/delete-vaccination-by-id-response.dto';

@Injectable({
  providedIn: 'root'
})
export class VaccinationService {
  private baseUrl: string = environment.baseUrls.vaccinationCardBackendUrl;
  private headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_TOKEN' };

  constructor(private http: HttpClient) { }


  createVaccination(data: CreateVaccinationRequestDto, token:string): Observable<CreateVaccinationResponseDto> {
    this.headers.Authorization = `Bearer ${token}`;
    return this.http.post<CreateVaccinationResponseDto>(`${this.baseUrl}/api/Vaccination/CreateVaccination`, data, { headers: this.headers });
  } 

  getVaccinationByPersonId(personId: string, token:string): Observable<GetVaccinationByPersonIdResponseDto> {
    this.headers.Authorization = `Bearer ${token}`;

     let httpParams = new HttpParams();

     httpParams = httpParams.set('id', personId);

    return this.http.get<GetVaccinationByPersonIdResponseDto>(`${this.baseUrl}/api/Vaccination/GetAllVaccinationsByPersonId`, { headers: this.headers, params: httpParams });
  }

  deleteVaccinationById(vaccinationId: string, token:string): Observable<DeleteVaccinationByIdResponseDto> {
    this.headers.Authorization = `Bearer ${token}`;

    let httpParams = new HttpParams();

     httpParams = httpParams.set('id', vaccinationId);
    return this.http.delete<DeleteVaccinationByIdResponseDto>(`${this.baseUrl}/api/Vaccination/DeleteVaccination`, { headers: this.headers, params: httpParams });
  }

}
