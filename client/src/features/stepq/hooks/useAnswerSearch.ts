/**
 * Hook: useAnswerSearch
 * Purpose: 解答データの検索フィルタリング
 *
 * 内部構成
 * - domain: 検索入力値の管理
 * - usecase: 検索実行、フィルタリング
 * - infra: stepqApi を利用
 */

import { useCallback, useState } from 'react';
import type { Answer, UnitString } from '../type';
import { stepqApi } from '../api/stepqApi';

/**
 * 検索テキストと単位（user/question）を管理し、フィルタリング結果を返す
 * - 副作用: API 呼び出し
 */
export const useAnswerSearch = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  /**
   * 検索を実行し、フィルタ結果を返す
   * @param unit 検索単位 ('user' or 'question')
   * @param qgroupId 問題グループID
   */
  const performSearch = useCallback(
    async (unit: UnitString, qgroupId: string | undefined): Promise<Answer[]> => {
      if (!qgroupId || !searchText.trim()) return [];

      setIsSearching(true);
      try {
        const results = await stepqApi.filterAnswers(unit, searchText, qgroupId);
        return results;
      } finally {
        setIsSearching(false);
      }
    },
    [searchText]
  );

  return {
    searchText,
    setSearchText,
    performSearch,
    isSearching,
  };
};
