import axios from "axios";
import type { SignInData, SignInResponse, User } from "../type";

const ENDPOINT_URL = 'http://localhost:3002/user'; // TODO: User処理のURLを追記する

const userApi = {
    async signIn(signInData: SignInData): Promise<SignInResponse> {
            console.log("ログインAPI::: start");
            const users = (await axios.get<User[]>(`${ENDPOINT_URL}`)).data;
            const user = users.find((data: User) => data.email == signInData.email);
            console.log(users);
            if (user == undefined || user.password != signInData.password) {
                console.log("ログイン処理::: fail")
                return { isAuthenticated: false, id: "" };
            }
            
            console.log("ログイン処理::: succeed")
            return { isAuthenticated: true, id: user.id };
    },
    async getUserInfo(id: string): Promise<User | undefined> {
            const users = (await axios.get<User[]>(`${ENDPOINT_URL}`)).data;
            return users.find((data: User) => data.id == id);
    }
};

export default userApi;