import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, type RootState } from "../../../stores";
import Timer from "./Timer";
import QuestionComponent from "./Question";
import axios from "axios";
import type { Trial } from "../type";

const Main: React.FC = () => {
    const urlParam = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.user.id);
    const [trial, setTrial] = useState<Trial>();
    const [index, setIndex] = useState(0);

    useEffect(() => {   
        console.log(`redux: ${userId}`);
        // reduxの管理が正しくできていない → sessionStorageなどで正しく永続化する必要あり
        // 正しく永続化できたら
        // if (trial.userId != userId) { navigate('/error'); } を追加する

        const getapi = async () => {
            const _trial = (await axios.get('http://localhost:3002/trial', {
                params: { id: urlParam.id }
            })).data[0];
            setTrial(_trial);
            console.log(_trial)
            setIndex(_trial.index);
        };
        getapi();
        console.log(`MainComponent: ${index}`);
    }, []);

    if (!trial) {
         return <p>エラー発生</p>
    }
    return (
        <div>
            <Timer />
            <QuestionComponent trial={trial} index={index} setIndex={setIndex} />
        </div>
    );
};

export default Main;