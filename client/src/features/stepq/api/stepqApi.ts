import { axiosClient } from '../../../infrastructure/api/client/axiosClient';
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
        const qgroups = (await axiosClient.get<QGroup[]>(`${endpointQgroup}`)).data;
        const qgroup = qgroups.find((data: QGroup) => data.title === qgroupKeyword );
        if (qgroup == undefined || passphrase != qgroup.passphrase) {
            return '';
        }

        const trials = (await axiosClient.get<Trial[]>(`${endpointTrial}`)).data;
        const trial = trials.find((data: Trial) => (data.userId === userId && data.qgroupId === qgroup.id));
        if (trial != undefined) {
            return trial.id;
        }
        const trialData: TrialPostData = {
            qgroupId: qgroup.id,
            userId: userId,
            index: 1,
            startTime: dateToISOStringSeconds(new Date())
        };
        const res = await axiosClient.post(`${endpointTrial}`, trialData);
        return res.status == 201 ? res.data.id : '';
    },
    async fetchQuestionByIndex(qgroupId: string, index: number): Promise<Question | undefined> {
        const question = (await axiosClient.get<Question[]>(endpointQuestion, {
            params: { qgroupId: qgroupId, index: index }
        })).data;
        if (question.length != 1) { return undefined; }
        return question[0];
    },
    async fetchQuestionGroup(qgroupId: string): Promise<QGroup | undefined> {
        const questionGroups = (await axiosClient.get<QGroup[]>(endpointQgroup, {
            params: { qgroupId: qgroupId }
        })).data;
        if (questionGroups.length != 1) { return undefined; }
        return questionGroups[0];
    },
    async fetchTrial(id: string): Promise<Trial | undefined> {
        const trial = (await axiosClient.get<Trial[]>(endpointTrial, {
            params: { id: id }
        })).data;
        if (trial.length != 1) { return undefined; }
        return trial[0];
    },
    async postAnswer(answerText: string, trialId: string, questionId: string): Promise<boolean> {
        const answerData = {
            trialId: trialId,
            questionId: questionId,
            answer: answerText,
            score: 0,
            scoringStatus: undefined,
            memo: ""
        };
        const res = await axiosClient.post(endpointAnswer, answerData);
        return res.status == 201;
    },
    async fetchPlayerAnswers(qgroupId: string, userId: string): Promise<Answer[]> {
        if (qgroupId == '' || userId == '') { return []; }
        const trialId: string = (await axiosClient.get<Trial[]>(endpointTrial, {
            params: { qgroupId: qgroupId, userId: userId }
        })).data[0].id;
        const answers = (await axiosClient.get<Answer[]>(endpointAnswer, {
            params: { trialId: trialId }
        })).data;
        return answers;
    },
    async fetchQuestionsOfQGroup(qgroupId: string): Promise<Question[]> {
        const questions = (await axiosClient.get<Question[]>(endpointQuestion, {
            params: { qgroupId: qgroupId }
        })).data;
        return questions;
    },
    async filterAnswers(unit: UnitString, keyword: string, qgroupId: string): Promise<Answer[]> {
        let id: string = '';
        if (unit == 'user') {
            const userId = (await axiosClient.get<User[]>(endpointUser, {
                params: { username: keyword }
            })).data[0].id;
            id = (await axiosClient.get<Trial[]>(endpointTrial, {
                params: {
                    qgroupId: qgroupId,
                    userId: userId
                }
            })).data[0].id;
        } else {
            id = (await axiosClient.get<Question[]>(endpointQuestion, {
                params: {
                    qgroupId: qgroupId,
                    index: Number(keyword)
                }
            })).data[0].id;
        }
        const propertyName = unit == 'user' ? 'trialId' : 'questionId';
        const answers = (await axiosClient.get<Answer[]>(endpointAnswer, {
            params: {
                qgroupId: qgroupId,
                [propertyName]: id
            }
        })).data;
        return answers;
    },
    async fetchUserByAnswer(answer: Answer): Promise<User> {
        const trial = (await axiosClient.get<Trial[]>(endpointTrial, {
            params: { id: answer.trialId }
        })).data[0];
        const user = (await axiosClient.get<User[]>(endpointUser, {
            params: { id: trial.userId }
        })).data[0];
        return user;
    },
    async updateAnswerScored(answer: Answer): Promise<boolean> {
        const res = await axiosClient.put(`${endpointAnswer}/${answer.id}`, answer);
        return res.status == 200;
    },
    async fetchQuestionGroupId(keyword: string): Promise<string> {
        const res = (await axiosClient.get<QGroup[]>(endpointQgroup, {
            params: { title: keyword }
        })).data;
        if (res.length == 0) { return ''; }
        return res[0].id;
    }
};

const dateToISOStringSeconds = (date: Date): string => {
    const _ = new Date(date);
    return _.toISOString().replace(/\.\d{3}Z$/, 'Z');
};
