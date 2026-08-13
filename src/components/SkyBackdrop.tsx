import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

// Gökyüzü katmanı: ekranın tamamını kaplar, harita bunun üstünde uçuyormuş gibi durur.
// viewBox sabit tutulup "slice" ile kırpıldığı için bulutlar her ekran oranında
// aynı yuvarlaklıkta kalır — esneyip yamulmazlar.
const VB = 400;

// [x, y, ölçek, opaklık] — üstteki bulutlar daha soluk/küçük, alttakiler yakın ve belirgin.
const CLOUDS: [number, number, number, number][] = [
  [70, 60, 1.1, 0.85],
  [300, 40, 0.75, 0.6],
  [200, 130, 0.55, 0.45],
  [355, 175, 0.95, 0.75],
  [45, 235, 0.85, 0.7],
  [250, 300, 1.25, 0.8],
  [120, 360, 0.7, 0.55],
];

/** Üst üste binen dairelerden oluşan yumuşak bulut. (0,0) bulutun merkezi. */
function Cloud({ x, y, scale, opacity }: { x: number; y: number; scale: number; opacity: number }) {
  return (
    <G transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      {/* Alt gövde: dairelerin arasını doldurup düz bir taban verir. */}
      <Ellipse cx={0} cy={8} rx={46} ry={14} fill="#FFFFFF" />
      <Circle cx={-26} cy={4} r={16} fill="#FFFFFF" />
      <Circle cx={-6} cy={-8} r={22} fill="#FFFFFF" />
      <Circle cx={20} cy={0} r={17} fill="#FFFFFF" />
      <Circle cx={36} cy={8} r={11} fill="#FFFFFF" />
    </G>
  );
}

export default function SkyBackdrop() {
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${VB} ${VB}`} preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.skyTop} />
          <Stop offset="1" stopColor={colors.sky} />
        </LinearGradient>
      </Defs>
      {/* slice kırpması taşabildiği için zemin viewBox'tan geniş çizilir. */}
      <Rect x={-VB} y={-VB} width={VB * 3} height={VB * 3} fill="url(#skyGradient)" />
      {CLOUDS.map(([x, y, scale, opacity]) => (
        <Cloud key={`${x}-${y}`} x={x} y={y} scale={scale} opacity={opacity} />
      ))}
    </Svg>
  );
}
