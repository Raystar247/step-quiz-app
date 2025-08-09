import { useEffect, useState } from "react";
import type { Question, Trial } from "../type";
import axios from "axios";

type Props = {
    trial: Trial;
    index: number;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
};

const QuestionComponent: React.FC<Props> = ({ trial, index, setIndex }) => {
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState<Question>();

    useEffect(() => {
        console.log(`index:${index}`)
        const getQuestion = async () => {
            const q = (await axios.get('http://localhost:3002/question', {
                params: { qgroupId: trial.qgroupId, index: index }
            })).data[0];
            setQuestion(q);
        };
        getQuestion();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(e.target.value);
    };
    if (!question) {
        return (<><p>エラー発生</p></>);
    }
    return (
        <div className="w-full max-w-md bg-white shadow-md p-4 space-y-6">
            <div>
                第 <span className="font-semibold text-lg">{index}</span> 問
            </div>
            <div className="shadow-sm rounded-sm p-2 text-left border-l-2 border-cyan-300">
                {question.questionText}
            </div>
            <form>
                <input 
                    type="text" 
                    id="answer" name="answer"
                    placeholder="answer"
                    onChange={handleChange}
                    className="w-full py-2 border-b focus:outline-none focus:border-b-2 focus:border-indigo-500 placeholder-gray-500 placeholder-opacity-50"
                />
            </form>
        </div>
    );
};

export default QuestionComponent;