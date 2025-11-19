/**
 * Hook: useScoringFormatter
 * Purpose: 解答データを採点シートフォーマットに整形
 *
 * 内部構成
 * - domain: データの正規化、キー生成
 * - usecase: API で追加情報を取得して統合
 * - infra: stepqApi を利用
 */

import { useCallback, useState } from 'react';
import type { Answer, Question, ScoringFormattedAnswer, UnitString } from '../type';
import type { User } from '../../users/type';
import { stepqApi } from '../api/stepqApi';

/**
 * 解答に問題情報とユーザー情報を付与してフォーマット
 * - 副作用: 複数の API 呼び出し
 */
export const useScoringFormatter = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 解答配列をフォーマット済み配列に変換
   * @param answers 生の解答配列
   * @param questions 問題配列
   * @param unit 表示単位 ('user' or 'question')
   */
  const formatAnswers = useCallback(
    async (
      answers: Answer[],
      questions: Question[],
      unit: UnitString
    ): Promise<ScoringFormattedAnswer[]> => {
      setIsLoading(true);
      try {
        const formatted = await Promise.all(
          answers.map(async (ans) => {
            const question = questions.find((q) => q.id === ans.questionId);
            if (!question) {
              return {
                index: -1,
                qindex: -1,
                displayKey: '',
                correctAnswer: '',
                username: '',
                answer: ans,
              } as ScoringFormattedAnswer;
            }

            const user: User = await stepqApi.fetchUserByAnswer(ans);
            return {
              index: ans.id ? parseInt(ans.id.slice(-4), 16) : -1,
              qindex: question.index,
              displayKey: unit === 'user' ? question.index : user.username,
              correctAnswer: question.correctAnswer,
              username: user.username,
              answer: ans,
            } as ScoringFormattedAnswer;
          })
        );
        return formatted;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { formatAnswers, isLoading };
};
