import React from 'react';

type ColorScheme = 'blue' | 'green' | 'red' | 'gray' | 'purple' | 'yellow' | 'orange' | 'white' | 'black';

interface LiquidGlassButtonProps {
  colorScheme?: ColorScheme;
  children?: React.ReactNode;
}

const colorPalettes = {
  blue: {
    baseGradient: 'linear-gradient(135deg, rgba(150,210,255,0.45), rgba(120,190,250,0.4), rgba(90,170,240,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(180,240,255,0.6), rgba(150,220,255,0.55), rgba(120,200,255,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,60,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(120,200,255,0.4), 0 6px 18px rgba(0,0,70,0.4)',
    textColorBase: '#f0faff',
    textColorHover: '#ffffff',
    textShadowBase: '0 0 4px rgba(240,250,255,0.5)',
    textShadowHover: '0 0 6px rgba(180,240,255,0.6), 0 0 10px rgba(150,220,255,0.35)',
    borderBottom: '1px solid rgba(0,0,60,0.35)',
  },
  green: {
    baseGradient: 'linear-gradient(135deg, rgba(160,255,200,0.45), rgba(120,230,180,0.4), rgba(80,200,150,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(180,255,220,0.6), rgba(150,240,200,0.55), rgba(120,220,180,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(0,50,40,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(120,220,180,0.4), 0 6px 18px rgba(0,60,50,0.4)',
    textColorBase: '#e6fff0',
    textColorHover: '#ffffff',
    textShadowBase: '0 0 4px rgba(230,255,240,0.5)',
    textShadowHover: '0 0 6px rgba(180,255,220,0.6), 0 0 10px rgba(150,240,200,0.35)',
    borderBottom: '1px solid rgba(0,80,50,0.35)',
  },
  red: {
    baseGradient: 'linear-gradient(135deg, rgba(255,180,180,0.45), rgba(250,140,140,0.4), rgba(220,100,100,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(255,200,200,0.6), rgba(250,160,160,0.55), rgba(230,120,120,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(100,0,0,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(230,120,120,0.4), 0 6px 18px rgba(80,0,0,0.4)',
    textColorBase: '#ffe6e6',
    textColorHover: '#ffffff',
    textShadowBase: '0 0 4px rgba(255,220,220,0.5)',
    textShadowHover: '0 0 6px rgba(255,200,200,0.6), 0 0 10px rgba(250,160,160,0.35)',
    borderBottom: '1px solid rgba(80,0,0,0.35)',
  },
  gray: {
    baseGradient: 'linear-gradient(135deg, rgba(220,220,220,0.45), rgba(200,200,200,0.4), rgba(180,180,180,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(240,240,240,0.6), rgba(220,220,220,0.55), rgba(200,200,200,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.15), 0 4px 12px rgba(120,120,120,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.2), 0 0 16px rgba(200,200,200,0.35), 0 6px 18px rgba(150,150,150,0.25)',
    textColorBase: '#333333',
    textColorHover: '#111111',
    textShadowBase: '0 0 3px rgba(255,255,255,0.3)',
    textShadowHover: '0 0 5px rgba(255,255,255,0.4)',
    borderBottom: '1px solid rgba(150,150,150,0.35)',
  },
  purple: {
    baseGradient: 'linear-gradient(135deg, rgba(200,180,255,0.45), rgba(170,140,250,0.4), rgba(140,100,240,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(230,200,255,0.6), rgba(200,170,250,0.55), rgba(170,140,240,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(80,0,120,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(170,140,240,0.4), 0 6px 18px rgba(100,0,150,0.35)',
    textColorBase: '#f5f0ff',
    textColorHover: '#ffffff',
    textShadowBase: '0 0 4px rgba(230,200,255,0.5)',
    textShadowHover: '0 0 6px rgba(200,170,250,0.6), 0 0 10px rgba(170,140,240,0.35)',
    borderBottom: '1px solid rgba(100,0,150,0.35)',
  },
  yellow: {
    baseGradient: 'linear-gradient(135deg, rgba(255,250,180,0.45), rgba(255,240,140,0.4), rgba(255,220,100,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(255,255,200,0.6), rgba(255,245,160,0.55), rgba(255,230,120,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(180,150,0,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(255,230,120,0.35), 0 6px 18px rgba(200,180,0,0.35)',
    textColorBase: '#333300',
    textColorHover: '#111100',
    textShadowBase: '0 0 3px rgba(255,245,180,0.5)',
    textShadowHover: '0 0 5px rgba(255,230,120,0.6)',
    borderBottom: '1px solid rgba(200,180,0,0.35)',
  },
  orange: {
    baseGradient: 'linear-gradient(135deg, rgba(255,200,150,0.45), rgba(255,170,100,0.4), rgba(255,140,60,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(255,220,180,0.6), rgba(255,190,140,0.55), rgba(255,160,100,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(180,80,0,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(255,160,100,0.35), 0 6px 18px rgba(200,100,0,0.35)',
    textColorBase: '#331a00',
    textColorHover: '#110900',
    textShadowBase: '0 0 3px rgba(255,200,150,0.5)',
    textShadowHover: '0 0 5px rgba(255,160,100,0.6)',
    borderBottom: '1px solid rgba(200,100,0,0.35)',
  },
  white: {
    baseGradient: 'linear-gradient(135deg, rgba(250,250,250,0.6), rgba(245,245,245,0.45), rgba(235,235,235,0.45))', // 薄いグレーを混ぜる
    hoverGradient: 'linear-gradient(135deg, rgba(255,255,255,0.75), rgba(250,250,250,0.6), rgba(240,240,240,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.25), 0 4px 12px rgba(200,200,200,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.3), 0 0 16px rgba(220,220,220,0.35), 0 6px 18px rgba(180,180,180,0.25)',
    textColorBase: '#333333',
    textColorHover: '#111111',
    textShadowBase: '0 0 3px rgba(255,255,255,0.4)',
    textShadowHover: '0 0 5px rgba(255,255,255,0.5)',
    borderBottom: '1px solid rgba(180,180,180,0.35)',
  },
  black: {
    baseGradient: 'linear-gradient(135deg, rgba(20,20,20,0.45), rgba(40,40,40,0.4), rgba(60,60,60,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(30,30,30,0.6), rgba(50,50,50,0.55), rgba(70,70,70,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.15), 0 0 16px rgba(70,70,70,0.35), 0 6px 18px rgba(0,0,0,0.4)',
    textColorBase: '#f0f0f0',
    textColorHover: '#ffffff',
    textShadowBase: '0 0 4px rgba(255,255,255,0.2)',
    textShadowHover: '0 0 6px rgba(255,255,255,0.3)',
    borderBottom: '1px solid rgba(0,0,0,0.35)',
  },
};

const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  colorScheme = 'orange',
  children = 'Glass Button',
}) => {
  const palette = colorPalettes[colorScheme];

  const baseStyle: React.CSSProperties = {
    position: 'relative',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.375rem',
    fontWeight: 600,
    color: palette.textColorBase,
    background: palette.baseGradient,
    borderTop: '1px solid rgba(255,255,255,0.3)',
    borderRight: '0.5px solid rgba(255,255,255,0.15)',
    borderBottom: palette.borderBottom,
    borderLeft: '0.5px solid rgba(255,255,255,0.15)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: palette.boxShadowBase,
    transition: 'all 0.35s ease',
    cursor: 'pointer',
    textShadow: palette.textShadowBase,
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.background = palette.hoverGradient;
    target.style.boxShadow = palette.boxShadowHover;
    target.style.color = palette.textColorHover;
    target.style.textShadow = palette.textShadowHover;
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.background = palette.baseGradient;
    target.style.boxShadow = palette.boxShadowBase;
    target.style.color = palette.textColorBase;
    target.style.textShadow = palette.textShadowBase;
  };

  return (
    <button style={baseStyle} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      {children}
    </button>
  );
};

export default LiquidGlassButton;



// import React from 'react';

// const deepLiquidGlassButton: React.CSSProperties = {
//   position: 'relative',
//   padding: '0.5rem 1.5rem',
//   borderRadius: '0.375rem',
//   color: '#e6fff0', // 文字を明るい緑寄りに
//   fontWeight: 600,
//   background:
//     'linear-gradient(135deg, rgba(160,255,200,0.45), rgba(120,230,180,0.4), rgba(80,200,150,0.45))', // 緑系グラデーション
//   borderTop: '1px solid rgba(255,255,255,0.3)',
//   borderRight: '0.5px solid rgba(255,255,255,0.15)',
//   borderBottom: '1px solid rgba(0,80,50,0.35)',
//   borderLeft: '0.5px solid rgba(255,255,255,0.15)',
//   backdropFilter: 'blur(12px)',
//   WebkitBackdropFilter: 'blur(12px)',
//   boxShadow:
//     'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(0,50,40,0.25)',
//   transition: 'all 0.35s ease',
//   cursor: 'pointer',
//   textShadow: '0 0 4px rgba(230,255,240,0.5)', // 通常時でも文字に薄い光
// };

// const LiquidGlassButton: React.FC = () => {
//   return (
//     <button
//       style={deepLiquidGlassButton}
//       onMouseOver={(e) => {
//         e.currentTarget.style.background =
//           'linear-gradient(135deg, rgba(180,255,220,0.6), rgba(150,240,200,0.55), rgba(120,220,180,0.6))'; // 青緑強めでホバー
//         e.currentTarget.style.boxShadow =
//           'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(120,220,180,0.4), 0 6px 18px rgba(0,60,50,0.4)';
//         e.currentTarget.style.color = '#ffffff'; // 文字をさらに目立たせる
//         e.currentTarget.style.textShadow =
//           '0 0 6px rgba(180,255,220,0.6), 0 0 10px rgba(150,240,200,0.35)';
//       }}
//       onMouseOut={(e) => {
//         e.currentTarget.style.background =
//           'linear-gradient(135deg, rgba(160,255,200,0.45), rgba(120,230,180,0.4), rgba(80,200,150,0.45))';
//         e.currentTarget.style.boxShadow =
//           'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(0,50,40,0.25)';
//         e.currentTarget.style.color = '#e6fff0';
//         e.currentTarget.style.textShadow = '0 0 4px rgba(230,255,240,0.5)';
//       }}
//     >
//       Mint Green Glass
//     </button>
//   );
// };

// export default LiquidGlassButton;

// import React from 'react';

// const deepLiquidGlassButton: React.CSSProperties = {
//   position: 'relative',
//   padding: '0.5rem 1.5rem',
//   borderRadius: '0.375rem',
//   color: '#fdfeffff', // 文字を明るくして際立たせる
//   fontWeight: 600,
//   background:
//     'linear-gradient(135deg, rgba(150,210,255,0.45), rgba(120,190,250,0.4), rgba(90,170,240,0.45))', // 少し落ち着かせて文字を際立たせる
//   borderTop: '1px solid rgba(255,255,255,0.3)',
//   borderRight: '0.5px solid rgba(255,255,255,0.15)',
//   borderBottom: '1px solid rgba(0,40,100,0.35)',
//   borderLeft: '0.5px solid rgba(255,255,255,0.15)',
//   backdropFilter: 'blur(12px)',
//   WebkitBackdropFilter: 'blur(12px)',
//   boxShadow:
//     'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,60,0.25)',
//   transition: 'all 0.35s ease',
//   cursor: 'pointer',
//   textShadow: '0 0 4px rgba(240,250,255,0.5)', // 通常時でも文字に薄い光
// };

// const LiquidGlassButton: React.FC = () => {
//   return (
//     <button
//       style={deepLiquidGlassButton}
//       onMouseOver={(e) => {
//         e.currentTarget.style.background =
//           'linear-gradient(135deg, rgba(180,240,255,0.6), rgba(150,220,255,0.55), rgba(120,200,255,0.6))';
//         e.currentTarget.style.boxShadow =
//           'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(120,200,255,0.4), 0 6px 18px rgba(0,0,70,0.4)';
//         e.currentTarget.style.color = '#ffffff'; // ホバー時はより白くして文字を強調
//         e.currentTarget.style.textShadow =
//           '0 0 6px rgba(180,240,255,0.6), 0 0 10px rgba(150,220,255,0.4)';
//       }}
//       onMouseOut={(e) => {
//         e.currentTarget.style.background =
//           'linear-gradient(135deg, rgba(150,210,255,0.45), rgba(120,190,250,0.4), rgba(90,170,240,0.45))';
//         e.currentTarget.style.boxShadow =
//           'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,60,0.25)';
//         e.currentTarget.style.color = '#f0faff';
//         e.currentTarget.style.textShadow = '0 0 4px rgba(240,250,255,0.5)';
//       }}
//     >
//       Ice Blue Glass
//     </button>
//   );
// };

// export default LiquidGlassButton;
