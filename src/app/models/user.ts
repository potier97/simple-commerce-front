export interface UserData {
    idUser: number | null,
    idDocType: DocTypeData,
    idUserType: UserTypeData,
    associated: UserData | null,
    userDoc: number,
    name: string,
    lastName: string,
    userPass: string,
    userMail: string,
    userAddress: string,
    userPhone: string,
    userCreated: string
}

export interface DocTypeData { 
    idDocType: number | null,
    name: string, 
}

export interface UserTypeData { 
    idUserType: number | null,
    name: string, 
} 