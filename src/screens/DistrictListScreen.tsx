import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import { DISTRICTS } from '../data/districts';
import { useGameStore } from '../store/gameStore';
import { colors } from '../theme/colors';
import { raisedCardLight } from '../theme/shadows';
import { RootStackScreenProps } from '../navigation/types';

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
            return (
              <Pressable
                style={[
                  styles.card,
                  raisedCardLight,
                  { borderLeftColor: owner ? owner.color : colors.unconquered },
                ]}
                onPress={() => navigation.navigate('DistrictDetail', { districtId: item.id })}
              >
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSubtitle}>
                    {owner
                      ? `${isLocalOwner ? 'Senin toprağın' : owner.name} · Skor: ${owner.score}`
                      : 'Fethedilmemiş bölge'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: owner ? owner.color : colors.unconquered },
                  ]}
                />
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
