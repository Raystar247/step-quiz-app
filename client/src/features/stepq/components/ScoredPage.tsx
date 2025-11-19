import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Answer, Question, ScoringFormattedAnswer } from "../../../models";
import { stepqApi } from "../api/stepqApi";
import type { User } from "../../../models";
import { ScoreResult } from "./ScoreResult";
import { useSelector, type RootState } from "../../../stores";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../stores';
import { fetchPlayerAnswers } from '../store/trial';

export const ScoredPage = () => {
  const urlParam = useParams<{ qgroupId: string }>();
  const [formattedAnswers, setFormattedAnswers] = useState<ScoringFormattedAnswer[]>([]);

  const userId = useSelector((state: RootState) => state.user.id);
  const dispatch = useDispatch<AppDispatch>();
  const playerAnswers = useSelector((state: RootState) => state.trial.playerAnswers);

  // 解答データ整形
  const formatAnswer = async (answers: Answer[]): Promise<ScoringFormattedAnswer[]> => {
    const addInfo = async (ans: Answer, questions: Question[]): Promise<ScoringFormattedAnswer> => {
      const question = questions.find((_q) => _q.id === ans.questionId);
      if (!question)
        return {
          index: -1,
          qindex: -1,
          displayKey: "",
          correctAnswer: "",
          username: "",
          answer: ans,
        };
      const user: User = await stepqApi.fetchUserByAnswer(ans);
      return {
        index: ans.id ? parseInt(ans.id.slice(-4), 16) : -1,
        qindex: question.index,
        displayKey: question.index,
        correctAnswer: question.correctAnswer,
        username: user.username,
        answer: ans,
      };
    };

    if (!urlParam.qgroupId) return [];
    const allQuestions = await stepqApi.fetchQuestionsOfQGroup(urlParam.qgroupId);
    if (!allQuestions) return [];

    return Promise.all(answers.map((ans) => addInfo(ans, allQuestions)));
  };

  useEffect(() => {
    const f = async () => {
      if (!urlParam.qgroupId) { return; }
      // fetch player answers through store thunk
      await dispatch(fetchPlayerAnswers({ qgroupId: urlParam.qgroupId, userId } as any)).unwrap().catch(() => []);
      const fmtAnswers = await formatAnswer(playerAnswers);
      setFormattedAnswers(fmtAnswers);
    };
    f();
  }, []);

  return (
    <div
      className="
        flex flex-col
        items-center
        w-full
        min-h-screen
        box-border
        overflow-x-hidden
        px-4
        py-6
        space-y-6
        dark:bg-neutral-900
      "
    >
      <div className="w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl">
        <ScoreResult formattedAnswers={formattedAnswers} />
      </div>
    </div>
  );
};