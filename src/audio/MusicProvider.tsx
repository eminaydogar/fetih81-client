import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';

const MUSIC_SOURCE = require('./quiz_marimba.wav');
// Arka plan müziği, oyun seslerini bastırmasın diye kısık çalar.
const MUSIC_VOLUME = 0.35;

interface MusicContextValue {
  isPlaying: boolean;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextValue>({
  isPlaying: false,
  toggle: () => {},
});

export function useMusic() {
  return useContext(MusicContext);
}

/** Uygulama açılır açılmaz fon müziğini döngüde başlatır; kapatma kontrolünü context ile paylaşır. */
export default function MusicProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer(MUSIC_SOURCE);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Sessiz moddaki iOS cihazlarda da duyulsun; uygulama arkaya alınınca sussun.
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false }).catch(
      () => {}
    );
    player.loop = true; // parça bitince baştan başlar
    player.volume = MUSIC_VOLUME;
    player.play();
  }, [player]);

  // Uygulama arka plandan dönünce, kullanıcı kapatmadıysa müzik kaldığı yerden devam eder.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && isPlaying) player.play();
    });
    return () => sub.remove();
  }, [player, isPlaying]);

  function toggle() {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  }

  return (
    <MusicContext.Provider value={{ isPlaying, toggle }}>{children}</MusicContext.Provider>
  );
}
