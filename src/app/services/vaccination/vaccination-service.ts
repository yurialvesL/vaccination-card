import { HttpClient } from '@angular/common/http';
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
  private headers = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }


  createVaccination(data: CreateVaccinationRequestDto): Observable<CreateVaccinationResponseDto> {
    return this.http.post<CreateVaccinationResponseDto>(`${this.baseUrl}/vaccination/CreateVaccination`, data, { headers: this.headers });
  } 

  getVaccinationByPersonId(personId: string): Observable<GetVaccinationByPersonIdResponseDto> {
    return this.http.get<GetVaccinationByPersonIdResponseDto>(`${this.baseUrl}/vaccination/GetVaccinationByPersonId/${personId}`, { headers: this.headers });
  }

  deleteVaccinationById(vaccinationId: string): Observable<DeleteVaccinationByIdResponseDto> {
    return this.http.delete<DeleteVaccinationByIdResponseDto>(`${this.baseUrl}/vaccination/DeleteVaccinationById/${vaccinationId}`, { headers: this.headers });
  }

}
