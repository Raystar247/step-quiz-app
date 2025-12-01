import type { SignInResponse } from '../../../api/client';
import { axiosClient } from '../../../infrastructure/api/client/axiosClient';
import type { SignInData, SignUpData, User } from '../domain/types';

const USER_ENDPOINT = '/api/user';

export const userApiService = {
    async signIn(data: SignInData): Promise<SignInResponse> {
        const response = await axiosClient.post<SignInResponse>(`${USER_ENDPOINT}/signin`, data);
        return response.data;
    },

    async signUp(data: SignUpData): Promise<User> {
        const response = await axiosClient.post<User>(`${USER_ENDPOINT}/signup`, data);
        return response.data;
    },

    async getUserInfo(userId: string): Promise<User> {
        const response = await axiosClient.get<User>(`${USER_ENDPOINT}/${userId}`);
        return response.data;
    },

    async logout(): Promise<void> {
        await axiosClient.post(`${USER_ENDPOINT}/logout`);
    }
};
