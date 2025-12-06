/**
 * Stepq API Service (alternative infrastructure layer)
 * Purpose: HTTP 経由の stepq 関連 CRUD（別実装版）
 * 
 * ⚠️ 注意: 現在 features/stepq/api/stepqApi.ts が使用されています。
 * このファイルは参考実装として保管されています。
 * 必要に応じて統合または削除してください。
 */

// import { axiosClient } from '../../../infrastructure/api/client/axiosClient';
import axiosClient from '../../../api/client';
import type { Answer, QGroup, Question, Trial, TrialPostData } from '../type';
import type { User } from '../../users/type';

const TRIAL_ENDPOINT = '/api/trial';
const QGROUP_ENDPOINT = '/api/qgroup';
const QUESTION_ENDPOINT = '/question';
const ANSWER_ENDPOINT = '/answer';
const USER_ENDPOINT = '/user';

export const stepqApiService = {
    async generateTrial(qgroupKeyword: string, passphrase: string, userId: string): Promise<string> {
        // TODO: get<QGroup[]>の型エラーになっているので、将来的に解消すべき
        const qgroups = (await axiosClient.get<QGroup[]>(`${QGROUP_ENDPOINT}`)).data.data;
        console.log(qgroups);
        const qgroup = qgroups.find((data: QGroup) => data.title === qgroupKeyword);
        console.log("checkpoint 0");
        if (qgroup === undefined || passphrase !== qgroup.passphrase) {
            return '';
        }
        // Unauthrizedエラーの解消
        const trials = (await axiosClient.get<Trial[]>(`${TRIAL_ENDPOINT}`)).data;
        const trial = trials.find((data: Trial) => (data.userId === userId && data.qgroupId === qgroup.id));
        if (trial) {
            console.log("checkpoint A");
            return trial.id;
        }
        console.log("checkpoint 1");
        const newTrial: TrialPostData = {
            userId,
            qgroupId: qgroup.id,
            index: 1,
            startTime: new Date().toISOString()
        };
        const res = (await axiosClient.post<Trial>(`${TRIAL_ENDPOINT}`, newTrial)).data;
        console.log("checkpoint B");
        return res.id;
    },

    async fetchTrial(trialId: string): Promise<Trial | undefined> {
        const trials = (await axiosClient.get<Trial[]>(`${TRIAL_ENDPOINT}`)).data;
        return trials.find((trial: Trial) => trial.id === trialId);
    },

    async fetchQuestionByIndex(trialId: string, index: number): Promise<Question | undefined> {
        const trial = await this.fetchTrial(trialId);
        if (!trial) return undefined;

        const questions = (await axiosClient.get<Question[]>(`${QUESTION_ENDPOINT}?qgroupId=${trial.qgroupId}`)).data;
        return questions.find((q: Question) => q.index === index);
    },

    async postAnswer(answer: Answer): Promise<Answer> {
        const res = (await axiosClient.post<Answer>(`${ANSWER_ENDPOINT}`, answer)).data;
        return res;
    },

    async fetchPlayerAnswers(qgroupId: string, userId: string): Promise<Answer[]> {
        const answers = (await axiosClient.get<Answer[]>(`${ANSWER_ENDPOINT}`)).data;
        const trials = (await axiosClient.get<Trial[]>(`${TRIAL_ENDPOINT}?qgroupId=${qgroupId}`)).data;
        const userTrialIds = trials.filter((t: Trial) => t.userId === userId).map((t: Trial) => t.id);
        return answers.filter((a: Answer) => userTrialIds.includes(a.trialId));
    },

    async fetchQuestionsOfQGroup(qgroupId: string): Promise<Question[]> {
        const questions = (await axiosClient.get<Question[]>(`${QUESTION_ENDPOINT}?qgroupId=${qgroupId}`)).data;
        return questions;
    },

    async fetchUserByAnswer(answer: Answer): Promise<User> {
        const trial = (await axiosClient.get<Trial>(`${TRIAL_ENDPOINT}/${answer.trialId}`)).data;
        const user = (await axiosClient.get<User>(`${USER_ENDPOINT}/${trial.userId}`)).data;
        return user;
    },

    async fetchQuestionGroupId(qgroupKeyword: string): Promise<string | undefined> {
        const qgroups = (await axiosClient.get<QGroup[]>(`${QGROUP_ENDPOINT}`)).data;
        const qgroup = qgroups.find((data: QGroup) => data.title === qgroupKeyword);
        return qgroup?.id;
    }
};
