import axios from 'axios';
import type { QGroup, Question, Trial, TrialPostData } from '../type';
import { ENDPOINT_URL } from '../../../references/util';

const endpointUser = `${ENDPOINT_URL}/user`;
const endpointTrial = `${ENDPOINT_URL}/trial`;
const endpointQgroup = `${ENDPOINT_URL}/qgroup`;
const endpointQuestion = `${ENDPOINT_URL}/question`;
const endpointAnswer = `${ENDPOINT_URL}/answer`;

const stepqApi = {
    async generateTrial(qgroupKeyword: string, passphrase: string, userId: string): Promise<string> {
        const qgroups = (await axios.get<QGroup[]>(`${endpointQgroup}`)).data;
        const qgroup = qgroups.find((data: QGroup) => data.title === qgroupKeyword );
        if (qgroup == undefined || passphrase != qgroup.passphrase) {
            return '';
        }

        const trials = (await axios.get<Trial[]>(`${endpointTrial}`)).data;
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
        const res = await axios.post(`${endpointTrial}`, trialData);
        console.log(res);
        return res.status == 201 ? res.data.id : '';
    },
    async fetchQuestion(qgroupId: string, index: number): Promise<Question | undefined> {
        const question = (await axios.get<Question[]>(endpointQuestion, {
            params: { qgroupId: qgroupId, index: index }
        })).data;
        if (question.length != 1) { return undefined; }
        return question[0];
    },
    async fetchQuestionGroup(qgroupId: string): Promise<QGroup | undefined> {
        const questionGroups = (await axios.get<QGroup[]>(endpointQgroup, {
            params: { qgroupId: qgroupId }
        })).data;
        if (questionGroups.length != 1) { return undefined; }
        return questionGroups[0];
    },
    async fetchTrial(id: string): Promise<Trial | undefined> {
        const trial = (await axios.get<Trial[]>(endpointTrial, {
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
            memo: ""
        };
        const res = await axios.post(endpointAnswer, answerData);
        return res.status == 201;
    }
};

const dateToISOStringSeconds = (date: Date): string => {
    const _ = new Date(date);
    return _.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

export default stepqApi;