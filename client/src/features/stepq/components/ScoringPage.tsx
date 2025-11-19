
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Answer, ScoringFormattedAnswer, UnitString } from "../type";
import { stepqApi } from "../api/stepqApi";
import { SelectHeader } from "./SelectHeader";
import { ScoringSheet } from "./ScoringSheet";
import { LiquidGlass } from "../../../fundamentalComponents/LiquidGlass";
import { useScoringFormatter } from "../hooks/useScoringFormatter";

export const ScoringPage = () => {
    const urlParam = useParams<{ qgroupId: string }>();
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [formattedAnswers, setFormattedAnswers] = useState<ScoringFormattedAnswer[]>([]);
    const [unit, setUnit] = useState<UnitString>('user');
    const { formatAnswers } = useScoringFormatter();

    // 解答データを整形
    useEffect(() => {
        const formatData = async () => {
            if (!urlParam.qgroupId || answers.length === 0) {
                setFormattedAnswers([]);
                return;
            }
            const allQuestions = await stepqApi.fetchQuestionsOfQGroup(urlParam.qgroupId);
            if (!allQuestions || allQuestions.length === 0) {
                setFormattedAnswers([]);
                return;
            }
            const formatted = await formatAnswers(answers, allQuestions, unit);
            setFormattedAnswers(formatted);
        };
        formatData();
    }, [answers, unit, urlParam.qgroupId, formatAnswers]);

    const savedAnswersScored = async () => {
        for (const formattedAnswer of formattedAnswers) {
            await stepqApi.updateAnswerScored(formattedAnswer.answer);
        }
    };

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
            <LiquidGlass as="button" colorScheme="purple" onClick={async () => await savedAnswersScored()}>
                保存する
            </LiquidGlass>
                </div>
    );
};