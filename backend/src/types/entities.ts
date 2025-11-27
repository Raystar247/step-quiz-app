export interface UserEntity {
  id: string;
  email: string;
  name: string;
}

export interface QGroupEntity {
  id: string;
  title: string;
  passphrase: string;
}

export interface QuestionEntity {
  id: string;
  qgroupId: string;
  index: number;
  description: string;
  correctAnswer: string;
}

export interface TrialEntity {
  id: string;
  qgroupId: string;
  userId: string;
  index: number;
  startTime: string;
}

export interface AnswerEntity {
  id: string;
  trialId: string;
  questionId: string;
  answer: string;
  score: number;
  scoringStatus?: string | null;
  memo: string;
}
