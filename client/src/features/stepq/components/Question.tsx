import { useEffect, useState } from "react";
import type { Question, Trial } from "../type";
import axios from "axios";
import stepqApi from "../api/stepqApi";

type Props = {
    trial: Trial;
    index: number;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
};

const QuestionComponent: React.FC<Props> = ({ trial, index, setIndex }) => {
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState<Question>();

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

    if (!question) {
        return <p>エラー発生</p>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        stepqApi.postAnswer(answer, trial.id, question.id);
        setAnswer("");
        setIndex(prev => prev + 1);
    };

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