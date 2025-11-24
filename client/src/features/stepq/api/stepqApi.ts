import { apiClient, handleApiError, type Validator, type ApiError } from '../../../infrastructure/api/apiClient';
import type { Answer, QGroup, Question, Trial, TrialPostData, UnitString } from '../type';
import type { User } from '../../users/type';

/**
 * Feature: stepq API (client wrapper)
 * Purpose: HTTP 経由の stepq 関連 CRUD を提供するユーティリティ
 *
 * 内部構成
 * - domain: 型定義は ../type
 * - usecase: ここは薄いラッパー（HTTP 呼び出し）
 * - service/infra: axiosClient を利用
 * - ui: なし
 * - hooks: なし
 * - store: なし
 */

const endpointUser = `/user`;
const endpointTrial = `/trial`;
const endpointQgroup = `/qgroup`;
const endpointQuestion = `/question`;
const endpointAnswer = `/answer`;

export const stepqApi = {
    async generateTrial(qgroupKeyword: string, passphrase: string, userId: string): Promise<string> {
        // Fetch qgroups via unified apiClient
        const qgroupsRes = await apiClient.get<QGroup[]>(`${endpointQgroup}`);
        if (qgroupsRes.error) {
            // central error handling (logs); return empty to preserve previous behavior
            handleApiError(qgroupsRes.error);
            return '';
        }
        const qgroup = qgroupsRes.data.find((data: QGroup) => data.title === qgroupKeyword );
        if (!qgroup || passphrase !== qgroup.passphrase) return '';

        const trialsRes = await apiClient.get<Trial[]>(`${endpointTrial}`);
        if (trialsRes.error) {
            handleApiError(trialsRes.error);
            return '';
        }
        const trial = trialsRes.data.find((data: Trial) => data.userId === userId && data.qgroupId === qgroup.id);
        if (trial) return trial.id;

        const trialData: TrialPostData = {
            qgroupId: qgroup.id,
            userId,
            index: 1,
            startTime: dateToISOStringSeconds(new Date()),
        };
        const postRes = await apiClient.post<Trial>(`${endpointTrial}`, trialData);
        if (postRes.error || !postRes.data) {
            handleApiError(postRes.error ?? { type: 'unknown', message: 'Failed to create trial' });
            return '';
        }
        return postRes.data.id;
    },
    async fetchQuestionByIndex(qgroupId: string, index: number): Promise<Question | undefined> {
        // Validate that response is array and contains at least one item
        const validator: Validator<Question[]> = (data: Question[]): ApiError | null => {
            if (!Array.isArray(data)) return { type: 'validation', message: 'Unexpected response' } as ApiError;
            if (data.length === 0) return { type: 'validation', code: 'NotFound', message: 'No question found' } as ApiError;
            return null;
        };
        const res = await apiClient.get<Question[]>(endpointQuestion, { qgroupId, index }, validator);
        if (res.error) {
            if ((res.error.code as any) === 'NotFound') return undefined;
            handleApiError(res.error);
            return undefined;
        }
        return res.data[0];
    },
    async fetchQuestionGroup(qgroupId: string): Promise<QGroup | undefined> {
        const res = await apiClient.get<QGroup[]>(endpointQgroup, { qgroupId });
        if (res.error) {
            handleApiError(res.error);
            return undefined;
        }
        return res.data.length === 1 ? res.data[0] : undefined;
    },
    async fetchTrial(id: string): Promise<Trial | undefined> {
        const res = await apiClient.get<Trial[]>(endpointTrial, { id });
        if (res.error) {
            handleApiError(res.error);
            return undefined;
        }
        return res.data.length === 1 ? res.data[0] : undefined;
    },
    async postAnswer(answerText: string, trialId: string, questionId: string): Promise<boolean> {
        const answerData = {
            trialId,
            questionId,
            answer: answerText,
            score: 0,
            scoringStatus: undefined,
            memo: '',
        };
        const res = await apiClient.post<Answer>(endpointAnswer, answerData);
        if (res.error) {
            handleApiError(res.error);
            return false;
        }
        return !!res.data?.id;
    },
    async fetchPlayerAnswers(qgroupId: string, userId: string): Promise<Answer[]> {
        if (!qgroupId || !userId) return [];
        const trialsRes = await apiClient.get<Trial[]>(endpointTrial, { qgroupId, userId });
        if (trialsRes.error || !trialsRes.data.length) {
            if (trialsRes.error) handleApiError(trialsRes.error);
            return [];
        }
        const trialId = trialsRes.data[0].id;
        const answersRes = await apiClient.get<Answer[]>(endpointAnswer, { trialId });
        if (answersRes.error) {
            handleApiError(answersRes.error);
            return [];
        }
        return answersRes.data;
    },
    async fetchQuestionsOfQGroup(qgroupId: string): Promise<Question[]> {
        const res = await apiClient.get<Question[]>(endpointQuestion, { qgroupId });
        if (res.error) {
            handleApiError(res.error);
            return [];
        }
        return res.data;
    },
    async filterAnswers(unit: UnitString, keyword: string, qgroupId: string): Promise<Answer[]> {
        let id = '';
        if (unit === 'user') {
            const usersRes = await apiClient.get<User[]>(endpointUser, { username: keyword });
            if (usersRes.error || !usersRes.data.length) {
                if (usersRes.error) handleApiError(usersRes.error);
                return [];
            }
            const userId = usersRes.data[0].id;
            const trialsRes = await apiClient.get<Trial[]>(endpointTrial, { qgroupId, userId });
            if (trialsRes.error || !trialsRes.data.length) return [];
            id = trialsRes.data[0].id;
        } else {
            const qRes = await apiClient.get<Question[]>(endpointQuestion, { qgroupId, index: Number(keyword) });
            if (qRes.error || !qRes.data.length) return [];
            id = qRes.data[0].id;
        }
        const propertyName = unit === 'user' ? 'trialId' : 'questionId';
        const answersRes = await apiClient.get<Answer[]>(endpointAnswer, { qgroupId, [propertyName]: id });
        if (answersRes.error) {
            handleApiError(answersRes.error);
            return [];
        }
        return answersRes.data;
    },
    async fetchUserByAnswer(answer: Answer): Promise<User> {
        const trialsRes = await apiClient.get<Trial[]>(endpointTrial, { id: answer.trialId });
        if (trialsRes.error || !trialsRes.data.length) throw new Error('trial not found');
        const trial = trialsRes.data[0];
        const userRes = await apiClient.get<User[]>(endpointUser, { id: trial.userId });
        if (userRes.error || !userRes.data.length) throw new Error('user not found');
        return userRes.data[0];
    },
    async updateAnswerScored(answer: Answer): Promise<boolean> {
        const res = await apiClient.put<Answer>(`${endpointAnswer}/${answer.id}`, answer);
        if (res.error) {
            handleApiError(res.error);
            return false;
        }
        return true;
    },
    async fetchQuestionGroupId(keyword: string): Promise<string> {
        const res = await apiClient.get<QGroup[]>(endpointQgroup, { title: keyword });
        if (res.error || !res.data.length) return '';
        return res.data[0].id;
    }
};

const dateToISOStringSeconds = (date: Date): string => {
    const _ = new Date(date);
    return _.toISOString().replace(/\.\d{3}Z$/, 'Z');
};
