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
  const currentQuestion = useSelector((state: RootState) => state.trial.currentQuestion);

  // 問題データをフェッチ
  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await dispatch(fetchQuestionByIndex({ qgroupId: trial.qgroupId, index } as any)).unwrap().catch(() => undefined);
      setQuestion(res ?? currentQuestion);
    };
    fetchQuestion();
  }, [trial.qgroupId, index, currentQuestion]);

  // 最後の問題判定
  const isLastQuestion = useCallback(async (currentIdx: number): Promise<boolean> => {
    const res = await dispatch(fetchQuestionsOfQGroup(trial.qgroupId)).unwrap().catch(() => []);
    const questions = res ?? [];
    if (!questions || questions.length === 0) return false;
    const maxIndex = Math.max(...questions.map(q => q.index));
    return currentIdx >= maxIndex;
  }, [trial.qgroupId, dispatch]);

  // 解答送信とナビゲーション制御
  const handleSubmitAnswer = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!question) return;

      await dispatch(postAnswer({ answerText: answer, trialId: trial.id, questionId: question.id } as any)).unwrap().catch(() => false);
      setAnswer('');

      const lastQuestion = await isLastQuestion(index);
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
