import { useEffect } from "react";
import type { ScoringFormattedAnswer } from "../type";
import LiquidGlass from "../../../fundamentalComponents/LiquidGlass";

type Props = {
    formattedAnswers: ScoringFormattedAnswer[];
    setFormattedAnswers: React.Dispatch<React.SetStateAction<ScoringFormattedAnswer[]>>;
};

const ScoringSheet: React.FC<Props> = ({ formattedAnswers, setFormattedAnswers }) => {
  
  // Ensure formattedAnswers state is always up-to-date
    useEffect(() => {
        setFormattedAnswers(formattedAnswers);
    }, [formattedAnswers, setFormattedAnswers]);

    // Toggle scoring status and score
    const handleScoreToggle = (rowIndex: number, type: "correct" | "incorrect") => {
        setFormattedAnswers((prevAnswers) =>
            prevAnswers.map((answerRow) => 
                answerRow.index === rowIndex
                    ? {
                            ...answerRow,
                            answer: {
                                ...answerRow.answer,
                                score:
                  type === "correct" && answerRow.answer.scoringStatus !== "correct" ? 1 : 0,
                                scoringStatus:
                  answerRow.answer.scoringStatus === type ? undefined : type,
                            },
                        }
                    : answerRow
            )
        );
    };

  // Calculate total score and correct rate
    const totalScore = formattedAnswers.reduce((sum, row) => sum + (row.answer.score || 0), 0);
    const correctRate = formattedAnswers.length > 0
        ? (totalScore / formattedAnswers.length) * 100
        : 0;

  // Determine table footer label based on displayKey type
    const isQuestionType = formattedAnswers.length > 0 && typeof formattedAnswers[0].displayKey === "string";

    return (
        <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 inline-block align-middle">
                    <div className="overflow-hidden">
                        <table className="table-auto divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 w-auto">
                                        Index
                                    </th>
                                    <th className="px-4 py-2 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 w-[240px]">
                                        Answer
                                    </th>
                                    <th className="px-4 py-2 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 w-[240px]">
                                        Correct Answer
                                    </th>
                                    <th className="px-4 py-2 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 w-auto">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {formattedAnswers.map((row) => (
                                    <tr key={row.index} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                            {row.displayKey}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-neutral-200 w-[240px]">
                                            {row.answer.answer}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-neutral-200 w-[240px]">
                                            {row.correctAnswer}
                                        </td>
                                        <td className="px-4 py-2 text-end text-sm font-medium flex gap-2 justify-end">
                                            <LiquidGlass
                                                as="button"
                                                shape="circle"
                                                colorScheme={row.answer.scoringStatus === "correct" ? "green" : "lightGray"}
                                                onClick={() => handleScoreToggle(row.index, "correct")}
                                                style={{ boxSizing: "border-box", padding: 0 }}
                                                aria-label="Correct"
                                            >
                                                ○
                                            </LiquidGlass>
                                            <LiquidGlass
                                                as="button"
                                                shape="circle"
                                                colorScheme={row.answer.scoringStatus === "incorrect" ? "red" : "lightGray"}
                                                onClick={() => handleScoreToggle(row.index, "incorrect")}
                                                style={{ boxSizing: "border-box", padding: 0 }}
                                                aria-label="Incorrect"
                                            >
                                                ×
                                            </LiquidGlass>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-100 dark:bg-neutral-700 font-semibold text-gray-800 dark:text-neutral-200">
                                    <td colSpan={3} className="px-4 py-2 text-end">
                                        {isQuestionType ? "正解率" : "合計スコア"}
                                    </td>
                                    <td className="px-4 py-2 text-end">
                                        {formattedAnswers.length === 0
                                            ? "-"
                                            : isQuestionType
                                                ? `${correctRate.toFixed(1)}%`
                                                : totalScore}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoringSheet;
