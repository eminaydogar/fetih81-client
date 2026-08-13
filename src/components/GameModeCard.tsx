import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ComponentProps, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { shadeColor } from '../utils/color';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface Props {
  title: string;
  subtitle: string;
  /** İkonun sağındaki küçük etiket (ör. "RASTGELE"). */
  tag: string;
  icon: IconName;
  /** [üst açık ton, alt koyu ton] — kart yüzeyinin gradienti. */
  gradient: readonly [string, string];
  onPress: () => void;
}

// Kartın altındaki "kalınlık" katmanının yüksekliği: basınca bu kadar aşağı iner.
const DEPTH = 6;
const RADIUS = 22;

export default function GameModeCard({
  title,
  subtitle,
  tag,
  icon,
  gradient,
  onPress,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const [top, bottom] = gradient;
  const base = shadeColor(bottom, -22);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={[styles.wrapper, { backgroundColor: base, shadowColor: base }]}
    >
      <LinearGradient
        colors={[shadeColor(top, 8), top, bottom]}
        locations={[0, 0.42, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={[
          styles.face,
          {
            marginBottom: pressed ? 0 : DEPTH,
            transform: [{ translateY: pressed ? DEPTH : 0 }],
          },
        ]}
      >
        {/* Köşeye taşan dev ikon: kartı oyun kartı gibi dokulu gösterir. */}
        <MaterialCommunityIcons
          name={icon}
          size={112}
          color="rgba(255,255,255,0.14)"
          style={styles.ghostIcon}
        />

        {/* Üstten gelen cam parlaması — yüzeye kabartma hissi verir. */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.38)', 'rgba(255,255,255,0)']}
          style={styles.gloss}
        />

        {/* Rozet ve damga yan yana: damga alta inince kısa kartlarda sığmıyordu. */}
        <View style={styles.headRow}>
          <View style={styles.iconBadge}>
            <MaterialCommunityIcons name={icon} size={21} color="#FFFFFF" />
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText} numberOfLines={1}>
              {tag}
            </Text>
          </View>
        </View>

        {/* Esneyen blok: kart kısaldığında artan/eksilen boşluğu bu emer. */}
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: RADIUS,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  face: {
    flex: 1,
    borderRadius: RADIUS,
    paddingHorizontal: 13,
    paddingTop: 10,
    paddingBottom: 9,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
  },
  ghostIcon: {
    position: 'absolute',
    right: -26,
    bottom: -24,
    transform: [{ rotate: '-12deg' }],
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    overflow: 'hidden',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    marginTop: 3,
  },
  tag: {
    flexShrink: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
