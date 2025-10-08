import { useEffect, useState } from "react";
import type { QGroup, Question, Trial } from "../type";
import stepqApi from "../api/stepqApi";
import { useNavigate } from "react-router-dom";

type Props = {
    trial: Trial;
    index: number;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
};

const QuestionComponent: React.FC<Props> = ({ trial, index, setIndex }) => {
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState<Question>();
    const navigate = useNavigate();

    useEffect(() => {
        const awake = async () => {
            const q = await stepqApi.fetchQuestion(trial.qgroupId, index);
            setQuestion(q);
        };
        awake();
    }, [index]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        const compareToLastQuestion = async (): Promise<number> => {
            const qgroup = await stepqApi.fetchQuestionGroup(trial.qgroupId);
            if (qgroup == undefined) { return 2; }  // エラー値2を返す
            return Math.sign(index - qgroup.nQuestions);
        }; 

        e.preventDefault();
        setAnswer("");
        const relPos = await compareToLastQuestion();
        if (relPos > 0) {   // 通常あり得ないケース
            // TODO: エラー画面に遷移
        } else if (relPos == 0) {   // 最終問題の解答後(正常の遷移)
            navigate("/stepq/end");
        } else {    // まだ未解答の問題があるケース
            setIndex(prev => prev + 1);
        }
    };

    if (!question) {
        return <p>エラー発生</p>;
    }
    return (
        <div className="w-full max-w-md bg-white shadow-md p-4 space-y-6">
            <div>
                第 <span className="font-semibold text-lg">{index}</span> 問
            </div>
            <div className="shadow-sm rounded-sm p-2 text-left border-l-2 border-cyan-300">
                {question.questionText}
            </div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    id="answer" name="answer"
                    placeholder="answer"
                    value={answer}
                    onChange={handleChange}
                    className="w-full py-2 border-b focus:outline-none focus:border-b-2 focus:border-indigo-500 placeholder-gray-500 placeholder-opacity-50"
                />
            </form>
        </div>
    );
};

export default QuestionComponent;