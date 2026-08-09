import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { raisedCardLight } from '../theme/shadows';

const UPCOMING_REWARDS = [
  { icon: 'flame' as const, title: 'Günlük Fetih Serisi', desc: 'Art arda gün fethet, bonus puan kazan' },
  { icon: 'ribbon' as const, title: 'İlk 5 İl Rozeti', desc: '5 farklı ili fethedince açılır' },
  { icon: 'diamond' as const, title: 'Bölge Ustası', desc: 'Bir ildeki tüm ilçeleri tek başına tut' },
];

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
    >
      <Text style={styles.title}>Ödüller</Text>
      <Text style={styles.subtitle}>Fetihlerinle rozetler ve bonuslar kazan</Text>

      {UPCOMING_REWARDS.map((reward) => (
        <View key={reward.title} style={[styles.card, raisedCardLight]}>
          <View style={styles.iconWrap}>
            <Ionicons name={reward.icon} size={22} color={colors.gold} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{reward.title}</Text>
            <Text style={styles.cardDesc}>{reward.desc}</Text>
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
    backgroundColor: '#FFF7E0',
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
