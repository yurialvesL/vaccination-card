import { Dose } from "../request/create-vaccination-request.dto";
import { VaccineSummaryDto } from "./create-vaccination-response.dto";

export interface GetVaccinationByPersonIdResponseDto {
  vaccinations: VaccinationSummaryDto[];
}


export interface VaccinationSummaryDto{
    vaccinationId: string;
    personId: string;
    vaccine: VaccineSummaryDto;
    doseApplied: Dose;
    dateOfApplied: Date;
}