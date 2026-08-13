import { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);

function useYoyo(from: number, to: number, duration: number) {
  const value = useSharedValue(from);
  useEffect(() => {
    value.value = withRepeat(
      withTiming(to, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);
  return value;
}

interface Props {
  style?: StyleProp<ViewStyle>;
}

export default function AnimatedSavasArkaplan({ style }: Props) {
  const sunOpacity = useYoyo(0.85, 1, 2500);
  const flagAngle = useYoyo(-6, 6, 1100);
  const cloud1X = useYoyo(-18, 18, 7000);
  const cloud2X = useYoyo(18, -18, 9000);
  const cloud3X = useYoyo(-14, 14, 8000);
  const birdY = useYoyo(0, -4, 400);

  const sunProps = useAnimatedProps(() => ({ opacity: sunOpacity.value }));
  const flagProps = useAnimatedProps(() => ({
    transform: `rotate(${flagAngle.value} 0 10)`,
  }));
  const cloud1Props = useAnimatedProps(() => ({
    transform: `translate(${cloud1X.value} 0)`,
  }));
  const cloud2Props = useAnimatedProps(() => ({
    transform: `translate(${cloud2X.value} 0)`,
  }));
  const cloud3Props = useAnimatedProps(() => ({
    transform: `translate(${cloud3X.value} 0)`,
  }));
  const birdProps = useAnimatedProps(() => ({
    transform: `translate(0 ${birdY.value})`,
  }));

  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      style={style}
    >
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8ecae6" />
          <Stop offset="0.55" stopColor="#bde4f0" />
          <Stop offset="1" stopColor="#e8f6fb" />
        </LinearGradient>
        <LinearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#a8d88a" />
          <Stop offset="1" stopColor="#8ec96f" />
        </LinearGradient>
        <LinearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8ec96f" />
          <Stop offset="1" stopColor="#72b856" />
        </LinearGradient>
        <LinearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#7cbf5e" />
          <Stop offset="1" stopColor="#5fa844" />
        </LinearGradient>
        <LinearGradient id="tent1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#f4a259" />
          <Stop offset="1" stopColor="#e07a3a" />
        </LinearGradient>
        <LinearGradient id="tent2" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#e5989b" />
          <Stop offset="1" stopColor="#c96a6d" />
        </LinearGradient>
        <LinearGradient id="tent3" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#a3c4f3" />
          <Stop offset="1" stopColor="#7098d8" />
        </LinearGradient>
        <RadialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#fff6d0" />
          <Stop offset="0.7" stopColor="#ffe89a" />
          <Stop offset="1" stopColor="#ffe89a" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* SKY */}
      <Rect width={1200} height={800} fill="url(#sky)" />

      {/* SUN */}
      <AnimatedG animatedProps={sunProps}>
        <Circle cx={990} cy={140} r={120} fill="url(#sun)" />
        <Circle cx={990} cy={140} r={52} fill="#ffe066" />
      </AnimatedG>

      {/* BIRDS */}
      <G fill="none" stroke="#5a6a72" strokeWidth={3} strokeLinecap="round">
        <AnimatedG animatedProps={birdProps}>
          <Path d="M250 130 q10 -10 20 0 q10 -10 20 0" />
        </AnimatedG>
        <AnimatedG animatedProps={birdProps}>
          <Path d="M320 160 q8 -8 16 0 q8 -8 16 0" />
        </AnimatedG>
        <AnimatedG animatedProps={birdProps}>
          <Path d="M180 180 q8 -8 16 0 q8 -8 16 0" />
        </AnimatedG>
      </G>

      {/* CLOUDS */}
      <G fill="#ffffff" opacity={0.95}>
        <AnimatedG animatedProps={cloud1Props}>
          <Ellipse cx={150} cy={120} rx={70} ry={38} />
          <Ellipse cx={210} cy={105} rx={55} ry={42} />
          <Ellipse cx={95} cy={132} rx={48} ry={30} />
        </AnimatedG>
        <AnimatedG animatedProps={cloud2Props}>
          <Ellipse cx={500} cy={90} rx={60} ry={32} />
          <Ellipse cx={555} cy={78} rx={48} ry={36} />
          <Ellipse cx={450} cy={100} rx={40} ry={26} />
        </AnimatedG>
        <AnimatedG animatedProps={cloud3Props}>
          <Ellipse cx={820} cy={200} rx={55} ry={30} />
          <Ellipse cx={870} cy={188} rx={44} ry={34} />
        </AnimatedG>
      </G>

      {/* HILLS back/mid */}
      <Path
        fill="url(#hillBack)"
        d="M0 430 Q200 360 420 420 Q650 480 850 410 Q1050 350 1200 420 L1200 800 L0 800 Z"
      />
      <Path
        fill="url(#hillMid)"
        d="M0 520 Q250 450 500 510 Q750 570 1000 500 Q1120 470 1200 510 L1200 800 L0 800 Z"
      />

      {/* DISTANT CASTLE */}
      <G transform="translate(560,340)" opacity={0.85}>
        <Rect x={0} y={0} width={90} height={70} fill="#c9b79c" />
        <Rect x={-18} y={-14} width={26} height={84} fill="#b8a488" />
        <Rect x={82} y={-14} width={26} height={84} fill="#b8a488" />
        <Path d="M-18 -14 h26 v-10 h-8 v6 h-4 v-6 h-6 v6 h-4 v-6 h-4 z" fill="#b8a488" />
        <Path d="M82 -14 h26 v-10 h-8 v6 h-4 v-6 h-6 v6 h-4 v-6 h-4 z" fill="#b8a488" />
        <Rect x={36} y={24} width={18} height={46} fill="#8a7355" />
        <Path d="M45 -14 L45 -40" stroke="#8a6d2f" strokeWidth={3} />
        <G transform="translate(45,-40)">
          <AnimatedG animatedProps={flagProps}>
            <Path d="M0 0 L26 6 L0 14 Z" fill="#e05a4a" />
          </AnimatedG>
        </G>
      </G>

      {/* HILLS front */}
      <Path
        fill="url(#hillFront)"
        d="M0 640 Q300 570 620 630 Q900 680 1200 610 L1200 800 L0 800 Z"
      />

      {/* Tent left */}
      <G transform="translate(150,560)">
        <Ellipse cx={55} cy={120} rx={80} ry={14} fill="#4a8836" opacity={0.4} />
        <Path d="M10 120 L55 30 L100 120 Z" fill="url(#tent1)" />
        <Path d="M55 30 L100 120 L78 120 L55 55 Z" fill="#c9662f" opacity={0.6} />
        <Path d="M40 120 L55 78 L70 120 Z" fill="#7a3d1a" />
        <Path d="M55 30 L55 8" stroke="#8a6d2f" strokeWidth={3} />
        <G transform="translate(55,8)">
          <AnimatedG animatedProps={flagProps}>
            <Path d="M0 0 L30 7 L0 16 Z" fill="#ffd166" />
          </AnimatedG>
        </G>
      </G>

      {/* Tent center-right */}
      <G transform="translate(880,590)">
        <Ellipse cx={55} cy={120} rx={85} ry={14} fill="#4a8836" opacity={0.4} />
        <Path d="M6 120 L55 26 L104 120 Z" fill="url(#tent3)" />
        <Path d="M55 26 L104 120 L80 120 L55 52 Z" fill="#5a7fc0" opacity={0.6} />
        <Path d="M40 120 L55 76 L70 120 Z" fill="#3a5a90" />
        <Path d="M55 26 L55 4" stroke="#8a6d2f" strokeWidth={3} />
        <G transform="translate(55,4)">
          <AnimatedG animatedProps={flagProps}>
            <Path d="M0 0 L28 7 L0 15 Z" fill="#e05a4a" />
          </AnimatedG>
        </G>
      </G>

      {/* Small tent far right */}
      <G transform="translate(1040,610)" opacity={0.95}>
        <Ellipse cx={40} cy={90} rx={58} ry={10} fill="#4a8836" opacity={0.4} />
        <Path d="M8 90 L40 22 L72 90 Z" fill="url(#tent2)" />
        <Path d="M40 22 L72 90 L56 90 L40 42 Z" fill="#a34d50" opacity={0.6} />
        <Path d="M40 22 L40 4" stroke="#8a6d2f" strokeWidth={2.5} />
        <G transform="translate(40,4)">
          <AnimatedG animatedProps={flagProps}>
            <Path d="M0 0 L22 5 L0 12 Z" fill="#ffd166" />
          </AnimatedG>
        </G>
      </G>

      {/* Standing banner flags */}
      <G transform="translate(430,540)">
        <Path d="M0 0 L0 200" stroke="#8a6d2f" strokeWidth={7} strokeLinecap="round" />
        <Circle cx={0} cy={-4} r={7} fill="#e0b74a" />
        <G transform="translate(0,10)">
          <AnimatedG animatedProps={flagProps}>
            <Path d="M0 0 L60 14 L0 40 Z" fill="#e05a4a" />
            <Path d="M0 0 L60 14 L0 40 Z" fill="none" stroke="#b23a2e" strokeWidth={2} />
          </AnimatedG>
        </G>
      </G>
      <G transform="translate(770,540)">
        <Path d="M0 0 L0 200" stroke="#8a6d2f" strokeWidth={7} strokeLinecap="round" />
        <Circle cx={0} cy={-4} r={7} fill="#e0b74a" />
        <G transform="translate(0,10)">
          <AnimatedG animatedProps={flagProps}>
            <Path d="M0 0 L58 14 L0 40 Z" fill="#3a7ca5" />
            <Path d="M0 0 L58 14 L0 40 Z" fill="none" stroke="#2a5a7a" strokeWidth={2} />
          </AnimatedG>
        </G>
      </G>

      {/* Foreground grass tufts */}
      <G fill="#4a9838">
        <Path d="M60 770 q6 -30 12 0 q6 -30 12 0 q6 -30 12 0 z" />
        <Path d="M300 785 q6 -26 12 0 q6 -26 12 0 z" />
        <Path d="M1080 775 q6 -30 12 0 q6 -30 12 0 q6 -30 12 0 z" />
        <Path d="M640 792 q6 -24 12 0 q6 -24 12 0 z" />
      </G>
    </Svg>
  );
}
