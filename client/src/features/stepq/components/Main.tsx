import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, type RootState } from "../../../stores";
import Timer from "./Timer";
import Question from "./Question";

const Main: React.FC = () => {
    const urlParam = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.user.id);

    // 仮データ
    const [index, setIndex] = useState(0);
    const _t = {
      id: "c4b7",
      qgroupId: "0001",
      userId: "0000",
      startTime: "2025-08-09T02:04:25Z",
      index: 1
    }

    useEffect(() => {
        // reduxの管理が正しくできていない → sessionStorageなどで正しく永続化する必要あり
        // 正しく永続化できたら
        // if (trial.userId != userId) { navigate('/error'); } を追加する
        
    }, []);

    return (
        <div>
            <Timer />
            <Question trial={_t} index={1} setIndex={setIndex} />
        </div>
    );
};

export default Main;