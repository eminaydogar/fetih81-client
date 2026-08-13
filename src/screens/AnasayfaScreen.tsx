import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMusic } from '../audio/MusicProvider';
import GameModeCard from '../components/GameModeCard';
import ProvinceCarousel from '../components/ProvinceCarousel';
import SkyBackdrop from '../components/SkyBackdrop';
import ZoomableTurkeyMap from '../components/ZoomableTurkeyMap';
import { DISTRICTS } from '../data/districts';
import { District } from '../types';
import { TabScreenProps } from '../navigation/types';
import { useGameStore } from '../store/gameStore';
import { colors } from '../theme/colors';

type ViewMode = 'map' | 'list';

const DAY_MS = 24 * 60 * 60 * 1000;

export default function AnasayfaScreen({ navigation }: TabScreenProps<'Anasayfa'>) {
  const insets = useSafeAreaInsets();
  const music = useMusic();
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const localPlayer = useGameStore((s) => s.localPlayer);
  const conquests = useGameStore((s) => s.conquests); // re-render tetikleyici

  const ownedCount = useMemo(
    () => Object.values(conquests).filter((c) => c.ownerId === localPlayer.id).length,
    [conquests, localPlayer.id]
  );

  function confirmAttack(target: District, message: string) {
    Alert.alert(message, `${target.name} (${target.city}) bölgesine saldır?`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Saldır',
        style: 'destructive',
        onPress: () => navigation.navigate('Quiz', { districtId: target.id }),
      },
    ]);
  }

  function pickRandom(pool: District[]) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function handleQuickBattle() {
    const state = useGameStore.getState();
    const attackable = DISTRICTS.filter(
      (d) => state.getOwner(d.id)?.id !== state.localPlayer.id
    );
    const pool = attackable.length > 0 ? attackable : DISTRICTS;
    confirmAttack(pickRandom(pool), 'Hızlı Savaş');
  }

  function handleTargetedAttack() {
    Alert.alert(
      'Hedefli Saldırı',
      'Yukarıdaki haritadan bir il seç, ardından listeden saldırmak istediğin ilçeye dokun.'
    );
  }

  // Komşu Fetih: şimdilik "komşuluk" = sahip olunan ilçenin ilindeki diğer ilçeler.
  // Gerçek sınır komşuluğu backend'den gelince burası değişecek.
  function handleNeighborConquest() {
    const state = useGameStore.getState();
    const ownedCities = new Set(
      Object.entries(state.conquests)
        .filter(([, c]) => c.ownerId === state.localPlayer.id)
        .map(([id]) => DISTRICTS.find((d) => d.id === id)?.city)
        .filter((city): city is string => !!city)
    );

    if (ownedCities.size === 0) {
      Alert.alert('Komşu Fetih', 'Önce Hızlı Savaş ile ilk bölgeni fethetmelisin.');
      return;
    }

    const pool = DISTRICTS.filter(
      (d) =>
        ownedCities.has(d.city) &&
        state.conquests[d.id]?.ownerId !== state.localPlayer.id
    );

    if (pool.length === 0) {
      Alert.alert('Komşu Fetih', 'Komşu bölgelerin tamamı zaten senin!');
      return;
    }

    confirmAttack(pickRandom(pool), 'Komşu Fetih');
  }

  function handleDailySiege() {
    // Gün numarasına göre sabit hedef: aynı gün içinde herkese aynı ilçe düşer.
    const dayIndex = Math.floor(Date.now() / DAY_MS);
    confirmAttack(DISTRICTS[dayIndex % DISTRICTS.length], 'Günlük Kuşatma');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Tüm ekranın arkasındaki gökyüzü — harita kartı da saydam olduğu için üstünde uçar. */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <SkyBackdrop />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.musicButton} onPress={music.toggle}>
            <Ionicons
              name={music.isPlaying ? 'volume-high' : 'volume-mute'}
              size={18}
              color={music.isPlaying ? colors.primaryDark : colors.textMuted}
            />
          </Pressable>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.statChip}>
            <MaterialCommunityIcons name="flag-variant" size={13} color={colors.gold} />
            <Text style={styles.statText}>{ownedCount} ilçe</Text>
          </View>
          <Pressable
            style={styles.trophyButton}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <Ionicons name="trophy" size={19} color={colors.gold} />
          </Pressable>
        </View>
      </View>

      {/* Ekranın üst yarısı: harita */}
      <View style={styles.mapArea}>
        {viewMode === 'map' ? (
          <ZoomableTurkeyMap
            onSelectProvince={(provinceName) =>
              navigation.navigate('DistrictList', { provinceName })
            }
          />
        ) : (
          <ProvinceCarousel
            onSelectProvince={(provinceName) =>
              navigation.navigate('DistrictList', { provinceName })
            }
          />
        )}

        <View style={styles.viewModeToggle}>
          <Pressable
            onPress={() => setViewMode('map')}
            style={[styles.viewModeButton, viewMode === 'map' && styles.viewModeButtonActive]}
          >
            <Ionicons
              name="map"
              size={16}
              color={viewMode === 'map' ? colors.surfaceDark : colors.textInverse}
            />
          </Pressable>
          <Pressable
            onPress={() => setViewMode('list')}
            style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
          >
            <Ionicons
              name="list"
              size={16}
              color={viewMode === 'list' ? colors.surfaceDark : colors.textInverse}
            />
          </Pressable>
        </View>
      </View>

      {/* Ekranın alt yarısı: 2x2 savaş modu kartları */}
      <View style={styles.cardArea}>
        <View style={styles.cardRow}>
          <GameModeCard
            title="Hızlı Savaş"
            subtitle="Sistem rastgele bir ilçe seçer. Hemen fethet."
            tag="RASTGELE"
            icon="sword-cross"
            gradient={['#FF7E6B', '#E11D48']}
            onPress={handleQuickBattle}
          />
          <GameModeCard
            title="Hedefli Saldırı"
            subtitle="Haritadan istediğin ilçeyi seç ve doğrudan saldır."
            tag="SEÇİMLİ"
            icon="target"
            gradient={['#5CC6FF', '#2563EB']}
            onPress={handleTargetedAttack}
          />
        </View>

        <View style={styles.cardRow}>
          <GameModeCard
            title="Komşu Fetih"
            subtitle="Sadece sahip olduğun bölgelere komşu ilçelere saldır."
            tag="STRATEJİ"
            icon="fire"
            gradient={['#5FE0B0', '#0D9488']}
            onPress={handleNeighborConquest}
          />
          <GameModeCard
            title="Günlük Kuşatma"
            subtitle="Her gün özel bir ilçe. Fethedene ekstra altın."
            tag="ÖDÜLLÜ"
            icon="trophy-variant"
            gradient={['#FFD35C', '#E08A00']}
            onPress={handleDailySiege}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sky,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  musicButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  statText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  trophyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  mapArea: {
    // Harita alanı, alttaki savaş modu kartlarından belirgin biçimde daha yüksek.
    flex: 1.35,
    // Arkadaki gökyüzü katmanı görünsün diye kartın kendi zemini yok.
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginHorizontal: 10,
  },
  viewModeToggle: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(43,29,74,0.35)',
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
  cardArea: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 10,
  },
  cardRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
});
