export interface LogInUser {
    username: string,
    password: string
}


export interface LogInResponse {
    status: string, 
    code: number,
    message: string,
    jwt: string,  
}
