import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
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

// Kamera açısı: 0° tam tepeden kuşbakışı, 55° neredeyse yan profilden bakış.
const TILT_MIN = 0;
const TILT_MAX = 55;
const TILT_STEP = 11;
// Varsayılan, en yatık bakışın bir kademe üstü.
const TILT_DEFAULT = 44;

// En uzak zoomun nerede duracağı: 0 = Türkiye tam sığar (kenarlarda çok boşluk),
// 1 = harita kartı tamamen kaplar (doğu/batı uçları taşar). 0.5 = ikisinin ortası.
const MIN_ZOOM_COVER_RATIO = 0.5;

// Kenara dayanınca hareketi tamamen kesmek yerine direnç uygular — lastik hissi.
const RUBBER_BAND_RESISTANCE = 0.3;

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

function rubberBand(value: number, min: number, max: number) {
  'worklet';
  if (value < min) return min + (value - min) * RUBBER_BAND_RESISTANCE;
  if (value > max) return max + (value - max) * RUBBER_BAND_RESISTANCE;
  return value;
}

// SVG'yi büyütmek için sadece view transform'u kullanmak, katmanı rasterleştirdiği
// için yakınlaşınca kenarları bulanıklaştırıyordu. Bunun yerine SVG'nin kendi
// piksel boyutunu kademeli olarak büyütüp transform'u buna göre bölüyoruz:
// görüntü aynı yerde kalır ama harita o çözünürlükte yeniden çizildiği için net olur.
const RENDER_SCALE_STEPS = [1, 1.5, 2, 3, 4];

function quantizeRenderScale(value: number) {
  'worklet';
  let picked = RENDER_SCALE_STEPS[0];
  for (let i = 0; i < RENDER_SCALE_STEPS.length; i++) {
    if (RENDER_SCALE_STEPS[i] <= value) picked = RENDER_SCALE_STEPS[i];
  }
  return picked;
}

interface Props {
  onSelectProvince: (provinceName: string, plate: string) => void;
}

export default function ZoomableTurkeyMap({ onSelectProvince }: Props) {
  const [container, setContainer] = useState({ width: 0, height: 0 });
  const [renderScale, setRenderScale] = useState(1);
  const hasInitialized = useRef(false);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const tilt = useSharedValue(TILT_DEFAULT);

  function onContainerLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setContainer({ width, height });
  }

  const { baseWidth, baseHeight, minScale, maxScale } = useMemo(() => {
    const w = container.width || 1;
    const h = container.height || 1;
    const bw = w;
    const bh = w / MAP_ASPECT_RATIO;
    // Tam sığdırma: Türkiye'nin tamamı kartın içinde görünür ama üstte/altta çok boşluk kalır.
    const contain = Math.min(1, h / bh);
    // Kartı tamamen kaplayan ölçek; en yakın zoom bunun katı olarak sınırlanır.
    const cover = Math.max(1, h / bh);
    return {
      baseWidth: bw,
      baseHeight: bh,
      // En uzak zoom, sığdırma ile kaplama arasının yarısı: harita ekranda büyük durur.
      minScale: contain + (cover - contain) * MIN_ZOOM_COVER_RATIO,
      maxScale: cover * 3,
    };
  }, [container.width, container.height]);

  // Bir eksende içerik kart alanından küçükse ortalar, büyükse kenarlar arasında sınırlar.
  function panBounds(nextScale: number) {
    'worklet';
    const scaledWidth = baseWidth * nextScale;
    const scaledHeight = baseHeight * nextScale;
    const centeredX = (container.width - scaledWidth) / 2;
    const centeredY = (container.height - scaledHeight) / 2;
    const fitsX = scaledWidth <= container.width;
    const fitsY = scaledHeight <= container.height;

    return {
      minX: fitsX ? centeredX : container.width - scaledWidth,
      maxX: fitsX ? centeredX : 0,
      minY: fitsY ? centeredY : container.height - scaledHeight,
      maxY: fitsY ? centeredY : 0,
    };
  }

  function clampTranslate(nextScale: number, tx: number, ty: number) {
    'worklet';
    const b = panBounds(nextScale);
    return { x: clamp(tx, b.minX, b.maxX), y: clamp(ty, b.minY, b.maxY) };
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
    setRenderScale(quantizeRenderScale(initialScale));
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
          // Parmak kalkınca haritayı yeni zoom seviyesinin çözünürlüğünde yeniden çiz.
          runOnJS(setRenderScale)(quantizeRenderScale(scale.value));
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
          // Sınırda sert durmak yerine esneyerek gider; bırakınca yerine oturur.
          const b = panBounds(scale.value);
          translateX.value = rubberBand(savedTranslateX.value + e.translationX, b.minX, b.maxX);
          translateY.value = rubberBand(savedTranslateY.value + e.translationY, b.minY, b.maxY);
        })
        .onEnd((e) => {
          // Parmak kalkınca hareket sürtünmeyle sönerek devam eder (momentum).
          const b = panBounds(scale.value);
          if (translateX.value < b.minX || translateX.value > b.maxX) {
            translateX.value = withTiming(clamp(translateX.value, b.minX, b.maxX), {
              duration: 200,
            });
          } else {
            translateX.value = withDecay({
              velocity: e.velocityX,
              deceleration: 0.994,
              clamp: [b.minX, b.maxX],
            });
          }

          if (translateY.value < b.minY || translateY.value > b.maxY) {
            translateY.value = withTiming(clamp(translateY.value, b.minY, b.maxY), {
              duration: 200,
            });
          } else {
            translateY.value = withDecay({
              velocity: e.velocityY,
              deceleration: 0.994,
              clamp: [b.minY, b.maxY],
            });
          }
        }),
    [baseWidth, baseHeight, container.width, container.height]
  );

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // Toplam büyütme = renderScale (SVG'nin gerçek boyutu) × buradaki scale — yani
  // görsel sonuç her zaman scale.value'ya eşit kalır.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value / renderScale },
    ],
  }));

  // Perspektif eğimi: 0°'de harita tepeden, açı büyüdükçe daha yatık görünür.
  const tiltStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateX: `${tilt.value}deg` }],
  }));

  function handleTilt(delta: number) {
    tilt.value = withTiming(clamp(tilt.value + delta, TILT_MIN, TILT_MAX), { duration: 220 });
  }

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={composedGesture}>
        <View style={styles.viewport} onLayout={onContainerLayout}>
          <Animated.View style={[styles.tiltLayer, tiltStyle]}>
            {container.width > 0 && (
              <Animated.View
                style={[
                  {
                    width: baseWidth * renderScale,
                    height: baseHeight * renderScale,
                    transformOrigin: '0 0',
                  },
                  animatedStyle,
                ]}
              >
                <TurkeyMap onSelectProvince={onSelectProvince} />
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </GestureDetector>

      <View style={styles.tiltControls}>
        <TiltButton icon="chevron-up" onPress={() => handleTilt(-TILT_STEP)} />
        <TiltButton icon="chevron-down" onPress={() => handleTilt(TILT_STEP)} />
      </View>
    </View>
  );
}

const TILT_BUTTON_DEPTH = 3;
const TILT_BUTTON_SIZE = 30;

/** Bakış açısını kademe kademe değiştiren buton: yukarı = tepeden, aşağı = yatık. */
function TiltButton({
  icon,
  onPress,
}: {
  icon: 'chevron-up' | 'chevron-down';
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
      style={styles.tiltButtonWrap}
    >
      <View
        style={[
          styles.tiltButtonFace,
          {
            marginBottom: pressed ? 0 : TILT_BUTTON_DEPTH,
            transform: [{ translateY: pressed ? TILT_BUTTON_DEPTH : 0 }],
          },
        ]}
      >
        <Ionicons name={icon} size={15} color={colors.surfaceDark} />
      </View>
      <Animated.View pointerEvents="none" style={[styles.tiltBurst, burstStyle]} />
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
  tiltLayer: {
    flex: 1,
  },
  // Zeminsiz, haritanın üstünde yüzen kontrol şeridi — arkadaki gökyüzü kesintisiz görünür.
  tiltControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  tiltButtonWrap: {
    width: TILT_BUTTON_SIZE,
    alignItems: 'center',
    backgroundColor: 'rgba(126,74,163,0.45)',
    borderRadius: TILT_BUTTON_SIZE / 2,
  },
  tiltButtonFace: {
    width: TILT_BUTTON_SIZE,
    height: TILT_BUTTON_SIZE,
    borderRadius: TILT_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(217,153,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tiltBurst: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 26,
    backgroundColor: '#FFE566',
  },
});
