import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ENDPOINT_URL } from "../../../references/util";
import axios from "axios";
import type { Answer, Question, Trial, UnitString } from "../type";
import stepqApi from "../api/stepqApi";
import SelectHeader from "./SelectHeader";

type ScoringFormattedAnswer = {
    index: number;
    correctAnswer: string;
    answer: Answer;
};

const ScoringPage = () => {
    const urlParam = useParams<{ qgroupId: string }>();
    const [unit, setUnit] = useState<UnitString>('user');
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [formattedAnswers, setFormattedAnswers] = useState<ScoringFormattedAnswer[]>([]);

    // 解答データに問題番号・正解を付与して配列として返す関数
    const formatAnswerForScoring = async (answers: Answer[]): Promise<ScoringFormattedAnswer[]> => {
        // 解答データに問題番号・正解を付与する内部関数
        const addInfo = (ans: Answer, questions: Question[]): ScoringFormattedAnswer => {
            const question: Question | undefined = questions.find(_q => _q.id == ans.questionId);
            if (!question) { return { index: -1, correctAnswer: '', answer: ans }; }  // エラー回避用ダミー
            const formattedData: ScoringFormattedAnswer = {
                index: question.index,
                correctAnswer: question.correctAnswer,
                answer: ans
            };
            return formattedData;
        }

        if (!urlParam.qgroupId) { return []; }
        const allQuestions = await stepqApi.fetchQuestionsOfQGroup(urlParam.qgroupId);
        if (!allQuestions) { return []; }
        const formattedAnswers = answers.map(ans => addInfo(ans, allQuestions));
        return formattedAnswers;
    };

    useEffect(() => {
        const f = async () => {
            const formatted = await formatAnswerForScoring(answers);
            setFormattedAnswers(formatted);
            console.log("formatted answers:");
            console.log(formatted);
        };
        f();
    }, [answers]);


    return (<SelectHeader
        qgroupId={urlParam.qgroupId}
        setAnswers={setAnswers}
    />);
};

export default ScoringPage;