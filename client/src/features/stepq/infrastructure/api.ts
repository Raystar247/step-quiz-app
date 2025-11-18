import axiosInstance from '../../../infrastructure/api/client/axiosClient';
import type { Answer, QGroup, Question, Trial, TrialPostData } from '../domain/types';
import type { User } from '../../users/domain/types';

const TRIAL_ENDPOINT = '/trial';
const QGROUP_ENDPOINT = '/qgroup';
const QUESTION_ENDPOINT = '/question';
const ANSWER_ENDPOINT = '/answer';
const USER_ENDPOINT = '/user';

export const stepqApiService = {
    async generateTrial(qgroupKeyword: string, passphrase: string, userId: string): Promise<string> {
        const qgroups = (await axiosInstance.get<QGroup[]>(`${QGROUP_ENDPOINT}`)).data;
        const qgroup = qgroups.find((data: QGroup) => data.title === qgroupKeyword);
        if (qgroup === undefined || passphrase !== qgroup.passphrase) {
            return '';
        }

        const trials = (await axiosInstance.get<Trial[]>(`${TRIAL_ENDPOINT}`)).data;
        const trial = trials.find((data: Trial) => (data.userId === userId && data.qgroupId === qgroup.id));
        if (trial) {
            return trial.id;
        }

        const newTrial: TrialPostData = {
            userId,
            qgroupId: qgroup.id
        };
        const res = (await axiosInstance.post<Trial>(`${TRIAL_ENDPOINT}`, newTrial)).data;
        return res.id;
    },

    async fetchTrial(trialId: string): Promise<Trial | undefined> {
        const trials = (await axiosInstance.get<Trial[]>(`${TRIAL_ENDPOINT}`)).data;
        return trials.find((trial: Trial) => trial.id === trialId);
    },

    async fetchQuestionByIndex(trialId: string, index: number): Promise<Question | undefined> {
        const trial = await this.fetchTrial(trialId);
        if (!trial) return undefined;

        const questions = (await axiosInstance.get<Question[]>(`${QUESTION_ENDPOINT}?qgroupId=${trial.qgroupId}`)).data;
        return questions.find((q: Question) => q.index === index);
    },

    async postAnswer(answer: Answer): Promise<Answer> {
        const res = (await axiosInstance.post<Answer>(`${ANSWER_ENDPOINT}`, answer)).data;
        return res;
    },

    async fetchPlayerAnswers(qgroupId: string, userId: string): Promise<Answer[]> {
        const answers = (await axiosInstance.get<Answer[]>(`${ANSWER_ENDPOINT}`)).data;
        const trials = (await axiosInstance.get<Trial[]>(`${TRIAL_ENDPOINT}?qgroupId=${qgroupId}`)).data;
        const userTrialIds = trials.filter((t: Trial) => t.userId === userId).map((t: Trial) => t.id);
        return answers.filter((a: Answer) => userTrialIds.includes(a.trialId));
    },

    async fetchQuestionsOfQGroup(qgroupId: string): Promise<Question[]> {
        const questions = (await axiosInstance.get<Question[]>(`${QUESTION_ENDPOINT}?qgroupId=${qgroupId}`)).data;
        return questions;
    },

    async fetchUserByAnswer(answer: Answer): Promise<User> {
        const trial = (await axiosInstance.get<Trial>(`${TRIAL_ENDPOINT}/${answer.trialId}`)).data;
        const user = (await axiosInstance.get<User>(`${USER_ENDPOINT}/${trial.userId}`)).data;
        return user;
    },

    async fetchQuestionGroupId(qgroupKeyword: string): Promise<string | undefined> {
        const qgroups = (await axiosInstance.get<QGroup[]>(`${QGROUP_ENDPOINT}`)).data;
        const qgroup = qgroups.find((data: QGroup) => data.title === qgroupKeyword);
        return qgroup?.id;
    }
};
