import React from 'react';

const colorPalettes = {
  red: {
    baseGradient: 'linear-gradient(135deg, rgba(255,150,150,0.45), rgba(255,120,120,0.4), rgba(200,80,80,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(255,170,170,0.6), rgba(255,140,140,0.55), rgba(220,100,100,0.6))',
    boxShadowBase: 'inset 0 0 10px rgba(255,200,200,0.25), 0 4px 10px rgba(180,0,0,0.25)',
    boxShadowHover: 'inset 0 0 15px rgba(255,220,220,0.3), 0 0 12px rgba(255,100,100,0.35), 0 6px 15px rgba(150,0,0,0.35)',
    textColorBase: '#7f0000',
    textColorHover: '#5a0000',
    borderBottom: '1px solid rgba(150,0,0,0.35)',
    borderColor: 'rgba(255,0,0,0.3)',
  },
  white: {
    baseGradient: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(245,245,245,0.75), rgba(230,230,230,0.85))',
    hoverGradient: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,250,250,0.85), rgba(240,240,240,0.95))',
    boxShadowBase: 'inset 0 0 10px rgba(255,255,255,0.5), 0 4px 10px rgba(200,200,200,0.25)',
    boxShadowHover: 'inset 0 0 15px rgba(255,255,255,0.6), 0 0 12px rgba(220,220,220,0.35), 0 6px 15px rgba(180,180,180,0.35)',
    textColorBase: '#333',
    textColorHover: '#111',
    borderBottom: '1px solid rgba(200,200,200,0.35)',
    borderColor: 'rgba(200,200,200,0.3)',
  },
};

interface Props {
  row: {
    answer: {
      scoringStatus: 'incorrect' | 'correct' | undefined;
    };
    index: number;
  };
  handleSelect: (index: number, value: 'correct' | 'incorrect') => void;
}

const LiquidCircleButton: React.FC<Props> = ({ row, handleSelect }) => {
  const isIncorrect = row.answer.scoringStatus === 'incorrect';
  const palette = isIncorrect ? colorPalettes.red : colorPalettes.white;

  const baseStyle: React.CSSProperties = {
    height: '2.5rem',
    width: '2.5rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    borderTop: palette.borderBottom,
    borderRight: `0.5px solid ${palette.borderColor}`,
    borderBottom: palette.borderBottom,
    borderLeft: `0.5px solid ${palette.borderColor}`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: palette.baseGradient,
    color: palette.textColorBase,
    boxShadow: palette.boxShadowBase,
  };

  return (
    <button
      type="button"
      style={baseStyle}
      aria-label={isIncorrect ? 'Incorrect' : 'Unselected'}
      onClick={() => handleSelect(row.index, 'incorrect')}
      onMouseOver={(e) => {
        e.currentTarget.style.background = palette.hoverGradient;
        e.currentTarget.style.boxShadow = palette.boxShadowHover;
        e.currentTarget.style.color = palette.textColorHover;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = palette.baseGradient;
        e.currentTarget.style.boxShadow = palette.boxShadowBase;
        e.currentTarget.style.color = palette.textColorBase;
      }}
    >
      ×
    </button>
  );
};

export default LiquidCircleButton;
