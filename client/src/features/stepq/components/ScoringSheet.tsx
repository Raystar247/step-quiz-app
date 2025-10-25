import { useEffect, useState } from "react";
import type { ScoringFormattedAnswer } from "../type";

type Props = {
	formattedAnswers: ScoringFormattedAnswer[];
	setFormattedAnswers: React.Dispatch<React.SetStateAction<ScoringFormattedAnswer[]>>;
};
const ScoringSheet: React.FC<Props> = ({formattedAnswers, setFormattedAnswers}) => {
	// 選択状態: indexごとに 'correct' | 'incorrect' | undefined
	const [selected, setSelected] = useState<{ [key: number]: 'correct' | 'incorrect' | undefined }>({});

	useEffect(() => {
        setFormattedAnswers(formattedAnswers);
        setSelected({}); // ←これもリセットしたい場合は追加
    }, [formattedAnswers]);
	
		const handleSelect = (rowIndex: number, type: 'correct' | 'incorrect') => {
			setSelected((prev) => ({
				...prev,
				[rowIndex]: prev[rowIndex] === type ? undefined : type,
			}));
			setFormattedAnswers((prevRows) => {
				const newRows = prevRows.map((row) =>
					row.index === rowIndex
						? {
								...row,
								answer: {
									...row.answer,
									score: type === 'correct' && selected[rowIndex] !== 'correct' ? 1 : 0
								},
							}
						: row
				);
				return newRows;
			});
		};

		return (
			<div className="flex flex-col">
				<div className="-m-1.5 overflow-x-auto">
					<div className="p-1.5 min-w-full inline-block align-middle">
						<div className="overflow-hidden">
							<table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
								<thead>
									<tr>
										<th scope="col" className="px-4 py-2 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Index</th>
										<th scope="col" className="px-4 py-2 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Answer</th>
										<th scope="col" className="px-4 py-2 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Correct Answer</th>
										<th scope="col" className="px-4 py-2 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
									{formattedAnswers.map((row) => (
										<tr key={row.index} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
											<td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{row.index}</td>
											<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{row.answer.answer}</td>
											<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{row.correctAnswer}</td>
											<td className="px-4 py-2 whitespace-nowrap text-end text-sm font-medium flex gap-2 justify-end">
												<button
													type="button"
													className={`h-10 w-10 rounded-full flex items-center justify-center border-t border-b border-l border-r border-green-100 border-b-green-200 border-t-green-50 border-l-green-100 border-r-green-200 font-bold shadow-sm transition-colors duration-150
														${selected[row.index] === 'correct' ? 'bg-gradient-to-tl from-green-200 via-green-100 to-green-50 text-green-700' : 'bg-white text-green-600'}`}
													aria-label="Correct"
													onClick={() => handleSelect(row.index, 'correct')}
												>
													○
												</button>
												<button
													type="button"
													className={`h-10 w-10 rounded-full flex items-center justify-center border-t border-b border-l border-r border-red-100 border-b-red-200 border-t-red-50 border-l-red-100 border-r-red-200 font-bold shadow-sm transition-colors duration-150
														${selected[row.index] === 'incorrect' ? 'bg-gradient-to-tl from-red-200 via-red-100 to-red-50 text-red-700' : 'bg-white text-red-600'}`}
													aria-label="Incorrect"
													onClick={() => handleSelect(row.index, 'incorrect')}
												>
													×
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				{/* 合計スコア表示 */}
				<div className="mt-4 text-right text-base font-semibold text-gray-700 dark:text-neutral-200">
					合計スコア: {formattedAnswers.reduce((sum, row) => sum + row.answer.score, 0)}
				</div>
			</div>
		);
	};

	export default ScoringSheet;