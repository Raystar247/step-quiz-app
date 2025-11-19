/**
 * Stepq Main Component
 * Purpose: 試験問題のレイアウトとタイマー、問題表示の統合
 *
 * 内部構成
 * - domain: Trial 型
 * - usecase: Trial データの取得と状態管理
 * - infra: useSelector, useParams
 * - ui: Timer, QuestionComponent の統合
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { stepqApi } from "../api/stepqApi";
import type { Trial } from "../type";
import { Timer } from "./Timer";
import { QuestionComponent } from "./Question";

export const Main: React.FC = () => {
    const urlParam = useParams<{ id: string }>();
    const [trial, setTrial] = useState<Trial>();
    const [index, setIndex] = useState(0);

    useEffect(() => {
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
            <QuestionComponent trial={trial} index={index} setIndex={setIndex} />
        </div>
    );
};