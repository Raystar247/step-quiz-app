import { apiClient, handleApiError } from '../../../infrastructure/api/apiClient';
import type { SignInData, SignInResponse, User, SignUpData } from '../../../models';

/**
 * Feature: users API
 * Purpose: ユーザー認証・取得の HTTP クライアントラッパー
 */

const endpoint = `/user`;

export const userApi = {
        async signIn(signInData: SignInData): Promise<SignInResponse> {
                const res = await apiClient.get<User[]>(endpoint);
                if (res.error) {
                        handleApiError(res.error);
                        return { isAuthenticated: false, id: '' };
                }
                const user = res.data.find((u) => u.email === signInData.email);
                if (!user || user.password !== signInData.password) return { isAuthenticated: false, id: '' };
                return { isAuthenticated: true, id: user.id };
        },

        async signUp(signUpData: SignUpData): Promise<boolean> {
                const res = await apiClient.post<User>(endpoint, signUpData);
                if (res.error) {
                        handleApiError(res.error);
                        return false;
                }
                // json-server returns created resource; be permissive and return true if data exists
                return !!res.data?.id;
        },

        async getUserInfo(id: string): Promise<User | undefined> {
                const res = await apiClient.get<User[]>(endpoint);
                if (res.error) {
                        handleApiError(res.error);
                        return undefined;
                }
                return res.data.find((u) => u.id === id);
        },
};