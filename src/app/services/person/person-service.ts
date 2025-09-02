import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
import { H } from '@angular/cdk/keycodes';


@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private baseUrl: string = environment.baseUrls.vaccinationCardBackendUrl;
  private headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_TOKEN' };

  constructor(private http: HttpClient) { }

  createPerson(createPersonRequestDto: CreatePersonRequestDto): Observable<CreatePersonResponseDto> {
    var headerCreate = {'Content-Type': 'application/json'}
    return this.http.post<CreatePersonResponseDto>(`${this.baseUrl}/api/Person/CreatePerson`, createPersonRequestDto,{ headers: headerCreate });
  }

  getPersonByCpf(cpf: string, token:string): Observable<GetPersonByCpfResponseDto> {

    var header = new HttpHeaders( {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let httpParams = new HttpParams();

    httpParams = httpParams.set('cpf', cpf);

    return this.http.get<GetPersonByCpfResponseDto>(`${this.baseUrl}/api/Person/GetPersonByCpf`, { headers: header , params: httpParams });
  }

  deletePersonById(deletePersonByIdRequestDto: DeletePersonByIdRequestDto, token:string): Observable<DeletePersonByIdResponseDto> {
    this.headers.Authorization = `Bearer ${token}`;
    let httpParams = new HttpParams();

     httpParams = httpParams.set('id', deletePersonByIdRequestDto.PersonId);

    return this.http.delete<DeletePersonByIdResponseDto>(`${this.baseUrl}/api/Person/DeletePersonById`, { headers: this.authHeaders(token), params: httpParams });
  }

  updatePerson(updatePersonRequestDto: UpdatePersonRequestDto, token:string): Observable<UpdatePersonResponseDto> {
    this.headers.Authorization = `Bearer ${token}`;
    return this.http.put<UpdatePersonResponseDto>(`${this.baseUrl}/api/Person/UpdatePerson`, updatePersonRequestDto, { headers: this.authHeaders(token) });
  }

  private authHeaders(token: string): { [key: string]: string } {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
}
