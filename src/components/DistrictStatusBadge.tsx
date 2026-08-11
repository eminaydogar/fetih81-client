import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { getSoldierIconForId } from '../data/soldierIcons';
import { colors } from '../theme/colors';
import { Player } from '../types';

interface Props {
  owner: (Player & { score: number }) | null;
  isLocalOwner: boolean;
}

export default function DistrictStatusBadge({ owner, isLocalOwner }: Props) {
  if (isLocalOwner) {
    return (
      <View style={styles.stamp}>
        <View style={styles.stampRing}>
          <Ionicons name="ribbon" size={20} color={colors.gold} />
        </View>
        <Text style={styles.stampLabel}>SENİN</Text>
      </View>
    );
  }

  if (owner) {
    const SoldierIcon = getSoldierIconForId(owner.id);
    return (
      <View style={styles.badge}>
        <View style={[styles.soldierRing, { borderColor: owner.color }]}>
          <SoldierIcon width={30} height={30} />
        </View>
        <Text style={styles.ownerName} numberOfLines={1}>
          {owner.name}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.badge}>
      <View style={styles.emptyStamp}>
        <Ionicons name="help" size={16} color="rgba(255,255,255,0.7)" />
      </View>
      <Text style={styles.emptyLabel}>Boşta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    width: 56,
  },
  soldierRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  ownerName: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textInverse,
    maxWidth: 56,
  },
  emptyStamp: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  stamp: {
    alignItems: 'center',
    width: 56,
    transform: [{ rotate: '-10deg' }],
  },
  stampRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  stampLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.5,
  },
});
