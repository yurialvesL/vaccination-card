import { VaccineSummaryDto } from "./create-vaccination-response.dto";

export interface GetVaccinationByPersonIdResponseDto {
  vaccinations: VaccineSummaryDto[];
}
