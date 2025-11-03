import { useLocation } from "react-router-dom";
import { finishMessages } from "../static/messages";
import LiquidGlass from "../../../fundamentalComponents/LiquidGlass";

const QuestionEnd: React.FC = () => {
    const location = useLocation();
    const state = location.state as { key?: keyof typeof finishMessages };

    const message = state.key == undefined ? finishMessages["unknown"] : finishMessages[state.key];

    return (
        <LiquidGlass as="div" colorScheme="orange" hoverEffect={false} className="w-full max-w-md p-6 mt-10">
            <div className="whitespace-pre-line">
                {message}
            </div>
        </LiquidGlass>
    );
};

export default QuestionEnd;