export type SignInData = {
    email: string;
    password: string;
}

export type SignUpData = {
    username: string;
    email: string;
    password: string;
}

export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
}

export type SignInResponse = {
    isAuthenticated: boolean;
    id: string;
}
