export interface GetPersonByCpfResponseDto {
    personId: string;
    name: string;
    cpf: string;
    sex: string;
    dateOfBirth: Date;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}
