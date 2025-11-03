import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Answer, Question, ScoringFormattedAnswer, Trial, UnitString } from "../type";
import stepqApi from "../api/stepqApi";
import SelectHeader from "./SelectHeader";
import type { User } from "../../users/type";
import ScoreResult from "./ScoreResult";

const ScoredPage = () => {
  const urlParam = useParams<{ qgroupId: string }>();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [formattedAnswers, setFormattedAnswers] = useState<ScoringFormattedAnswer[]>([]);
  const [unit, setUnit] = useState<UnitString>("user");

  // 解答データ整形
  const formatAnswerForScoring = async (answers: Answer[]): Promise<ScoringFormattedAnswer[]> => {
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
        displayKey: unit === "user" ? question.index : user.username,
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
      const formatted = await formatAnswerForScoring(answers);
      setFormattedAnswers(formatted);
    };
    f();
  }, [answers]);

  return (
    <div
      className="
        flex flex-col
        items-center
        w-full
        min-h-screen
        box-border
        overflow-x-hidden
        px-[2vw]
        py-6
        space-y-6
        bg-gray-50
        dark:bg-neutral-900
      "
    >
      <SelectHeader
        qgroupId={urlParam.qgroupId}
        setAnswers={setAnswers}
        unit={unit}
        setUnit={setUnit}
      />

      <div className="w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl">
        <ScoreResult formattedAnswers={formattedAnswers} />
      </div>
    </div>
  );
};

export default ScoredPage;
