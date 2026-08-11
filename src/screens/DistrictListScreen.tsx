import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import DistrictStatusBadge from '../components/DistrictStatusBadge';
import { DISTRICTS } from '../data/districts';
import { useGameStore } from '../store/gameStore';
import { colors } from '../theme/colors';
import { RootStackScreenProps } from '../navigation/types';
import { Player } from '../types';
import { shadeColor } from '../utils/color';

function cardGradient(
  owner: (Player & { score: number }) | null,
  isLocalOwner: boolean
): [string, string] {
  if (!owner) return ['#FFFFFF', '#ECE1FA'];
  if (isLocalOwner) return [shadeColor(owner.color, 35), shadeColor(owner.color, -15)];
  return [shadeColor(owner.color, 15), shadeColor(owner.color, -30)];
}

export default function DistrictListScreen({ route, navigation }: RootStackScreenProps<'DistrictList'>) {
  const { provinceName } = route.params;
  const getOwner = useGameStore((s) => s.getOwner);
  const conquests = useGameStore((s) => s.conquests); // re-render tetikleyici
  const districts = DISTRICTS.filter((d) => d.city === provinceName);

  return (
    <View style={styles.container}>
      {districts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{provinceName}</Text>
          <Text style={styles.emptyText}>
            Bu il için henüz ilçe verisi eklenmedi. Yakında tüm Türkiye ilçeleriyle
            genişletilecek.
          </Text>
        </View>
      ) : (
        <FlatList
          data={districts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={<Text style={styles.header}>{provinceName} İlçeleri</Text>}
          renderItem={({ item }) => {
            const owner = getOwner(item.id);
            const isLocalOwner = owner?.id === 'local-player';
            const textColor = owner ? colors.textInverse : colors.text;
            const subtitleColor = owner ? 'rgba(255,255,255,0.85)' : colors.textMuted;
            const glowColor = isLocalOwner ? colors.gold : owner ? owner.color : 'transparent';
            return (
              <Pressable
                style={({ pressed }) => [styles.cardWrap, pressed && styles.cardWrapPressed]}
                onPress={() => navigation.navigate('DistrictDetail', { districtId: item.id })}
              >
                <LinearGradient
                  colors={cardGradient(owner, isLocalOwner)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.card,
                    { shadowColor: glowColor },
                    isLocalOwner && styles.cardLocalBorder,
                  ]}
                >
                  <View style={styles.cardText}>
                    <Text style={[styles.cardTitle, { color: textColor }]}>{item.name}</Text>
                    <Text style={[styles.cardSubtitle, { color: subtitleColor }]}>
                      {owner
                        ? `${isLocalOwner ? 'Senin toprağın' : owner.name} · Skor: ${owner.score}`
                        : 'Fethedilmemiş bölge'}
                    </Text>
                  </View>
                  <DistrictStatusBadge owner={owner} isLocalOwner={isLocalOwner} />
                </LinearGradient>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  cardWrap: {
    marginBottom: 14,
    borderRadius: 18,
  },
  cardWrapPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  cardLocalBorder: {
    borderWidth: 2,
    borderColor: colors.gold,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
