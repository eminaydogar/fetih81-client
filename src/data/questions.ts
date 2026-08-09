import { Question } from '../types';

// Genel kültür / tarih soru bankası (örnek veri).
// Backend entegrasyonunda bu, API'den ilçeye/kategoriye göre çekilecek.
export const QUESTION_BANK: Question[] = [
  { id: 'q1', text: 'İstanbul hangi yıl fethedildi?', options: ['1453', '1071', '1299', '1520'], correctIndex: 0 },
  { id: 'q2', text: 'İstanbul\'u fetheden padişah kimdir?', options: ['Yıldırım Bayezid', 'II. Mehmed (Fatih)', 'Yavuz Sultan Selim', 'Kanuni Sultan Süleyman'], correctIndex: 1 },
  { id: 'q3', text: 'Malazgirt Savaşı hangi yıl yapılmıştır?', options: ['1071', '1176', '1453', '1099'], correctIndex: 0 },
  { id: 'q4', text: 'Türkiye\'nin başkenti neresidir?', options: ['İstanbul', 'İzmir', 'Ankara', 'Bursa'], correctIndex: 2 },
  { id: 'q5', text: 'Osmanlı Devleti\'nin kurucusu kimdir?', options: ['Osman Bey', 'Orhan Bey', 'I. Murad', 'Fatih Sultan Mehmed'], correctIndex: 0 },
  { id: 'q6', text: 'Türkiye\'nin en kalabalık ili hangisidir?', options: ['Ankara', 'İzmir', 'İstanbul', 'Bursa'], correctIndex: 2 },
  { id: 'q7', text: 'Cumhuriyet hangi yıl ilan edildi?', options: ['1920', '1923', '1938', '1919'], correctIndex: 1 },
  { id: 'q8', text: 'Anadolu Selçuklu Devleti\'nin başkenti neresidir?', options: ['Konya', 'Bursa', 'Kayseri', 'Sivas'], correctIndex: 0 },
  { id: 'q9', text: 'Türkiye\'nin en yüksek dağı hangisidir?', options: ['Erciyes', 'Ağrı Dağı', 'Uludağ', 'Nemrut'], correctIndex: 1 },
  { id: 'q10', text: 'Kurtuluş Savaşı\'nın başkomutanı kimdir?', options: ['İsmet İnönü', 'Kazım Karabekir', 'Mustafa Kemal Atatürk', 'Fevzi Çakmak'], correctIndex: 2 },
  { id: 'q11', text: 'Bursa Osmanlı\'ya hangi padişah döneminde başkent oldu?', options: ['Osman Bey', 'Orhan Bey', 'I. Murad', 'Yıldırım Bayezid'], correctIndex: 1 },
  { id: 'q12', text: 'Türkiye kaç coğrafi bölgeye ayrılır?', options: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: 'q13', text: 'Ankara\'nın başkent ilan edildiği yıl hangisidir?', options: ['1920', '1923', '1927', '1930'], correctIndex: 1 },
  { id: 'q14', text: 'Trabzon Rum İmparatorluğu\'nu kim fethetmiştir?', options: ['II. Mehmed', 'II. Bayezid', 'Yavuz Sultan Selim', 'Kanuni'], correctIndex: 0 },
  { id: 'q15', text: 'Çanakkale Savaşları hangi yılda gerçekleşmiştir?', options: ['1912', '1915', '1918', '1922'], correctIndex: 1 },
  { id: 'q16', text: 'Türkiye\'nin para birimi nedir?', options: ['Euro', 'Dolar', 'Türk Lirası', 'Lira Sterlin'], correctIndex: 2 },
  { id: 'q17', text: 'Selçuklu Devleti\'ni kim kurmuştur?', options: ['Alparslan', 'Tuğrul Bey', 'Sencer', 'Melikşah'], correctIndex: 1 },
  { id: 'q18', text: 'İzmir hangi bölgede yer alır?', options: ['Karadeniz', 'Ege', 'Akdeniz', 'İç Anadolu'], correctIndex: 1 },
  { id: 'q19', text: 'Fatih Sultan Mehmed kaç yaşında İstanbul\'u fethetti?', options: ['19', '21', '25', '30'], correctIndex: 1 },
  { id: 'q20', text: 'Türkiye\'nin en uzun nehri hangisidir?', options: ['Sakarya', 'Fırat', 'Kızılırmak', 'Dicle'], correctIndex: 2 },
  { id: 'q21', text: 'Antalya hangi bölgede yer alır?', options: ['Ege', 'Akdeniz', 'Marmara', 'Güneydoğu Anadolu'], correctIndex: 1 },
  { id: 'q22', text: 'Osmanlı\'da "Fetret Devri" hangi olaydan sonra yaşanmıştır?', options: ['Ankara Savaşı', 'Niğbolu Savaşı', 'Kosova Savaşı', 'Varna Savaşı'], correctIndex: 0 },
  { id: 'q23', text: 'Türkiye\'nin komşu ülke sayısı kaçtır?', options: ['6', '7', '8', '9'], correctIndex: 2 },
  { id: 'q24', text: 'Diyarbakır hangi nehir kenarında kurulmuştur?', options: ['Fırat', 'Dicle', 'Aras', 'Sakarya'], correctIndex: 1 },
  { id: 'q25', text: 'Türk Dil Kurumu hangi yıl kurulmuştur?', options: ['1928', '1932', '1935', '1940'], correctIndex: 1 },
  { id: 'q26', text: 'Kapadokya hangi ilimizde yer alır?', options: ['Nevşehir', 'Kayseri', 'Aksaray', 'Niğde'], correctIndex: 0 },
  { id: 'q27', text: 'Yavuz Sultan Selim döneminde hangi halifelik Osmanlı\'ya geçmiştir?', options: ['Emevi', 'Abbasi', 'Fatimi', 'Endülüs'], correctIndex: 1 },
  { id: 'q28', text: 'Türkiye\'de kaç il bulunmaktadır?', options: ['79', '81', '83', '85'], correctIndex: 1 },
  { id: 'q29', text: 'Bursa\'nın simgesi kabul edilen dağ hangisidir?', options: ['Erciyes', 'Uludağ', 'Ilgaz', 'Kartalkaya'], correctIndex: 1 },
  { id: 'q30', text: 'Karadeniz kıyısında olmayan il hangisidir?', options: ['Trabzon', 'Ordu', 'Sivas', 'Rize'], correctIndex: 2 },
];

export function getRandomQuestions(count: number): Question[] {
  const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
