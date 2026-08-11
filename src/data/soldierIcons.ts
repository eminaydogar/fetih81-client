import { FC } from 'react';
import { SvgProps } from 'react-native-svg';
import Akinci from '../images/district-ui-soldiers/akinci.svg';
import Hoplit from '../images/district-ui-soldiers/hoplit.svg';
import Lejyon from '../images/district-ui-soldiers/lejyon.svg';
import Muhafiz from '../images/district-ui-soldiers/muhafiz.svg';
import Samuray from '../images/district-ui-soldiers/samuray.svg';
import Sipahi from '../images/district-ui-soldiers/sipahi.svg';
import Sovalye from '../images/district-ui-soldiers/sovalye.svg';
import Viking from '../images/district-ui-soldiers/viking.svg';
import Yeniceri from '../images/district-ui-soldiers/yeniceri.svg';

export const SOLDIER_ICONS: FC<SvgProps>[] = [
  Akinci,
  Hoplit,
  Lejyon,
  Muhafiz,
  Samuray,
  Sipahi,
  Sovalye,
  Viking,
  Yeniceri,
];

// Bir oyuncuya kalıcı görünen bir asker ikonu atar (henüz karakter seçimi yokken).
// Karakter seçimi eklenince oyuncunun gerçek askeri burada owner id yerine kullanılacak.
export function getSoldierIconForId(id: string): FC<SvgProps> {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return SOLDIER_ICONS[hash % SOLDIER_ICONS.length];
}
