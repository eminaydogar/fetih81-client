import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DISTRICTS } from '../data/districts';
import { Player, PlayerId } from '../types';

export const LOCAL_PLAYER_ID = 'local-player';

// Kırmızı, "fethedilmemiş / rakip" rengi olarak ayrıldığı için oyuncu paletinde yok.
const PLAYER_COLOR_PALETTE = [
  '#2563EB', // mavi
  '#059669', // yeşil
  '#7C3AED', // mor
  '#D97706', // turuncu
  '#0891B2', // camgöbeği
  '#DB2777', // pembe
  '#CA8A04', // altın
  '#4F46E5', // indigo
];

function randomPlayerColor(): string {
  return PLAYER_COLOR_PALETTE[Math.floor(Math.random() * PLAYER_COLOR_PALETTE.length)];
}

// Harita hemen boş görünmesin diye eklenmiş örnek rakipler.
// Backend entegre edilince gerçek oyuncularla değişecek.
export const RIVAL_PLAYERS: Player[] = [
  { id: 'rival-ejder', name: 'Ejder Ordusu', color: '#B91C1C' },
  { id: 'rival-kartal', name: 'Kartal Birliği', color: '#1D4ED8' },
];

const SEED_CONQUESTS: Record<string, { ownerId: PlayerId; score: number }> = {
  'ist-fatih': { ownerId: 'rival-ejder', score: 14 },
  'ank-cankaya': { ownerId: 'rival-kartal', score: 16 },
  'izm-konak': { ownerId: 'rival-ejder', score: 12 },
};

interface ConquestEntry {
  ownerId: PlayerId;
  score: number;
}

interface GameState {
  localPlayer: Player;
  conquests: Record<string, ConquestEntry>;
  setLocalPlayerName: (name: string) => void;
  getOwner: (districtId: string) => (Player & { score: number }) | null;
  /** Bir bölge için sınav sonucunu değerlendirir. Skor mevcut sahibi geçerse toprak el değiştirir. */
  submitConquestAttempt: (
    districtId: string,
    score: number
  ) => { success: boolean; previousOwnerId: PlayerId | null; previousScore: number | null };
  getAllPlayers: () => Player[];
  getLeaderboard: () => { player: Player; districtCount: number; totalScore: number }[];
  /** Bir ilde en az bir ilçe kullanıcıya aitse oyuncu rengini, değilse null (kırmızı = fethedilmemiş) döner. */
  getProvinceColor: (provinceName: string) => string | null;
  getPlayerStats: () => { districtCount: number; provinceCount: number; totalScore: number };
}

function findPlayer(id: PlayerId, localPlayer: Player): Player | undefined {
  if (id === localPlayer.id) return localPlayer;
  return RIVAL_PLAYERS.find((p) => p.id === id);
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      localPlayer: { id: LOCAL_PLAYER_ID, name: 'Sen', color: randomPlayerColor() },
      conquests: SEED_CONQUESTS,

      setLocalPlayerName: (name) =>
        set((state) => ({ localPlayer: { ...state.localPlayer, name } })),

      getOwner: (districtId) => {
        const state = get();
        const entry = state.conquests[districtId];
        if (!entry) return null;
        const player = findPlayer(entry.ownerId, state.localPlayer);
        if (!player) return null;
        return { ...player, score: entry.score };
      },

      submitConquestAttempt: (districtId, score) => {
        const state = get();
        const existing = state.conquests[districtId];
        const previousOwnerId = existing?.ownerId ?? null;
        const previousScore = existing?.score ?? null;

        if (existing && score <= existing.score) {
          return { success: false, previousOwnerId, previousScore };
        }

        set((s) => ({
          conquests: {
            ...s.conquests,
            [districtId]: { ownerId: s.localPlayer.id, score },
          },
        }));
        return { success: true, previousOwnerId, previousScore };
      },

      getAllPlayers: () => [get().localPlayer, ...RIVAL_PLAYERS],

      getLeaderboard: () => {
        const state = get();
        const players = [state.localPlayer, ...RIVAL_PLAYERS];
        return players
          .map((player) => {
            const owned = Object.values(state.conquests).filter(
              (c) => c.ownerId === player.id
            );
            return {
              player,
              districtCount: owned.length,
              totalScore: owned.reduce((sum, c) => sum + c.score, 0),
            };
          })
          .sort((a, b) => b.districtCount - a.districtCount || b.totalScore - a.totalScore);
      },

      getProvinceColor: (provinceName) => {
        const state = get();
        const ownsInProvince = DISTRICTS.some(
          (d) =>
            d.city === provinceName &&
            state.conquests[d.id]?.ownerId === state.localPlayer.id
        );
        return ownsInProvince ? state.localPlayer.color : null;
      },

      getPlayerStats: () => {
        const state = get();
        const owned = Object.entries(state.conquests).filter(
          ([, c]) => c.ownerId === state.localPlayer.id
        );
        const provinces = new Set(
          owned
            .map(([districtId]) => DISTRICTS.find((d) => d.id === districtId)?.city)
            .filter((c): c is string => !!c)
        );
        return {
          districtCount: owned.length,
          provinceCount: provinces.size,
          totalScore: owned.reduce((sum, [, c]) => sum + c.score, 0),
        };
      },
    }),
    {
      name: 'fetih-game-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ localPlayer: state.localPlayer, conquests: state.conquests }),
    }
  )
);
