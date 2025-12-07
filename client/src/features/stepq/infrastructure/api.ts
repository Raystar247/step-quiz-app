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
const QUESTION_ENDPOINT = '/api/question';
const ANSWER_ENDPOINT = '/answer';
const USER_ENDPOINT = '/user';

export const stepqApiService = {
    async generateTrial(qgroupKeyword: string, passphrase: string, userId: string): Promise<string> {
        // TODO: get<QGroup[]>の型エラーになっているので、将来的に解消すべき
        const qgroups = (await axiosClient.get<QGroup[]>(`${QGROUP_ENDPOINT}`)).data.data;
        const qgroup = qgroups.find((data: QGroup) => data.title === qgroupKeyword);
        if (qgroup === undefined || passphrase !== qgroup.passphrase) {
            return '';
        }
        // Unauthrizedエラーの解消
        const dto = {
            title: qgroupKeyword,
            passphrase: passphrase,
            userId: userId
        }
        const res = await axiosClient.post(`${TRIAL_ENDPOINT}`, dto);
        return res.data.data.id;
    },

    async fetchTrial(trialId: string): Promise<Trial | undefined> {
        const trial = (await axiosClient.get<Trial>(`${TRIAL_ENDPOINT}/${trialId}`)).data;

        return trial;
    },

    async fetchQuestionByIndex(trialId: string, index: number): Promise<Question | undefined> {
        const trial = await this.fetchTrial(trialId);
        if (!trial) return undefined;
        //console.log(`questionId: ${trial.data.qgroupId}`) // trialのデータ型は再検討して明示するべき（波線になるから）
        const questions = (await axiosClient.get<Question[]>(`${QUESTION_ENDPOINT}?qgroupId=${trial.data.qgroupId}`)).data;
        console.log(index); // trialIndexは0だが-1が入っている（trial?.index=undefined）
        console.log(questions);
        return questions.data.find((q: Question) => q.index === index);
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
