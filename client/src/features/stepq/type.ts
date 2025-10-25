export type TrialPostData = {
    qgroupId: string;
    userId: string;
    index: number;
    startTime: string;
};

export type Trial = {
    id: string;
    qgroupId: string;
    userId: string;
    index: number;
    startTime: string;
};

export type QGroup = {
    id: string;
    title: string;
    passphrase: string;
    nQuestions: number;
    timeLimit: number;
};

export type Question = {
    id: string;
    qgroupId: string;
    index: number;
    questionText: string;
    correctAnswer: string;
    description: string;
};

export type Answer = {
    id: string;
    trialId: string;
    questionId: string;
    answer: string;
    score: number;
    scoringStatus: 'correct' | 'incorrect' | undefined;
    memo: string;
};

export type ScoringFormattedAnswer = {
    index: number;
    correctAnswer: string;
    answer: Answer;
};


export type UnitString = 'user' | 'question';