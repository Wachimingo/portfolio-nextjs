export interface AuthProps {
    type: string,
    providers: any,
}

export type Response = {
    status: string,
    token: string,
    user: {
        balance: number,
        canBorrow: boolean,
        email: string,
        name: string,
        role: string,
        tn: string,
        _id: string
    }
}

export type Login = {
    email: string,
    password: string
}

export type Register = {
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
}