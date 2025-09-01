export interface CreatePersonRequestDto {
    Name: string,
    CPF: string,
    Password: string,
    Sex: string,
    DateOfBirth: Date,
    IsAdmin: boolean
}