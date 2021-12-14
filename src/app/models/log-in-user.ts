export interface LogInUser {
    email: string,
    password: string
}

export interface SingUpUser {
    email: string,
    password: string
    role: string
}

export interface SingUpResponse {
    role: string, 
    email: string, 
    _id: string, 
    __v: string, 
}

export interface LogInResponse {
    access_token: string, 
    user: {
        email: string,
        role: string,
        _id: string,
    },
}
