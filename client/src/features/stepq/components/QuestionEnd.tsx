import { useLocation } from "react-router-dom";
import { finishMessages } from "../static/messages";

const QuestionEnd: React.FC = () => {
    const location = useLocation();
    const state = location.state as { key?: keyof typeof finishMessages };

    const message = state.key == undefined ? finishMessages["unknown"] : finishMessages[state.key];

    return (
        <div className="w-full max-w-md bg-white shadow-md p-4 space-y-6">
            <div className="whitespace-pre-line">
                {message}
            </div>
        </div>
    );
};

export default QuestionEnd;