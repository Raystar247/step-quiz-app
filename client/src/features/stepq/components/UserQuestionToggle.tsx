import React, { useMemo } from 'react';
import type { UnitString } from '../type';

interface UserQuestionToggleProps {
    unit: UnitString;
    onChange?: (unit: UnitString) => void;
}

const UserQuestionToggle: React.FC<UserQuestionToggleProps> = ({ unit, onChange }) => {
    
  const handleToggle = (newUnit: UnitString) => {
    onChange?.(newUnit);
  };

  // 枠線スタイル生成
  const borderStyles = useMemo(() => ({
    borderTop: '1px solid rgba(128,128,128,0.18)',
    borderRight: '0.5px solid rgba(128,128,128,0.10)',
    borderBottom: '1px solid rgba(128,128,128,0.22)',
    borderLeft: '0.5px solid rgba(128,128,128,0.10)',
  }), []);

  // 全体背景グラデーション
  const containerBg = 'radial-gradient(circle at 60% 40%, rgba(220,220,220,0.18) 0%, rgba(180,180,180,0.12) 60%, rgba(140,140,140,0.08) 100%)';

  // 選択ボタンのグラデーション
  const selectedBtnBg = 'radial-gradient(circle at 60% 40%, rgba(30,144,255,0.55) 0%, rgba(30,144,255,0.38) 70%, rgba(30,144,255,0.28) 100%)';
  const unselectedBtnBg = 'rgba(255,255,255,0.10)';

  // ボタン共通スタイル
  const buttonBaseStyle: React.CSSProperties = {
    border: 'none',
    outline: 'none',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    transition: 'background 0.2s',
  };

  return (
    <div
      className="inline-flex rounded-xl overflow-hidden text-sm"
      style={{
        ...borderStyles,
        background: containerBg,
        boxShadow: '0 2px 12px 0 rgba(30,144,255,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.18)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '0.5rem',
        transition: 'box-shadow 0.3s',
      }}
    >
      <button
        onClick={() => handleToggle('user')}
        className="px-4 py-2 transition-colors duration-200 font-semibold text-white shadow-md"
        style={{
          ...buttonBaseStyle,
          background: unit === 'user' ? selectedBtnBg : unselectedBtnBg,
          color: unit === 'user' ? '#fff' : '#1e293b',
        }}
      >
        👤 User
      </button>
      <button
        onClick={() => handleToggle('question')}
        className="px-4 py-2 transition-colors duration-200 font-semibold text-white shadow-md"
        style={{
          ...buttonBaseStyle,
          background: unit === 'question' ? selectedBtnBg : unselectedBtnBg,
          color: unit === 'question' ? '#fff' : '#1e293b',
        }}
      >
        ❓ Question
      </button>
    </div>
  );
};

export default UserQuestionToggle;