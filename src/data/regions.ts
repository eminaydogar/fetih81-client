export interface Region {
  id: string;
  name: string;
  /** Bölgenin haritadaki taban rengi; iller bu tonun hafif varyasyonlarıyla boyanır. */
  color: string;
  provinces: string[];
}

// Türkiye'nin 7 coğrafi bölgesi ve il dağılımı (81 il).
// İl adları src/data/turkeyProvincePaths.ts içindeki adlarla birebir aynı olmalı.
export const REGIONS: Region[] = [
  {
    id: 'marmara',
    name: 'Marmara',
    color: '#6BA9D8',
    provinces: [
      'İstanbul',
      'Edirne',
      'Kırklareli',
      'Tekirdağ',
      'Çanakkale',
      'Balıkesir',
      'Bursa',
      'Yalova',
      'Kocaeli',
      'Sakarya',
      'Bilecik',
    ],
  },
  {
    id: 'ege',
    name: 'Ege',
    color: '#5FC5A6',
    provinces: [
      'İzmir',
      'Manisa',
      'Aydın',
      'Denizli',
      'Muğla',
      'Uşak',
      'Kütahya',
      'Afyonkarahisar',
    ],
  },
  {
    id: 'akdeniz',
    name: 'Akdeniz',
    color: '#F2A25A',
    provinces: [
      'Antalya',
      'Isparta',
      'Burdur',
      'Mersin',
      'Adana',
      'Osmaniye',
      'Hatay',
      'Kahramanmaraş',
    ],
  },
  {
    id: 'ic-anadolu',
    name: 'İç Anadolu',
    color: '#E6C260',
    provinces: [
      'Ankara',
      'Konya',
      'Kayseri',
      'Sivas',
      'Yozgat',
      'Kırşehir',
      'Kırıkkale',
      'Çankırı',
      'Eskişehir',
      'Karaman',
      'Aksaray',
      'Nevşehir',
      'Niğde',
    ],
  },
  {
    id: 'karadeniz',
    name: 'Karadeniz',
    color: '#7CBC63',
    provinces: [
      'Zonguldak',
      'Bartın',
      'Karabük',
      'Bolu',
      'Düzce',
      'Kastamonu',
      'Sinop',
      'Çorum',
      'Amasya',
      'Tokat',
      'Samsun',
      'Ordu',
      'Giresun',
      'Trabzon',
      'Rize',
      'Artvin',
      'Gümüşhane',
      'Bayburt',
    ],
  },
  {
    id: 'dogu-anadolu',
    name: 'Doğu Anadolu',
    color: '#AC8AD4',
    provinces: [
      'Erzurum',
      'Erzincan',
      'Kars',
      'Ardahan',
      'Iğdır',
      'Ağrı',
      'Van',
      'Muş',
      'Bitlis',
      'Bingöl',
      'Tunceli',
      'Elazığ',
      'Malatya',
      'Hakkâri',
    ],
  },
  {
    id: 'guneydogu-anadolu',
    name: 'Güneydoğu Anadolu',
    color: '#E4867A',
    provinces: [
      'Gaziantep',
      'Kilis',
      'Şanlıurfa',
      'Adıyaman',
      'Diyarbakır',
      'Mardin',
      'Batman',
      'Siirt',
      'Şırnak',
    ],
  },
];

const REGION_BY_PROVINCE: Record<string, Region> = REGIONS.reduce(
  (acc, region) => {
    region.provinces.forEach((province) => {
      acc[province] = region;
    });
    return acc;
  },
  {} as Record<string, Region>
);

export function getRegion(provinceName: string): Region | undefined {
  return REGION_BY_PROVINCE[provinceName];
}

export function getRegionColor(provinceName: string): string | undefined {
  return REGION_BY_PROVINCE[provinceName]?.color;
}
