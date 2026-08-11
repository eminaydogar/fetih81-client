import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button3D from '../components/Button3D';
import ProvinceCarousel from '../components/ProvinceCarousel';
import ZoomableTurkeyMap from '../components/ZoomableTurkeyMap';
import { DISTRICTS } from '../data/districts';
import KilicCarpi from '../images/main/kilic_carpi.svg';
import { TabScreenProps } from '../navigation/types';
import { useGameStore } from '../store/gameStore';
import { colors } from '../theme/colors';
import { shadeColor } from '../utils/color';

type ViewMode = 'map' | 'list';

export default function AnasayfaScreen({ navigation }: TabScreenProps<'Anasayfa'>) {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const localPlayer = useGameStore((s) => s.localPlayer);
  const getProvinceColor = useGameStore((s) => s.getProvinceColor);
  const conquests = useGameStore((s) => s.conquests); // re-render tetikleyici

  function handleQuickBattle() {
    const state = useGameStore.getState();
    const attackable = DISTRICTS.filter(
      (d) => state.getOwner(d.id)?.id !== state.localPlayer.id
    );
    const pool = attackable.length > 0 ? attackable : DISTRICTS;
    const target = pool[Math.floor(Math.random() * pool.length)];

    Alert.alert(
      'Saldırı Hazırlığı',
      `${target.name} (${target.city}) bölgesine saldırmak istiyor musun?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Saldır',
          style: 'destructive',
          onPress: () => navigation.navigate('Quiz', { districtId: target.id }),
        },
      ]
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar style="dark" />

      <View style={styles.topBar}>
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

        <View style={styles.sloganWrap}>
          <View style={styles.sloganFace}>
            <View style={styles.sloganIconRing}>
              <Ionicons name="star" size={20} color={colors.primaryDark} />
            </View>
            <Text style={styles.sloganText}>
              Haritayı yakınlaştır ve şehirleri bilginle fethet
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.mapCardWrap}>
        <LinearGradient
          colors={[colors.mapSea, colors.mapSeaDark]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.mapCardFace}
        >
          {viewMode === 'map' ? (
            <ZoomableTurkeyMap
              getProvinceColor={getProvinceColor}
              onSelectProvince={(provinceName) =>
                navigation.navigate('DistrictList', { provinceName })
              }
            />
          ) : (
            <ProvinceCarousel
              getProvinceColor={getProvinceColor}
              onSelectProvince={(provinceName) =>
                navigation.navigate('DistrictList', { provinceName })
              }
            />
          )}

          <View style={styles.viewModeToggle}>
            <Pressable
              onPress={() => setViewMode('map')}
              style={[
                styles.viewModeButton,
                viewMode === 'map' && styles.viewModeButtonActive,
              ]}
            >
              <Ionicons
                name="map"
                size={16}
                color={viewMode === 'map' ? colors.text : colors.textInverse}
              />
            </Pressable>
            <Pressable
              onPress={() => setViewMode('list')}
              style={[
                styles.viewModeButton,
                viewMode === 'list' && styles.viewModeButtonActive,
              ]}
            >
              <Ionicons
                name="list"
                size={16}
                color={viewMode === 'list' ? colors.text : colors.textInverse}
              />
            </Pressable>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.bottomBar}>
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

        <Button3D color={colors.primary} depth={6} onPress={handleQuickBattle}>
          <KilicCarpi width={36} height={36} />
          <Text style={styles.battleButtonText}>HIZLI SAVAŞ</Text>
        </Button3D>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  topBar: {
    paddingHorizontal: 16,
  },
  sloganWrap: {
    backgroundColor: colors.primaryDark,
    borderRadius: 18,
    marginTop: 12,
  },
  sloganFace: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 12,
  },
  sloganIconRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sloganText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
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
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  trophyButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  mapCardWrap: {
    flex: 1,
    marginTop: 14,
    marginHorizontal: 16,
    marginBottom: 4,
    borderRadius: 26,
    backgroundColor: shadeColor(colors.mapSeaDark, -22),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  mapCardFace: {
    flex: 1,
    borderRadius: 26,
    marginBottom: 7,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  viewModeToggle: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 999,
    padding: 3,
    gap: 2,
  },
  viewModeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: colors.primary,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
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
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  battleButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
