import { shadeColor } from '../utils/color';

const PRIMARY = '#D999FF';

export const colors = {
  // Koyu tema (Anasayfa haritası, tab bar) — mor marka rengiyle uyumlu koyu zemin.
  background: '#1A1030',
  surfaceDark: '#2B1D4A',
  mapSea: '#3B2160',
  mapSeaDark: '#170B2E',
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
  // Fetih durumu rengi: haritada "fethedilmemiş/rakip" her zaman kırmızı kalır,
  // uygulamanın marka rengi (primary) ile karışmaması için ayrı tutuluyor.
  mapUnconquered: '#DC2626',
};
