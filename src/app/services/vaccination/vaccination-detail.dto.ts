import { VaccinationSummaryDto } from "./models/response/get-vaccination-by-personId-response.dto";

export interface VaccineWithVaccinations {
  vaccineId: string;
  name: string;
  vaccinations: VaccinationSummaryDto[];
}