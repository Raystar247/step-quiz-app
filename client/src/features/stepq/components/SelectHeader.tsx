import React from 'react';
import { UserQuestionToggle } from './UserQuestionToggle';
import type { Answer, UnitString } from '../type';
import { useAnswerSearch } from '../hooks/useAnswerSearch';
import { LiquidGlass } from '../../../fundamentalComponents/LiquidGlass';

export const SelectHeader: React.FC<{
    qgroupId: string | undefined,
    setAnswers: (v: Answer[]) => void,
    unit: UnitString,
    setUnit: (v: UnitString) => void
}> = ({ qgroupId, setAnswers, unit, setUnit }) => {
    const { searchText, setSearchText, performSearch } = useAnswerSearch();

    const onSearch = async () => {
        if (!qgroupId) return;
        const results = await performSearch(unit, qgroupId);
        setAnswers(results);
    };

    return (
        <div className="flex items-center gap-4">
            <UserQuestionToggle unit={unit} onChange={setUnit} />
            {/* 検索入力 */}
            <input
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="検索..."
                className="px-3 rounded-md bg-white/40 text-gray-900 backdrop-blur-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ minWidth: 120, height: '40px' }}
            />
            {/* 検索ボタン */}
            <LiquidGlass
                className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition-colors flex items-center justify-center"
                onClick={onSearch}
                aria-label="検索"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            </LiquidGlass>
        </div>
    );
};