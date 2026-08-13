import Svg, { G, Path } from 'react-native-svg';
import { getRegionColor } from '../data/regions';
import { PROVINCE_PATHS, TURKEY_MAP_VIEWBOX } from '../data/turkeyProvincePaths';
import { colors } from '../theme/colors';
import { shadeColor } from '../utils/color';

// Haritaya kalınlık hissi veren yan yüz katmanları: aynı iller birer birim aşağı
// kaydırılıp koyu tonla çizilir, en üste asıl renkli katman gelir.
const EXTRUSION_LAYERS = 7;
const EXTRUSION_STEP = 2;
const EXTRUSION_DEPTH = EXTRUSION_LAYERS * EXTRUSION_STEP;

// Yan yüz, üstten alta doğru koyulaşır — ışık yukarıdan geliyormuş hissi verir.
const SIDE_SHADE_TOP = -16;
const SIDE_SHADE_BOTTOM = -58;

// Aynı bölgedeki komşu iller birbirinden ayrılsın diye plakaya göre hafif ton farkı.
const TONE_VARIANTS = [7, 0, -7];

const RENDERED_PROVINCES = PROVINCE_PATHS.map((province) => {
  const regionColor = getRegionColor(province.name) ?? colors.mapUnconquered;
  const top = shadeColor(regionColor, TONE_VARIANTS[Number(province.plate) % 3]);
  // i = 0 en alttaki (en koyu) katman.
  const sides = Array.from({ length: EXTRUSION_LAYERS }, (_, i) => {
    const t = i / (EXTRUSION_LAYERS - 1);
    return shadeColor(top, SIDE_SHADE_BOTTOM + (SIDE_SHADE_TOP - SIDE_SHADE_BOTTOM) * t);
  });
  return { ...province, top, sides };
});

interface Props {
  onSelectProvince: (provinceName: string, plate: string) => void;
}

export default function TurkeyMap({ onSelectProvince }: Props) {
  return (
    <Svg width="100%" height="100%" viewBox={TURKEY_MAP_VIEWBOX}>
      {/* Zemine düşen gölge: haritayı yüzeyden koparıp havada durur gibi gösterir. */}
      <G transform={`translate(1.5, ${EXTRUSION_DEPTH + 4})`} opacity={0.16}>
        {RENDERED_PROVINCES.map((province) => (
          <Path key={province.plate} d={province.path} fill="#000000" />
        ))}
      </G>

      {/* Yan yüzler: en alttaki (en koyu) katmandan üste doğru çizilir. */}
      {Array.from({ length: EXTRUSION_LAYERS }, (_, i) => (
        <G key={`side-${i}`} transform={`translate(0, ${(EXTRUSION_LAYERS - i) * EXTRUSION_STEP})`}>
          {RENDERED_PROVINCES.map((province) => (
            <Path key={province.plate} d={province.path} fill={province.sides[i]} />
          ))}
        </G>
      ))}

      {/* Üst yüz: bölge rengi + il sınırı. */}
      {RENDERED_PROVINCES.map((province) => (
        <Path
          key={province.plate}
          d={province.path}
          fill={province.top}
          stroke={colors.mapStroke}
          strokeWidth={0.9}
          strokeOpacity={0.55}
          onPress={() => onSelectProvince(province.name, province.plate)}
        />
      ))}
    </Svg>
  );
}
