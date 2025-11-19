import { axiosClient } from '../../../infrastructure/api/client/axiosClient';
import type { SignInData, SignInResponse, User, SignUpData } from "../type";

/**
 * Feature: users API
 * Purpose: ユーザー認証・取得の HTTP クライアントラッパー
 */

const endpoint = `/user`;

export const userApi = {
        async signIn(signInData: SignInData): Promise<SignInResponse> {
                const users = (await axiosClient.get<User[]>(`${endpoint}`)).data;
                const user = users.find((data: User) => data.email === signInData.email);
                if (user === undefined || user.password !== signInData.password) {
                        return { isAuthenticated: false, id: "" };
                }
                return { isAuthenticated: true, id: user.id };
        },
        async signUp(signUpData: SignUpData): Promise<boolean> {
                const res = await axiosClient.post(`${endpoint}`, signUpData);
                return res.statusText === 'OK';
        },
        async getUserInfo(id: string): Promise<User | undefined> {
                const users = (await axiosClient.get<User[]>(`${endpoint}`)).data;
                return users.find((data: User) => data.id === id);
        }
};