import axios from "axios";
import type { SignInData, SignInResponse, User, SignUpData } from "../type";

const ENDPOINT_URL = 'http://localhost:3002/user'; // TODO: User処理のURLを追記する

const userApi = {
    async signIn(signInData: SignInData): Promise<SignInResponse> {

            const users = (await axios.get<User[]>(`${ENDPOINT_URL}`)).data;
            const user = users.find((data: User) => data.email == signInData.email);
            if (user == undefined || user.password != signInData.password) {
                return { isAuthenticated: false, id: "" };
            }
            
            return { isAuthenticated: true, id: user.id };
    },
    async signUp(signUpData: SignUpData): Promise<boolean> {
            const res = await axios.post(`${ENDPOINT_URL}`, signUpData);
            return (res.statusText == 'OK');    // post処理が正しく行われた場合にtrueが返される
    },
    async getUserInfo(id: string): Promise<User | undefined> {
            const users = (await axios.get<User[]>(`${ENDPOINT_URL}`)).data;
            return users.find((data: User) => data.id == id);
    }
};

export default userApi;