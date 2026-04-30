export const giData = [
  // Meyveler
  { id: 'elma', name: 'Elma', gi: 39, carbsPer100g: 14, category: 'Meyve' },
  { id: 'muz', name: 'Muz (Olgun)', gi: 62, carbsPer100g: 23, category: 'Meyve' },
  { id: 'muz_yesil', name: 'Muz (Yeşil)', gi: 42, carbsPer100g: 23, category: 'Meyve' },
  { id: 'cilek', name: 'Çilek', gi: 41, carbsPer100g: 8, category: 'Meyve' },
  { id: 'karpuz', name: 'Karpuz', gi: 72, carbsPer100g: 8, category: 'Meyve' },
  { id: 'uzum', name: 'Üzüm', gi: 59, carbsPer100g: 18, category: 'Meyve' },
  { id: 'portakal', name: 'Portakal', gi: 40, carbsPer100g: 12, category: 'Meyve' },

  // Tahıllar ve Karbonhidratlar
  { id: 'beyaz_ekmek', name: 'Beyaz Ekmek', gi: 75, carbsPer100g: 49, category: 'Tahıl' },
  { id: 'tam_bugday_ekmek', name: 'Tam Buğday Ekmeği', gi: 53, carbsPer100g: 43, category: 'Tahıl' },
  { id: 'yulaf', name: 'Yulaf Ezmesi', gi: 55, carbsPer100g: 66, category: 'Tahıl' },
  { id: 'beyaz_pirinc', name: 'Beyaz Pirinç', gi: 73, carbsPer100g: 28, category: 'Tahıl' },
  { id: 'bulgur', name: 'Bulgur', gi: 48, carbsPer100g: 76, category: 'Tahıl' },
  { id: 'kinoa', name: 'Kinoa', gi: 53, carbsPer100g: 21, category: 'Tahıl' },
  { id: 'makarna_beyaz', name: 'Beyaz Makarna (Haşlanmış)', gi: 50, carbsPer100g: 25, category: 'Tahıl' },

  // Sebzeler (Karbonhidratlı olanlar)
  { id: 'patates_haslama', name: 'Patates (Haşlanmış)', gi: 78, carbsPer100g: 20, category: 'Sebze' },
  { id: 'tatli_patates', name: 'Tatlı Patates', gi: 61, carbsPer100g: 20, category: 'Sebze' },
  { id: 'havuc_haslama', name: 'Havuç (Haşlanmış)', gi: 39, carbsPer100g: 10, category: 'Sebze' },
  { id: 'misir', name: 'Mısır', gi: 52, carbsPer100g: 19, category: 'Sebze' },

  // Baklagiller
  { id: 'mercimek', name: 'Yeşil Mercimek', gi: 30, carbsPer100g: 20, category: 'Baklagil' },
  { id: 'nohut', name: 'Nohut', gi: 33, carbsPer100g: 27, category: 'Baklagil' },
  { id: 'fasulye', name: 'Kuru Fasulye', gi: 31, carbsPer100g: 22, category: 'Baklagil' },

  // Atıştırmalıklar
  { id: 'bitter_cikolata', name: 'Bitter Çikolata (%70+)', gi: 23, carbsPer100g: 36, category: 'Atıştırmalık' },
  { id: 'sutlu_cikolata', name: 'Sütlü Çikolata', gi: 45, carbsPer100g: 59, category: 'Atıştırmalık' }
].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
