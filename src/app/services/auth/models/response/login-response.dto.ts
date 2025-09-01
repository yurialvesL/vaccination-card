export interface LoginResponseDto{
    personId: string,
    token: string,
    refreshToken: string,
    expiresAt: Date,
    refreshTokenExpiresAt: Date
}