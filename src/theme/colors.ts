import { shadeColor } from '../utils/color';

const PRIMARY = '#D999FF';
// Fethedilmemiş bölgeler için açık sarı-pembeye yakın toprak tonu.
const MAP_UNCONQUERED = '#F0C6A0';

export const colors = {
  // Koyu tema (Anasayfa haritası, tab bar) — mor marka rengiyle uyumlu koyu zemin.
  background: '#2A1F45',
  surfaceDark: '#2B1D4A',
  // Gökyüzü zemini: harita bulutların üstünde uçuyormuş gibi görünsün diye
  // yukarıdan aşağıya açılan mavi tonu (skyTop = tepe, sky = ufuk).
  skyTop: '#9FD9F5',
  sky: '#4FB3E0',
  mapStroke: '#1A1030',
  // Açık tema (diğer tüm ekranlar) — mor markanın soluk tonu.
  backgroundLight: '#F5EBFF',
  surface: '#FFFFFF',
  border: '#E9DFFA',
  text: '#1F2937',
  textInverse: '#F8FAFC',
  textMuted: '#6B7280',
  textMutedInverse: '#B9A6D9',
  primary: PRIMARY,
  primaryDark: shadeColor(PRIMARY, -30),
  gold: '#D4AF37',
  goldDark: '#9A7B1F',
  unconquered: '#D1D5DB',
  success: '#059669',
  danger: '#DC2626',
  // Fetih durumu rengi: haritada "fethedilmemiş/rakip" bölgeler toprak/kum
  // tonuyla gösterilir — beyaz harita zeminiyle uyumlu, marka morundan bağımsız.
  mapUnconquered: MAP_UNCONQUERED,
};
