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
import { stepqApi } from '../api/stepqApi';
import { useNavigate } from 'react-router-dom';

/**
 * 問題を index でフェッチし、解答後の遷移をハンドルする
 * - 副作用: API 呼び出し、ナビゲーション
 */
export const useQuestion = (trial: Trial, index: number, onIndexChange: (idx: number) => void) => {
  const [question, setQuestion] = useState<Question>();
  const [answer, setAnswer] = useState('');
  const navigate = useNavigate();

  // 問題データをフェッチ
  useEffect(() => {
    const fetchQuestion = async () => {
      const q = await stepqApi.fetchQuestionByIndex(trial.qgroupId, index);
      setQuestion(q);
    };
    fetchQuestion();
  }, [trial.qgroupId, index]);

  // 最後の問題判定
  const isLastQuestion = useCallback(async (currentIdx: number): Promise<boolean> => {
    const questions = await stepqApi.fetchQuestionsOfQGroup(trial.qgroupId);
    if (!questions || questions.length === 0) return false;
    const maxIndex = Math.max(...questions.map(q => q.index));
    return currentIdx >= maxIndex;
  }, [trial.qgroupId]);

  // 解答送信とナビゲーション制御
  const handleSubmitAnswer = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!question) return;

      await stepqApi.postAnswer(answer, trial.id, question.id);
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
