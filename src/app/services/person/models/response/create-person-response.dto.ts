export interface CreatePersonResponseDto{
    PersonId: string,
    Name: string,
    CPF: string,
    Sex: string,
    DateOfBirth: Date,
    IsAdmin: boolean,
    CreatedAt: Date,
    UpdatedAt: Date
}