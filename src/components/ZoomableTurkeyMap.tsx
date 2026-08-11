import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import TurkeyMap from './TurkeyMap';
import { colors } from '../theme/colors';
import { TURKEY_MAP_VIEWBOX } from '../data/turkeyProvincePaths';

const [, , VB_WIDTH, VB_HEIGHT] = TURKEY_MAP_VIEWBOX.split(' ').map(Number);
const MAP_ASPECT_RATIO = VB_WIDTH / VB_HEIGHT;

// Marmara bölgesi il sınırlarından hesaplanmış viewBox koordinatlarında kutu
// (İstanbul, Kocaeli, Tekirdağ, Edirne, Kırklareli, Çanakkale, Bursa, Balıkesir, Yalova).
const MARMARA_CENTER_X = 122.9;
const MARMARA_CENTER_Y = 103.1;
const MARMARA_WIDTH = 245.7;
const MARMARA_HEIGHT = 206.6;

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

interface Props {
  getProvinceColor: (provinceName: string) => string | null;
  onSelectProvince: (provinceName: string, plate: string) => void;
}

export default function ZoomableTurkeyMap({ getProvinceColor, onSelectProvince }: Props) {
  const [container, setContainer] = useState({ width: 0, height: 0 });
  const hasInitialized = useRef(false);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  function onContainerLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setContainer({ width, height });
  }

  const { baseWidth, baseHeight, minScale, maxScale } = useMemo(() => {
    const w = container.width || 1;
    const h = container.height || 1;
    const bw = w;
    const bh = w / MAP_ASPECT_RATIO;
    // Tam sığdırma: en uzak zoomda Türkiye'nin tamamı kartın içinde görünür.
    const contain = Math.min(1, h / bh);
    // En yakın zoom, kartı tamamen kaplayan ölçeğin katı olarak sınırlanır.
    const cover = Math.max(1, h / bh);
    return { baseWidth: bw, baseHeight: bh, minScale: contain, maxScale: cover * 3 };
  }, [container.width, container.height]);

  // Bir eksende içerik kart alanından küçükse ortalar, büyükse kenarlar arasında sınırlar.
  function clampTranslate(nextScale: number, tx: number, ty: number) {
    'worklet';
    const scaledWidth = baseWidth * nextScale;
    const scaledHeight = baseHeight * nextScale;

    const x =
      scaledWidth <= container.width
        ? (container.width - scaledWidth) / 2
        : clamp(tx, container.width - scaledWidth, 0);
    const y =
      scaledHeight <= container.height
        ? (container.height - scaledHeight) / 2
        : clamp(ty, container.height - scaledHeight, 0);

    return { x, y };
  }

  // İlk açılışta haritayı Marmara bölgesine odaklayıp yakınlaştırır.
  useEffect(() => {
    if (hasInitialized.current || container.width === 0) return;
    hasInitialized.current = true;

    const k0 = baseWidth / VB_WIDTH;
    const marmaraScale = Math.min(
      (container.width * 0.92) / (MARMARA_WIDTH * k0),
      (container.height * 0.92) / (MARMARA_HEIGHT * k0)
    );
    const initialScale = clamp(marmaraScale, minScale, maxScale);
    const centerBaseX = MARMARA_CENTER_X * k0;
    const centerBaseY = MARMARA_CENTER_Y * k0;

    const rawTx = container.width / 2 - centerBaseX * initialScale;
    const rawTy = container.height / 2 - centerBaseY * initialScale;
    const clamped = clampTranslate(initialScale, rawTx, rawTy);

    scale.value = initialScale;
    translateX.value = clamped.x;
    translateY.value = clamped.y;
  }, [container.width, container.height, baseWidth, baseHeight, minScale, maxScale]);

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .onStart(() => {
          savedScale.value = scale.value;
          savedTranslateX.value = translateX.value;
          savedTranslateY.value = translateY.value;
        })
        .onUpdate((e) => {
          // GestureDetector sabit dış kart üzerinde olduğu için e.focalX/Y kartın
          // kendi (taşınmayan) koordinat uzayındadır — büyütme parmakların altındaki
          // noktaya odaklanır, haritanın sabit bir köşesine değil.
          const next = clamp(savedScale.value * e.scale, minScale, maxScale);
          const ratio = next / savedScale.value;
          translateX.value = e.focalX - (e.focalX - savedTranslateX.value) * ratio;
          translateY.value = e.focalY - (e.focalY - savedTranslateY.value) * ratio;
          scale.value = next;
        })
        .onEnd(() => {
          const clamped = clampTranslate(scale.value, translateX.value, translateY.value);
          translateX.value = withTiming(clamped.x, { duration: 150 });
          translateY.value = withTiming(clamped.y, { duration: 150 });
        }),
    [minScale, maxScale, baseWidth, baseHeight, container.width, container.height]
  );

  // maxPointers(1): 2 parmakla pan da tetiklenirse pinch'in odak noktasına göre
  // hesapladığı translate'i aynı anda ezip haritayı hep başlangıç konumuna (Marmara)
  // geri çekiyordu. İki parmakla kaydırma zaten pinch'in odak takibiyle sağlanıyor.
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minPointers(1)
        .maxPointers(1)
        .onStart(() => {
          savedTranslateX.value = translateX.value;
          savedTranslateY.value = translateY.value;
        })
        .onUpdate((e) => {
          const clamped = clampTranslate(
            scale.value,
            savedTranslateX.value + e.translationX,
            savedTranslateY.value + e.translationY
          );
          translateX.value = clamped.x;
          translateY.value = clamped.y;
        }),
    [baseWidth, baseHeight, container.width, container.height]
  );

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Düğmeyle zoom, kartın o an ortasında görünen noktayı sabit tutarak yakınlaştırır/uzaklaştırır.
  function handleZoomButton(factor: number) {
    const next = clamp(scale.value * factor, minScale, maxScale);
    const cx = container.width / 2;
    const cy = container.height / 2;
    const contentX = (cx - translateX.value) / scale.value;
    const contentY = (cy - translateY.value) / scale.value;
    const rawTx = cx - contentX * next;
    const rawTy = cy - contentY * next;
    const clamped = clampTranslate(next, rawTx, rawTy);
    scale.value = withTiming(next, { duration: 200 });
    translateX.value = withTiming(clamped.x, { duration: 200 });
    translateY.value = withTiming(clamped.y, { duration: 200 });
  }

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={composedGesture}>
        <View style={styles.viewport} onLayout={onContainerLayout}>
          {container.width > 0 && (
            <Animated.View
              style={[
                { width: baseWidth, height: baseHeight, transformOrigin: '0 0' },
                animatedStyle,
              ]}
            >
              <TurkeyMap getProvinceColor={getProvinceColor} onSelectProvince={onSelectProvince} />
            </Animated.View>
          )}
        </View>
      </GestureDetector>

      <View style={styles.zoomControls}>
        <ZoomButton icon="add" onPress={() => handleZoomButton(1.6)} />
        <ZoomButton icon="remove" onPress={() => handleZoomButton(1 / 1.6)} />
      </View>
    </View>
  );
}

const ZOOM_BUTTON_DEPTH = 5;

function ZoomButton({
  icon,
  onPress,
}: {
  icon: 'add' | 'remove';
  onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const burst = useSharedValue(1);

  function handlePress() {
    burst.value = 0;
    burst.value = withTiming(1, { duration: 380 });
    onPress();
  }

  const burstStyle = useAnimatedStyle(() => ({
    opacity: 1 - burst.value,
    transform: [{ scale: 0.4 + burst.value * 1.5 }],
  }));

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={handlePress}
      style={styles.zoomButtonWrap}
    >
      <View
        style={[
          styles.zoomButtonFace,
          {
            marginBottom: pressed ? 0 : ZOOM_BUTTON_DEPTH,
            transform: [{ translateY: pressed ? ZOOM_BUTTON_DEPTH : 0 }],
          },
        ]}
      >
        <Ionicons name={icon} size={24} color={colors.text} />
      </View>
      <Animated.View pointerEvents="none" style={[styles.zoomBurst, burstStyle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  viewport: {
    flex: 1,
    overflow: 'hidden',
  },
  zoomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  zoomButtonWrap: {
    width: 48,
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: 24,
  },
  zoomButtonFace: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomBurst: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 34,
    backgroundColor: '#FFE566',
  },
});
