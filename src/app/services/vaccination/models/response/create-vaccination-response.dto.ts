import { Dose } from "../request/create-vaccination-request.dto";

export interface CreateVaccinationResponseDto {
  vaccinationId: string,
  personId: string,
  vaccineId: string,
  doseAplied: Dose,
  dateOfApplication: Date
}


export interface VaccineSummaryDto{
    vaccineId:string,
    name: string
}