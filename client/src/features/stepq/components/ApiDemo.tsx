import React, { useState } from 'react';
import { createTrial, postAnswer, updateAnswer } from '../../../api/client';
import type { TrialCreateDTO, AnswerPostDTO } from '../../../api/client';

const ApiDemo: React.FC = () => {
  const [token, setToken] = useState('');
  const [log, setLog] = useState<string[]>([]);

  const addLog = (s: string) => setLog((l) => [s, ...l]);

  const saveToken = () => {
    try {
      sessionStorage.setItem('token', token);
      addLog('Token saved to sessionStorage');
    } catch (e) {
      addLog('Failed to save token');
    }
  };

  const handleCreateTrial = async () => {
    const dto: TrialCreateDTO = { title: 'Example QGroup', passphrase: 'ok', userId: '00000000-0000-0000-0000-000000000001' };
    try {
      const res = await createTrial(dto);
      addLog(`createTrial: ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`createTrial error: ${e?.response?.data?.error?.message ?? e.message}`);
    }
  };

  const handlePostAnswer = async () => {
    const dto: AnswerPostDTO = { trialId: '00000000-0000-0000-0000-000000000002', questionId: '00000000-0000-0000-0000-000000000003', answer: 'A' };
    try {
      const res = await postAnswer(dto);
      addLog(`postAnswer: ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`postAnswer error: ${e?.response?.data?.error?.message ?? e.message}`);
    }
  };

  const handleUpdateAnswer = async () => {
    try {
      const res = await updateAnswer('00000000-0000-0000-0000-000000000004', { score: 5, scoringStatus: 'scored' });
      addLog(`updateAnswer: ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`updateAnswer error: ${e?.response?.data?.error?.message ?? e.message}`);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>API Demo</h3>
      <div>
        <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="JWT token" style={{ width: 400 }} />
        <button onClick={saveToken}>Save token</button>
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={handleCreateTrial}>Create Trial</button>
        <button onClick={handlePostAnswer} style={{ marginLeft: 8 }}>Post Answer</button>
        <button onClick={handleUpdateAnswer} style={{ marginLeft: 8 }}>Update Answer</button>
      </div>
      <div style={{ marginTop: 12 }}>
        <h4>Log</h4>
        <div style={{ maxHeight: 240, overflow: 'auto', background: '#f6f6f6', padding: 8 }}>
          {log.map((l, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: 12 }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiDemo;
