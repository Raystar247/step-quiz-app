import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, type RootState } from "../../../stores";
import Timer from "./Timer";
import Question from "./Question";
import type { Trial } from "../type";
import stepqApi from "../api/stepqApi";

const Main: React.FC = () => {
    const urlParam = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.user.id);

    const [trial, setTrial] = useState<Trial>();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // reduxの管理が正しくできていない → sessionStorageなどで正しく永続化する必要あり
        // 正しく永続化できたら
        // if (trial.userId != userId) { navigate('/error'); } を追加する
        const awake = async () => {
            if (!urlParam.id) {
                return;
            }
            const _t = await stepqApi.fetchTrial(urlParam.id);
            if (!_t) {
                return; 
            }
            setTrial(_t);
            setIndex(_t ? _t.index : 0 );
        };
        awake();
    }, []);

    if (!trial) {
        return <p>エラー発生！</p>
    }
    return (
        <div className="mt-10">
            <Timer />
            <Question trial={trial} index={index} setIndex={setIndex} />
        </div>
    );
};

export default Main;