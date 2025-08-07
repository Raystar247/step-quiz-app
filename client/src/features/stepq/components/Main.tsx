import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, type RootState } from "../../../stores";
import Timer from "./Timer";
import Question from "./Question";

const Main: React.FC = () => {
    const urlParam = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.user.id);

    useEffect(() => {   
        console.log(`redux: ${userId}`);
        // reduxの管理が正しくできていない → sessionStorageなどで正しく永続化する必要あり
        // 正しく永続化できたら
        // if (trial.userId != userId) { navigate('/error'); } を追加する
    }, []);

    return (
        <div>
            <Timer />
            <Question />
        </div>
    );
};

export default Main;