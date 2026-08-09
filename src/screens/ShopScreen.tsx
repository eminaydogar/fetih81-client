import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { raisedCardLight } from '../theme/shadows';

const UPCOMING_ITEMS = [
  { icon: 'color-palette' as const, title: 'Özel Renkler', desc: 'Bölgen için özel renk tonları aç' },
  { icon: 'shield' as const, title: 'Savunma Kalkanı', desc: 'Toprağını bir sonraki saldırıya karşı koru' },
  { icon: 'flash' as const, title: 'İpucu Hakkı', desc: 'Zor sorularda bir şıkkı eleyebil' },
];

export default function ShopScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
    >
      <Text style={styles.title}>Mağaza</Text>
      <Text style={styles.subtitle}>Yakında burada özel eşyalar olacak</Text>

      {UPCOMING_ITEMS.map((item) => (
        <View key={item.title} style={[styles.card, raisedCardLight]}>
          <View style={styles.iconWrap}>
            <Ionicons name={item.icon} size={22} color={colors.primary} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </View>
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>Yakında</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  soonBadge: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  soonText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
});
