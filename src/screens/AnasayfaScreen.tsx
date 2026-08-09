import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ZoomableTurkeyMap from '../components/ZoomableTurkeyMap';
import { TabScreenProps } from '../navigation/types';
import { useGameStore } from '../store/gameStore';
import { colors } from '../theme/colors';
import { raisedCardDark } from '../theme/shadows';

export default function AnasayfaScreen({ navigation }: TabScreenProps<'Anasayfa'>) {
  const insets = useSafeAreaInsets();
  const localPlayer = useGameStore((s) => s.localPlayer);
  const getProvinceColor = useGameStore((s) => s.getProvinceColor);
  const getPlayerStats = useGameStore((s) => s.getPlayerStats);
  const conquests = useGameStore((s) => s.conquests); // re-render tetikleyici
  const stats = getPlayerStats();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.playerBadge}>
          <View style={[styles.playerDot, { backgroundColor: localPlayer.color }]} />
          <Text style={styles.playerName}>{localPlayer.name}</Text>
        </View>
        <Pressable
          style={styles.trophyButton}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <Ionicons name="trophy" size={20} color={colors.gold} />
        </Pressable>
      </View>

      <Text style={styles.title}>Türkiye'yi Fethet</Text>
      <Text style={styles.subtitle}>
        Yakınlaştır, gezin, bir ile dokun ve bilgiyle fethet
      </Text>

      <LinearGradient
        colors={[colors.mapSea, colors.mapSeaDark]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.mapCard, raisedCardDark]}
      >
        <ZoomableTurkeyMap
          getProvinceColor={getProvinceColor}
          onSelectProvince={(provinceName) =>
            navigation.navigate('DistrictList', { provinceName })
          }
        />
      </LinearGradient>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: localPlayer.color }]} />
          <Text style={styles.legendText}>Senin bölgen</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.mapUnconquered }]} />
          <Text style={styles.legendText}>Fethedilmemiş</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatTile label="İlçe" value={stats.districtCount} />
        <StatTile label="İl" value={stats.provinceCount} />
        <StatTile label="Toplam Skor" value={stats.totalScore} />
      </View>
    </View>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <LinearGradient colors={[colors.surfaceDark, colors.background]} style={[styles.statTile, raisedCardDark]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  playerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  playerName: {
    color: colors.textInverse,
    fontSize: 13,
    fontWeight: '700',
  },
  trophyButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    color: colors.textInverse,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 16,
  },
  subtitle: {
    color: colors.textMutedInverse,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 14,
  },
  mapCard: {
    width: '100%',
    height: 360,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
    overflow: 'hidden',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: colors.textMutedInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    marginBottom: 12,
  },
  statTile: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: {
    color: colors.textInverse,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textMutedInverse,
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
});
