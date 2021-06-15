export interface LogInUser {
    mail: string,
    password: string
}


export interface LogInResponse {
    message: string,
    token: string,
    userId: string
}
