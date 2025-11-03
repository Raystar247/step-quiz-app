import React, { useState } from "react";
import type { ScoringFormattedAnswer } from "../type";
import LiquidGlass from "../../../fundamentalComponents/LiquidGlass";

type Props = {
  formattedAnswers: ScoringFormattedAnswer[];
};

const ScoreResult: React.FC<Props> = ({ formattedAnswers }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // ✅ スコアと正解率を算出
  const totalScore = formattedAnswers.reduce((sum, row) => sum + (row.answer.score || 0), 0);
  const correctRate =
    formattedAnswers.length > 0
      ? ((totalScore / formattedAnswers.length) * 100).toFixed(1)
      : "0.0";

  const isQuestionSearch =
    formattedAnswers.length > 0 && typeof formattedAnswers[0].displayKey === "string";

  return (
    <div
      className="
        w-full
        box-border
        overflow-x-hidden
        text-gray-800 dark:text-neutral-100
      "
    >
      {/* ✅ 上部統計情報 */}
      <div
        className="
          flex justify-between items-center
          mb-4 p-3
          bg-white dark:bg-neutral-800
          rounded-md shadow-sm
          text-sm sm:text-base
        "
      >
        <div className="font-semibold">
          {isQuestionSearch ? "正解率" : "合計スコア"}：
          <span className="text-green-600 dark:text-green-400 ml-1">
            {isQuestionSearch ? `${correctRate}%` : totalScore}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-neutral-400">
          {formattedAnswers.length} 問
        </div>
      </div>

      {/* ✅ PC版：表形式（ヘッダー下に罫線） */}
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
              <tr
                key={row.index}
                className="hover:bg-gray-100 dark:hover:bg-neutral-700 border-b border-transparent"
              >
                <td className="px-4 py-2">{row.displayKey}</td>
                <td className="px-4 py-2">{row.answer.answer}</td>
                <td className="px-4 py-2">{row.correctAnswer}</td>
                <td className="px-4 py-2 text-right">
                  {row.answer.scoringStatus === "correct" && (
                    <LiquidGlass
                      as="div"
                      shape="circle"
                      colorScheme="green"
                      centerContent
                      noPadding
                      className="inline-flex items-center justify-center"
                    >
                      ○
                    </LiquidGlass>
                  )}
                  {row.answer.scoringStatus === "incorrect" && (
                    <LiquidGlass
                      as="div"
                      shape="circle"
                      colorScheme="red"
                      centerContent
                      noPadding
                      className="inline-flex items-center justify-center"
                    >
                      ×
                    </LiquidGlass>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ スマホ版：5列グリッド＋折りたたみ */}
      <div className="md:hidden w-full box-border px-[1vw]">
        {/* カード5列グリッド */}
        <div
          className="
            grid
            grid-cols-5
            gap-[2vw]
          "
        >
          {formattedAnswers.map((row) => (
            <div key={row.index} className="flex flex-col items-center">
              {/* カードヘッダー */}
              <LiquidGlass
  colorScheme="white"
  as="div"
  hoverEffect={false}
  className="
    flex flex-col items-center justify-center
    p-3
    bg-white dark:bg-neutral-800
    rounded-md shadow-sm
    cursor-pointer
    transition-all duration-200
    hover:bg-gray-100 dark:hover:bg-neutral-700
    w-full
  "
  onClick={() => toggleOpen(row.index)}
>
  {/* 上段：Q.index */}
<div
  className="
    flex items-center justify-center
    w-full
    font-semibold
    text-gray-600 dark:text-neutral-300
  "
>
  <span className="inline-block leading-none">Q.{row.displayKey}</span>
</div>

  {/* 下段：○×−マーク */}
  <div className="mt-2 flex items-center justify-center">
    {row.answer.scoringStatus === "correct" && (
      <LiquidGlass
        as="div"
        shape="circle"
        colorScheme="green"
        centerContent
        noPadding
        width="32px"
        height="32px"
        className="flex items-center justify-center text-base leading-none"
      >
        ○
      </LiquidGlass>
    )}
    {row.answer.scoringStatus === "incorrect" && (
      <LiquidGlass
        as="div"
        shape="circle"
        colorScheme="red"
        centerContent
        noPadding
        width="32px"
        height="32px"
        className="flex items-center justify-center text-base leading-none"
      >
        ×
      </LiquidGlass>
    )}
    {row.answer.scoringStatus === undefined && (
      <LiquidGlass
        as="div"
        shape="circle"
        colorScheme="gray"
        centerContent
        noPadding
        width="32px"
        height="32px"
        className="flex items-center justify-center text-base leading-none"
      >
        -
      </LiquidGlass>
    )}
  </div>
</LiquidGlass>
            </div>
          ))}
        </div>

{/* 折りたたみ詳細（下段に展開） */}
<div className="mt-1 flex flex-col gap-0.25">
  {formattedAnswers.map(
    (row) =>
      openIndexes.includes(row.index) && (
<LiquidGlass
  colorScheme="lightGray"
  shape="square"
  as="div"
  hoverEffect={false}
  key={`detail-${row.index}`}
  className="
    w-full
    p-2
    bg-gray-50 dark:bg-neutral-900
    rounded-md shadow-inner
    text-xs sm:text-sm
  "
>
  {/* 横並びラッパー */}
  <div className="flex flex-row w-full items-center">
    {/* 左側：Q.index */}
    <div className="w-[10%] flex items-center justify-center">
      <span className="font-semibold text-gray-600 dark:text-neutral-300 text-center">
        Q.{row.displayKey}
      </span>
    </div>

    {/* 右側：回答・正解 */}
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

export default ScoreResult;