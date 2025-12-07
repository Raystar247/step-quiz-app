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
import { Timer } from "./Timer";
import { QuestionComponent } from "./Question";
import { useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../../stores';
import { useSelector } from '../../../stores';
import { fetchTrial } from '../store/trial';

export const Main: React.FC = () => {
    const urlParam = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    // TOFIX: currentTrialには現状Response型が入っているのでdataを取得すべきだが、
    // currentTrialの定義はTrial|undefinedなので、dataを取れない
    // → currentTrialの定義を修正し、周辺箇所と
    const trial = useSelector((state: RootState) => state.trial.currentTrial?.data);
    // trialIndexの初期化ができていない（trial?.index=1を代入しているはずだが、なぜが0が入っている）
    const [trialIndex, setTrialIndex] = useState(-1);

    useEffect(() => {
    if (trial?.index !== undefined) {
        setTrialIndex(trial.index);
    }
}, [trial?.index]);

    useEffect(() => {
        const awake = async () => {
            if (!urlParam.id) return;
            const res = await dispatch(fetchTrial(urlParam.id as string)).unwrap().catch(() => undefined);
            // if the store has the trial, set local index from it
            if (res) setTrialIndex(res.data.index ?? 0);
        };
        awake();
    }, []);

    if (!trial) return <p>エラー発生！</p>;
    return (
        <div className="mt-10">
            <Timer />
            <QuestionComponent trial={trial} index={trialIndex} setIndex={setTrialIndex} />
        </div>
    );
};