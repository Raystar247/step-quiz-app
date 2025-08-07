export type TrialPostData = {
    qgroupId: string;
    userId: string;
    startTime: string;
};

export type QGroup = {
    id: string;
    title: string;
    passphrase: string;
    timeLimit: number;
};