export interface CreateVaccinationRequestDto {
  PersonId: string;
  VaccineId: string;
  Dose: Dose;
}


export enum Dose{
    firstDose=1,
    secondDose=2,
    thirdDose=3,
    firstReinforcement=4,
    secondReinforcement=5
}