import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { stepqApi } from '../api/stepqApi';
import type { Answer, Trial, Question } from '../../../models';

/**
 * store for trial-related state
 * - generateTrial and fetchPlayerAnswers are exposed as thunks
 * - 期待する動作: UI はこの store を subscribe して表示を更新する。
 */

type TrialState = {
  currentTrialId?: string;
  currentTrial?: Trial;
  currentQuestion?: Question;
  questions: Question[];
  playerAnswers: Answer[];
  loading: boolean;
  error?: string;
};

const initialState: TrialState = {
  currentTrialId: undefined,
  playerAnswers: [],
  questions: [],
  loading: false,
};

export const generateTrial = createAsyncThunk('trial/generate', async ({ qgroupKeyword, passphrase, userId }:
  { qgroupKeyword: string; passphrase: string; userId: string }) => {
  const id = await stepqApi.generateTrial(qgroupKeyword, passphrase, userId);
  return id;
});

export const fetchPlayerAnswers = createAsyncThunk('trial/fetchAnswers', async ({ qgroupId, userId }:
  { qgroupId: string; userId: string }) => {
  const answers = await stepqApi.fetchPlayerAnswers(qgroupId, userId);
  return answers;
});

export const fetchTrial = createAsyncThunk('trial/fetchTrial', async (trialId: string) => {
  const t = await stepqApi.fetchTrial(trialId);
  return t as Trial | undefined;
});

export const fetchQuestionByIndex = createAsyncThunk('trial/fetchQuestionByIndex', async ({ qgroupId, index }:
  { qgroupId: string; index: number }) => {
  const q = await stepqApi.fetchQuestionByIndex(qgroupId, index);
  return q as Question | undefined;
});

export const fetchQuestionsOfQGroup = createAsyncThunk('trial/fetchQuestionsOfQGroup', async (qgroupId: string) => {
  const qs = await stepqApi.fetchQuestionsOfQGroup(qgroupId);
  return qs;
});

export const postAnswer = createAsyncThunk('trial/postAnswer', async ({ answerText, trialId, questionId }:
  { answerText: string; trialId: string; questionId: string }) => {
  const ok = await stepqApi.postAnswer(answerText, trialId, questionId);
  return ok;
});

const slice = createSlice({
  name: 'trial',
  initialState,
  reducers: {
    setCurrentTrialId(state, action: PayloadAction<string | undefined>) {
      state.currentTrialId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTrial.pending, (s) => { s.loading = true; s.error = undefined; })
      .addCase(generateTrial.fulfilled, (s, a) => { s.loading = false; s.currentTrialId = a.payload; })
      .addCase(generateTrial.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(fetchPlayerAnswers.pending, (s) => { s.loading = true; s.error = undefined; })
      .addCase(fetchPlayerAnswers.fulfilled, (s, a) => { s.loading = false; s.playerAnswers = a.payload; })
      .addCase(fetchPlayerAnswers.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(fetchTrial.pending, (s) => { s.loading = true; s.error = undefined; })
      .addCase(fetchTrial.fulfilled, (s, a) => { s.loading = false; s.currentTrial = a.payload; s.currentTrialId = a.payload?.id; })
      .addCase(fetchTrial.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(fetchQuestionByIndex.pending, (s) => { s.loading = true; s.error = undefined; })
      .addCase(fetchQuestionByIndex.fulfilled, (s, a) => { s.loading = false; s.currentQuestion = a.payload; })
      .addCase(fetchQuestionByIndex.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(fetchQuestionsOfQGroup.pending, (s) => { s.loading = true; s.error = undefined; })
      .addCase(fetchQuestionsOfQGroup.fulfilled, (s, a) => { s.loading = false; s.questions = a.payload; })
      .addCase(fetchQuestionsOfQGroup.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(postAnswer.pending, (s) => { s.loading = true; s.error = undefined; })
      .addCase(postAnswer.fulfilled, (s) => { s.loading = false; })
      .addCase(postAnswer.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
  }
});

export const { setCurrentTrialId } = slice.actions;
export const trialReducer = slice.reducer;

export default slice;
