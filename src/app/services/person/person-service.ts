import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment/environment.prod';
import { CreatePersonResponseDto } from './models/response/create-person-response.dto';
import { CreatePersonRequestDto } from './models/request/create-person-request.dto';
import { Observable } from 'rxjs/internal/Observable';
import { GetPersonByCpfResponseDto } from './models/response/get-person-by-cpf-response.dto';
import { GetPersonByCpfRequestDto} from './models/request/get-person-by-cpf-request.dto';
import { DeletePersonByIdResponseDto } from './models/response/delete-person-by-id-response.dto';
import { DeletePersonByIdRequestDto } from './models/request/delete-person-by-id-request.dto';
import { UpdatePersonResponseDto } from './models/response/update-person-response.dto';
import { UpdatePersonRequestDto } from './models/request/update-person-request.dto';


@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private baseUrl: string = environment.baseUrls.vaccinationCardBackendUrl;
  private headers = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }

  createPerson(createPersonRequestDto: CreatePersonRequestDto): Observable<CreatePersonResponseDto> {

    return this.http.post<CreatePersonResponseDto>(`${this.baseUrl}/person/CreatePerson`, createPersonRequestDto,{ headers: this.headers });
  }

  getPersonByCpf(getPersonByCpfRequestDto: GetPersonByCpfRequestDto): Observable<GetPersonByCpfResponseDto> {

    let httpParams = new HttpParams();

    httpParams = httpParams.set('cpf', getPersonByCpfRequestDto.Cpf);

    return this.http.get<GetPersonByCpfResponseDto>(`${this.baseUrl}/person/GetPersonByCpf`, { headers: this.headers , params: httpParams });
  }

  deletePersonById(deletePersonByIdRequestDto: DeletePersonByIdRequestDto): Observable<DeletePersonByIdResponseDto> {
     let httpParams = new HttpParams();

     httpParams = httpParams.set('id', deletePersonByIdRequestDto.PersonId);

    return this.http.delete<DeletePersonByIdResponseDto>(`${this.baseUrl}/person/DeletePersonById`, { headers: this.headers, params: httpParams });
  }

  updatePerson(updatePersonRequestDto: UpdatePersonRequestDto): Observable<UpdatePersonResponseDto> {
    return this.http.put<UpdatePersonResponseDto>(`${this.baseUrl}/person/UpdatePerson`, updatePersonRequestDto, { headers: this.headers });
  }
}
