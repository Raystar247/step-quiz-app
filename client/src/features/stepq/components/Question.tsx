/**
 * Question Component
 * Purpose: 問題表示と解答入力フォーム
 *
 * 内部構成
 * - domain: Trial 型
 * - usecase: useQuestion hook に委譲（ビジネスロジック）
 * - ui: LiquidGlass、form 要素
 */

import type { Trial } from "../type";
import { useQuestion } from "../hooks/useQuestion";
import { LiquidGlass } from "../../../fundamentalComponents/LiquidGlass";

type Props = {
    trial: Trial;
    index: number;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const QuestionComponent: React.FC<Props> = ({ trial, index, setIndex }) => {
    const { question, answer, setAnswer, handleSubmitAnswer } = useQuestion(trial, index, setIndex);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(e.target.value);
    };


    if (!question) {
        return <p>エラー発生</p>;
    }

    return (
        <LiquidGlass as="div" colorScheme="white" hoverEffect={false} className="w-full max-w-md bg-white shadow-md p-8 space-y-6">
            <div>
                第 <span className="font-semibold text-lg">{index}</span> 問
            </div>
            <div className="shadow-sm rounded-sm p-2 text-left border-l-3 border-cyan-300">
                {question.questionText}
            </div>
            <form onSubmit={handleSubmitAnswer}>
                <LiquidGlass as="input"
                    colorScheme="lightGray"
                    shape="square"
                    type="text"
                    autoComplete="off"
                    id="answer" name="answer"
                    placeholder="answer"
                    value={answer}
                    onChange={handleChange}
                    className="w-full py-2 border-b focus:outline-none focus:border-b-2 focus:border-indigo-500 placeholder-gray-500 placeholder-opacity-50 mb-3"
                />
            </form>
        </LiquidGlass>
    );
};