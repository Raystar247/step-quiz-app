/**
 * Hook: useQuestion
 * Purpose: 問題データ取得と解答送信のビジネスロジック
 *
 * 内部構成
 * - domain: 問題の検証、最後の問題判定ロジック
 * - usecase: 解答データ送信、ナビゲーション制御
 * - infra: stepqApi を利用
 */

import { useCallback, useEffect, useState } from 'react';
import type { Question, Trial } from '../type';
import { useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../../stores';
import { useSelector } from '../../../stores';
import { fetchQuestionByIndex, fetchQuestionsOfQGroup, postAnswer } from '../store/trial';
import { useNavigate } from 'react-router-dom';

/**
 * 問題を index でフェッチし、解答後の遷移をハンドルする
 * - 副作用: API 呼び出し、ナビゲーション
 */
export const useQuestion = (trial: Trial, index: number, onIndexChange: (idx: number) => void) => {
  const [question, setQuestion] = useState<Question>();
  const [answer, setAnswer] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // 問題データをフェッチ
  useEffect(() => {
    const fetchQuestion = async () => {
      console.log(`AAA index: ${index}`);
      const res = await dispatch(fetchQuestionByIndex({ trialId: trial.id, index } as any)).unwrap().catch(() => undefined);
      console.log(res);
      setQuestion(res);
    };
    fetchQuestion();
  }, [trial.qgroupId, index]);

  // 最後の問題判定
  const isLastQuestion = useCallback(async (currentIdx: number): Promise<boolean> => {
    const res = await dispatch(fetchQuestionsOfQGroup(trial.qgroupId)).unwrap().catch(() => []);
    const questions = res ?? [];
    if (!questions || questions.length === 0) return false;
    // toBetter: 問題更新時に毎回フェッチしている（本来は1回取得できれば十分のはず）
    const maxIndex = Math.max(...questions.data.map(q => q.index));
    console.log(`maxIndex: ${maxIndex}`);
    return currentIdx >= maxIndex;
  }, [trial.qgroupId, dispatch]);

  // 解答送信とナビゲーション制御
  const handleSubmitAnswer = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log(`submit: ${question}`);
      if (!question) return;

      await dispatch(postAnswer({ answerText: answer, trialId: trial.id, questionId: question.id } as any)).unwrap().catch(() => false);
      setAnswer('');

      const lastQuestion = await isLastQuestion(index);
      console.log(`isLastQuestion ${lastQuestion}`);
      if (lastQuestion) {
        navigate('/stepq/end', { state: { key: 'answerall' } });
      } else {
        onIndexChange(index + 1);
      }
    },
    [question, trial.id, answer, index, navigate, isLastQuestion, onIndexChange]
  );

  return {
    question,
    answer,
    setAnswer,
    handleSubmitAnswer,
  };
};
