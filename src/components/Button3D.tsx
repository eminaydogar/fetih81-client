import { ReactNode, useState } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { shadeColor } from '../utils/color';

interface Props {
  onPress?: () => void;
  color: string;
  depth?: number;
  radius?: number;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  children: ReactNode;
}

export default function Button3D({
  onPress,
  color,
  depth = 5,
  radius = 16,
  disabled = false,
  fullWidth = true,
  style,
  children,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const base = shadeColor(color, -35);

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={[
        styles.wrapper,
        fullWidth && styles.fullWidth,
        { backgroundColor: base, borderRadius: radius, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <View
        style={[
          styles.face,
          {
            backgroundColor: color,
            borderRadius: radius,
            marginBottom: pressed ? 0 : depth,
            transform: [{ translateY: pressed ? depth : 0 }],
          },
        ]}
      >
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  face: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
});
