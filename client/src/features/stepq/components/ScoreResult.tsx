import React, { useState, useMemo, useCallback } from "react";
import type { ScoringFormattedAnswer } from "../../../models";
import { LiquidGlass } from "../../../fundamentalComponents/LiquidGlass";

type Props = {
  formattedAnswers: ScoringFormattedAnswer[];
};

export const ScoreResult: React.FC<Props> = ({ formattedAnswers }) => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const toggleExpand = useCallback((index: number) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }, []);

  // ✅ Compute total score and correct rate
  const { totalScore, correctRate, isQuestionMode } = useMemo(() => {
    const total = formattedAnswers.reduce((sum, row) => sum + (row.answer.score || 0), 0);
    const rate = formattedAnswers.length ? ((total / formattedAnswers.length) * 100).toFixed(1) : "0.0";
    const questionMode = formattedAnswers.length > 0 && typeof formattedAnswers[0].displayKey === "string";
    return { totalScore: total, correctRate: rate, isQuestionMode: questionMode };
  }, [formattedAnswers]);

  const renderStatusBadge = (status?: string) => {
    const colorMap: Record<string, string> = {
      correct: "green",
      incorrect: "red",
      undefined: "gray",
    };
    const symbolMap: Record<string, string> = {
      correct: "○",
      incorrect: "×",
      undefined: "-",
    };
    const color = colorMap[status ?? "undefined"];
    const symbol = symbolMap[status ?? "undefined"];
    return (
      <LiquidGlass
        as="div"
        shape="circle"
        colorScheme={color}
        centerContent
        noPadding
        width="32px"
        height="32px"
        className="flex items-center justify-center text-base leading-none"
      >
        {symbol}
      </LiquidGlass>
    );
  };

  return (
    <div className="w-full box-border overflow-x-hidden text-gray-800 dark:text-neutral-100">
      {/* Top Statistics */}
      <div className="flex justify-between items-center mb-4 p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm text-sm sm:text-base">
        <div className="font-semibold">
          {isQuestionMode ? "正解率" : "合計スコア"}：
          <span className="text-green-600 dark:text-green-400 ml-1">
            {isQuestionMode ? `${correctRate}%` : totalScore}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-neutral-400">{formattedAnswers.length} 問</div>
      </div>

      {/* PC Table */}
      <div className="hidden md:block">
        <table className="table-auto w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-neutral-300 bg-gray-50 dark:bg-neutral-800">
              <th className="px-4 py-2 text-left">Index</th>
              <th className="px-4 py-2 text-left">Answer</th>
              <th className="px-4 py-2 text-left">Correct Answer</th>
              <th className="px-4 py-2 text-right">Result</th>
            </tr>
          </thead>
          <tbody>
            {formattedAnswers.map((row) => (
              <tr key={row.index} className="hover:bg-gray-100 dark:hover:bg-neutral-700 border-b border-transparent">
                <td className="px-4 py-2">{row.displayKey}</td>
                <td className="px-4 py-2">{row.answer.answer}</td>
                <td className="px-4 py-2">{row.correctAnswer}</td>
                <td className="px-4 py-2 text-right">{renderStatusBadge(row.answer.scoringStatus)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden w-full box-border px-[1vw]">
        <div className="grid grid-cols-5 gap-[2vw]">
          {formattedAnswers.map((row) => (
            <div key={row.index} className="flex flex-col items-center">
              <LiquidGlass
                colorScheme="white"
                as="div"
                hoverEffect={false}
                className="flex flex-col items-center justify-center p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-neutral-700 w-full"
                onClick={() => toggleExpand(row.index)}
              >
                <div className="flex items-center justify-center w-full font-semibold text-gray-600 dark:text-neutral-300">
                  <span className="inline-block leading-none">Q.{row.displayKey}</span>
                </div>
                <div className="mt-2 flex items-center justify-center">{renderStatusBadge(row.answer.scoringStatus)}</div>
              </LiquidGlass>
            </div>
          ))}
        </div>

        {/* Expanded Details */}
        <div className="mt-1 flex flex-col gap-0.25">
          {formattedAnswers.map(
            (row) =>
              expandedIndexes.includes(row.index) && (
                <LiquidGlass
                  key={`detail-${row.index}`}
                  colorScheme="lightGray"
                  shape="square"
                  as="div"
                  hoverEffect={false}
                  className="w-full p-2 bg-gray-50 dark:bg-neutral-900 rounded-md shadow-inner text-xs sm:text-sm"
                >
                  <div className="flex flex-row w-full items-center">
                    <div className="w-[10%] flex items-center justify-center">
                      <span className="font-semibold text-gray-600 dark:text-neutral-300 text-center">Q.{row.displayKey}</span>
                    </div>
                    <div className="w-[90%] flex flex-col justify-center items-start gap-0.5">
                      <div>
                        <span className="font-medium text-gray-500 dark:text-neutral-400">回答：</span>
                        {row.answer.answer}
                      </div>
                      <div>
                        <span className="font-medium text-gray-500 dark:text-neutral-400">正解：</span>
                        {row.correctAnswer}
                      </div>
                    </div>
                  </div>
                </LiquidGlass>
              )
          )}
        </div>
      </div>
    </div>
  );
};
