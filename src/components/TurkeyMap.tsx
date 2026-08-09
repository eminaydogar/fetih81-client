import Svg, { Path } from 'react-native-svg';
import { PROVINCE_PATHS, TURKEY_MAP_VIEWBOX } from '../data/turkeyProvincePaths';
import { colors } from '../theme/colors';

interface Props {
  getProvinceColor: (provinceName: string) => string | null;
  onSelectProvince: (provinceName: string, plate: string) => void;
}

export default function TurkeyMap({ getProvinceColor, onSelectProvince }: Props) {
  return (
    <Svg width="100%" height="100%" viewBox={TURKEY_MAP_VIEWBOX}>
      {PROVINCE_PATHS.map((province) => {
        const ownedColor = getProvinceColor(province.name);
        return (
          <Path
            key={province.plate}
            d={province.path}
            fill={ownedColor ?? colors.mapUnconquered}
            stroke={colors.mapStroke}
            strokeWidth={1.1}
            onPress={() => onSelectProvince(province.name, province.plate)}
          />
        );
      })}
    </Svg>
  );
}
