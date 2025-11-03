import React from 'react';

// 🎨 カラーパレット定義
const colorPalettes = {
  blue: {
    baseGradient: 'linear-gradient(135deg, rgba(150,210,255,0.45), rgba(120,190,250,0.4), rgba(90,170,240,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(180,240,255,0.6), rgba(150,220,255,0.55), rgba(120,200,255,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,60,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(120,200,255,0.4), 0 6px 18px rgba(0,0,70,0.4)',
    textColorBase: '#ffffff',
    textShadowBase: '0 0 4px rgba(240,250,255,0.5)',
    textShadowHover: '0 0 6px rgba(180,240,255,0.6), 0 0 10px rgba(150,220,255,0.35)',
    borderBottom: '1px solid rgba(0,0,60,0.35)',
  },
  green: {
    baseGradient: 'linear-gradient(135deg, rgba(160,255,200,0.45), rgba(120,230,180,0.4), rgba(80,200,150,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(180,255,220,0.6), rgba(150,240,200,0.55), rgba(120,220,180,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(0,50,40,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(120,220,180,0.4), 0 6px 18px rgba(0,60,50,0.4)',
    textColorBase: '#ffffff',
    textShadowBase: '0 0 4px rgba(230,255,240,0.5)',
    textShadowHover: '0 0 6px rgba(180,255,220,0.6), 0 0 10px rgba(150,240,200,0.35)',
    borderBottom: '1px solid rgba(0,80,50,0.35)',
  },
  red: {
    baseGradient: 'linear-gradient(135deg, rgba(255,180,180,0.45), rgba(250,140,140,0.4), rgba(220,100,100,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(255,200,200,0.6), rgba(250,160,160,0.55), rgba(230,120,120,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(100,0,0,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(230,120,120,0.4), 0 6px 18px rgba(80,0,0,0.4)',
    textColorBase: '#ffffff',
    textShadowBase: '0 0 4px rgba(255,220,220,0.5)',
    textShadowHover: '0 0 6px rgba(255,200,200,0.6), 0 0 10px rgba(250,160,160,0.35)',
    borderBottom: '1px solid rgba(80,0,0,0.35)',
  },
  gray: {
    baseGradient: 'linear-gradient(135deg, rgba(220,220,220,0.45), rgba(200,200,200,0.4), rgba(180,180,180,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(240,240,240,0.6), rgba(220,220,220,0.55), rgba(200,200,200,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.15), 0 4px 12px rgba(120,120,120,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.2), 0 0 16px rgba(200,200,200,0.35), 0 6px 18px rgba(150,150,150,0.25)',
    textColorBase: '#111111',
    textShadowBase: '0 0 3px rgba(255,255,255,0.3)',
    textShadowHover: '0 0 5px rgba(255,255,255,0.4)',
    borderBottom: '1px solid rgba(150,150,150,0.35)',
  },
  purple: {
    baseGradient: 'linear-gradient(135deg, rgba(200,180,255,0.45), rgba(170,140,250,0.4), rgba(140,100,240,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(230,200,255,0.6), rgba(200,170,250,0.55), rgba(170,140,240,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(80,0,120,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(170,140,240,0.4), 0 6px 18px rgba(100,0,150,0.35)',
    textColorBase: '#ffffff',
    textShadowBase: '0 0 4px rgba(230,200,255,0.5)',
    textShadowHover: '0 0 6px rgba(200,170,250,0.6), 0 0 10px rgba(170,140,240,0.35)',
    borderBottom: '1px solid rgba(100,0,150,0.35)',
  },
  yellow: {
    baseGradient: 'linear-gradient(135deg, rgba(255,250,180,0.45), rgba(255,240,140,0.4), rgba(255,220,100,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(255,255,200,0.6), rgba(255,245,160,0.55), rgba(255,230,120,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(180,150,0,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(255,230,120,0.35), 0 6px 18px rgba(200,180,0,0.35)',
    textColorBase: '#111100',
    textShadowBase: '0 0 3px rgba(255,245,180,0.5)',
    textShadowHover: '0 0 5px rgba(255,230,120,0.6)',
    borderBottom: '1px solid rgba(200,180,0,0.35)',
  },
  orange: {
    baseGradient: 'linear-gradient(135deg, rgba(255,200,150,0.45), rgba(255,170,100,0.4), rgba(255,140,60,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(255,220,180,0.6), rgba(255,190,140,0.55), rgba(255,160,100,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(180,80,0,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(255,160,100,0.35), 0 6px 18px rgba(200,100,0,0.35)',
    textColorBase: '#110900',
    textShadowBase: '0 0 3px rgba(255,200,150,0.5)',
    textShadowHover: '0 0 5px rgba(255,160,100,0.6)',
    borderBottom: '1px solid rgba(200,100,0,0.35)',
  },
  white: {
    baseGradient: 'linear-gradient(135deg, rgba(250,250,250,0.6), rgba(245,245,245,0.45), rgba(235,235,235,0.45))', // 薄いグレーを混ぜる
    hoverGradient: 'linear-gradient(135deg, rgba(255,255,255,0.75), rgba(250,250,250,0.6), rgba(240,240,240,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.25), 0 4px 12px rgba(200,200,200,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.3), 0 0 16px rgba(220,220,220,0.35), 0 6px 18px rgba(180,180,180,0.25)',
    textColorBase: '#111111',
    textShadowBase: '0 0 3px rgba(255,255,255,0.4)',
    textShadowHover: '0 0 5px rgba(255,255,255,0.5)',
    borderBottom: '1px solid rgba(180,180,180,0.35)',
  },
  black: {
    baseGradient: 'linear-gradient(135deg, rgba(20,20,20,0.45), rgba(40,40,40,0.4), rgba(60,60,60,0.45))',
    hoverGradient: 'linear-gradient(135deg, rgba(30,30,30,0.6), rgba(50,50,50,0.55), rgba(70,70,70,0.6))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.15), 0 0 16px rgba(70,70,70,0.35), 0 6px 18px rgba(0,0,0,0.4)',
    textColorBase: '#ffffff',
    textShadowBase: '0 0 4px rgba(255,255,255,0.2)',
    textShadowHover: '0 0 6px rgba(255,255,255,0.3)',
    borderBottom: '1px solid rgba(0,0,0,0.35)',
  },
    lightGray: {
    baseGradient: 'linear-gradient(135deg, rgba(235,235,235,0.55), rgba(225,225,225,0.5), rgba(215,215,215,0.55))',
    hoverGradient: 'linear-gradient(135deg, rgba(245,245,245,0.7), rgba(235,235,235,0.6), rgba(225,225,225,0.65))',
    boxShadowBase: 'inset 0 0 12px rgba(255,255,255,0.2), 0 4px 12px rgba(160,160,160,0.25)',
    boxShadowHover: 'inset 0 0 18px rgba(255,255,255,0.25), 0 0 16px rgba(200,200,200,0.35), 0 6px 18px rgba(180,180,180,0.25)',
    textColorBase: '#333333',
    textShadowBase: '0 0 3px rgba(255,255,255,0.35)',
    textShadowHover: '0 0 5px rgba(255,255,255,0.45)',
    borderBottom: '1px solid rgba(170,170,170,0.35)',
  },
} as const;

export type ColorScheme = keyof typeof colorPalettes;
type Shape = 'circle' | 'rounded' | 'square';

const shapeStyles: Record<Shape, React.CSSProperties> = {
  circle: { borderRadius: '50%' },
  rounded: { borderRadius: '0.375rem' },
  square: { borderRadius: '0' },
};

/**
 * 🧩 基本の共通 props
 */
interface LiquidGlassBaseProps {
  colorScheme?: ColorScheme;
  shape?: Shape;
  hoverEffect?: boolean;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;

  /** 🎯 コンテンツを中央に配置するか（デフォルト: true） */
  centerContent?: boolean;

  /** 🧩 内側のpaddingを消す（デフォルト: false） */
  noPadding?: boolean;
}


/**
 * 💡 全HTML要素に対応する属性型を抽出するユーティリティ
 */
type ElementProps<T extends keyof JSX.IntrinsicElements> =
  T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : never;

/**
 * 💧 LiquidGlass props：asによって型が自動的に切り替わる
 */
export type LiquidGlassProps<T extends keyof JSX.IntrinsicElements = 'button'> =
  LiquidGlassBaseProps &
    ElementProps<T> & {
      as?: T;
      /**
       * input, img などは children を受け付けない
       */
      children?: T extends 'input' | 'img' ? never : React.ReactNode;
    };

/**
 * 💎 LiquidGlass本体
 */
const LiquidGlass = <T extends keyof JSX.IntrinsicElements = 'button'>({
  as,
  colorScheme = 'blue',
  shape = 'rounded',
  hoverEffect = true,
  width,
  height,
  style,
  children,
  centerContent = true,  // ✅ デフォルト値つきで追加
  noPadding = false,     // ✅ デフォルト値つきで追加
  ...rest
}: LiquidGlassProps<T>) => {
  const Component = (as || 'button') as keyof JSX.IntrinsicElements;
  const palette = colorPalettes[colorScheme];

  const isClickable =
    Component === 'button' ||
    Component === 'a' ||
    typeof (rest as any).onClick === 'function';

  const defaultDisplayMap: Record<string, React.CSSProperties['display']> = {
    div: 'block',
    span: 'inline',
    button: 'inline-flex',
    input: 'inline-block',
    textarea: 'inline-block',
    a: 'inline-flex',
    img: 'inline-block',
  };

  // circle の場合は width or height 片方だけで自動調整
  let finalWidth = width;
  let finalHeight = height;
  let aspectRatioStyle: React.CSSProperties = {};
  if (shape === 'circle') {
    if (width && !height) finalHeight = undefined;
    if (height && !width) finalWidth = undefined;
    // 両方未指定ならデフォルトサイズ
    if (!width && !height) finalWidth = '40px';
    // aspect-ratio を設定して常に真円
    aspectRatioStyle = { aspectRatio: '1 / 1' };
  }

const baseStyle: React.CSSProperties = {
  display: centerContent ? 'inline-flex' : defaultDisplayMap[Component] || 'inline-block',
  ...(centerContent && {
    alignItems: 'center',
    justifyContent: 'center',
  }),
  padding: noPadding
    ? 0
    : shape === 'circle'
      ? 0
      : Component === 'input' || Component === 'textarea'
        ? '0.5rem 1rem'
        : '0.5rem 1.5rem',
  fontWeight: 'normal',
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
  cursor: isClickable ? 'pointer' : 'default',
  textShadow: palette.textShadowBase,
  width: finalWidth,
  height: finalHeight,
  borderRadius: shape === 'circle' ? '50%' : shapeStyles[shape].borderRadius,
  ...aspectRatioStyle,
  ...style,
};


  const handleMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    if (!hoverEffect) return;
    const el = e.currentTarget;
    el.style.background = palette.hoverGradient;
    el.style.boxShadow = palette.boxShadowHover;
    el.style.textShadow = palette.textShadowHover;
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLElement>) => {
    if (!hoverEffect) return;
    const el = e.currentTarget;
    el.style.background = palette.baseGradient;
    el.style.boxShadow = palette.boxShadowBase;
    el.style.textShadow = palette.textShadowBase;
  };

  return (
    <Component
      style={baseStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      {...(rest as any)}
    >
      {children}
    </Component>
  );
};

export default LiquidGlass;
