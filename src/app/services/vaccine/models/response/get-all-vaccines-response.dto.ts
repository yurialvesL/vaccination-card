export interface GetAllVaccinesResponseDto {
  vaccines: VaccineSummaryDto[];
}

export interface VaccineSummaryDto {
  vaccineId: string;
  name: string;
}
