import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ENDPOINT_URL } from "../../../references/util";
import axios from "axios";
import type { Answer, Question, ScoringFormattedAnswer, Trial, UnitString } from "../type";
import stepqApi from "../api/stepqApi";
import SelectHeader from "./SelectHeader";
import ScoringSheet from "./ScoringSheet";
import type { User } from "../../users/type";
import LiquidGlassButton from "./exampleButton";


const ScoringPage = () => {
    const urlParam = useParams<{ qgroupId: string }>();
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [formattedAnswers, setFormattedAnswers] = useState<ScoringFormattedAnswer[]>([]);
    const [unit, setUnit] = useState<UnitString>('user');

    // 解答データに問題番号・正解を付与して配列として返す関数
    const formatAnswerForScoring = async (answers: Answer[]): Promise<ScoringFormattedAnswer[]> => {
        // 解答データに問題番号・正解を付与する内部関数
        const addInfo = async (ans: Answer, questions: Question[]): Promise<ScoringFormattedAnswer> => {
            const question: Question | undefined = questions.find(_q => _q.id == ans.questionId);
            if (!question) { return { index: -1, qindex: -1, displayKey: '', correctAnswer: '', username: '', answer: ans }; }  // エラー回避用ダミー
            const user: User = await stepqApi.fetchUserByAnswer(ans);
            const formattedData: ScoringFormattedAnswer = {
                index: ans.id ? parseInt(ans.id.slice(-4), 16) : -1,  // Sheetのkey用index
                qindex: question.index,
                displayKey: unit == 'user' ? question.index : user.username,
                correctAnswer: question.correctAnswer,
                username: user.username,
                answer: ans
            };  
            return formattedData;
        }

        if (!urlParam.qgroupId) { return []; }
        const allQuestions = await stepqApi.fetchQuestionsOfQGroup(urlParam.qgroupId);
        if (!allQuestions) { return []; }
        const formattedAnswers = await Promise.all(
            answers.map(async ans => await addInfo(ans, allQuestions))
        );
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


return (
    <div className="flex flex-col items-center px-4 py-6 space-y-6">
        {/* 横中央に配置 + 下にスペース */}
        <SelectHeader
            qgroupId={urlParam.qgroupId}
            setAnswers={setAnswers}
            unit={unit} setUnit={setUnit}
        />

        {/* 表は横幅を画面に合わせて中央配置 */}
        <div className="w-full max-w-5xl">
            <ScoringSheet formattedAnswers={formattedAnswers} setFormattedAnswers={setFormattedAnswers} />
        </div>

        {/* 保存ボタンも中央に */}
        <LiquidGlassButton colorScheme="purple">
            保存する
        </LiquidGlassButton>
    </div>
);
};

export default ScoringPage;