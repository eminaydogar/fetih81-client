import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type TabParamList = {
  Anasayfa: undefined;
  Odüller: undefined;
  Shop: undefined;
  Profil: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  DistrictList: { provinceName: string };
  DistrictDetail: { districtId: string };
  Quiz: { districtId: string };
  Result: {
    districtId: string;
    score: number;
    total: number;
    success: boolean;
    previousOwnerName: string | null;
    previousScore: number | null;
  };
  Leaderboard: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
