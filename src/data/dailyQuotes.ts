// 30 daily Islamic quotes — one per Ramadan day
// Mix of Quran ayat, Hadith, and spiritual reminders

export interface DailyQuote {
  en: string;
  ar: string;
  source: string;
  sourceAr: string;
}

export const DAILY_QUOTES: DailyQuote[] = [
  {
    en: '"The month of Ramadan in which was revealed the Quran, a guidance for mankind."',
    ar: 'شَهْرُ رَمَضَانَ الَّذي أُنزِلَ فيهِ الْقُرْآنُ هُدًى لِلنَّاسِ',
    source: 'Quran 2:185',
    sourceAr: 'البقرة ١٨٥',
  },
  {
    en: '"When Ramadan begins, the gates of Paradise are opened."',
    ar: 'إِذَا دَخَلَ رَمَضَانُ فُتِحَتْ أَبْوَابُ الْجَنَّةِ',
    source: 'Sahih Bukhari',
    sourceAr: 'صحيح البخاري',
  },
  {
    en: '"Whoever fasts Ramadan out of faith and seeking reward, his past sins will be forgiven."',
    ar: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    source: 'Sahih Bukhari & Muslim',
    sourceAr: 'متفق عليه',
  },
  {
    en: '"And when My servants ask you about Me, indeed I am near."',
    ar: 'وَإِذَا سَأَلَكَ عِبَادِي عَنّي فَإِنّي قَرِيبٌ',
    source: 'Quran 2:186',
    sourceAr: 'البقرة ١٨٦',
  },
  {
    en: '"Fasting is a shield; so when one of you is fasting, let him not be obscene or foolish."',
    ar: 'الصِّيَامُ جُنَّةٌ، فَإِذَا كَانَ يَوْمُ صَوْمِ أَحَدِكُمْ فَلاَ يَرْفُثْ وَلاَ يَجْهَلْ',
    source: 'Sahih Bukhari',
    sourceAr: 'صحيح البخاري',
  },
  {
    en: '"Indeed, We sent it down during the Night of Decree."',
    ar: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
    source: 'Quran 97:1',
    sourceAr: 'القدر ١',
  },
  {
    en: '"The best of you are those who learn the Quran and teach it."',
    ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    source: 'Sahih Bukhari',
    sourceAr: 'صحيح البخاري',
  },
  {
    en: '"Allah does not burden a soul beyond that it can bear."',
    ar: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    source: 'Quran 2:286',
    sourceAr: 'البقرة ٢٨٦',
  },
  {
    en: '"Whoever stands in prayer during Laylat al-Qadr out of faith, his past sins will be forgiven."',
    ar: 'مَنْ قَامَ لَيْلَةَ القَدْرِ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    source: 'Sahih Bukhari & Muslim',
    sourceAr: 'متفق عليه',
  },
  {
    en: '"So remember Me; I will remember you."',
    ar: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    source: 'Quran 2:152',
    sourceAr: 'البقرة ١٥٢',
  },
  {
    en: '"Every good deed of the son of Adam is multiplied ten to seven hundred times."',
    ar: 'كُلُّ عَمَلِ ابْنِ آدَمَ يُضَاعَفُ الْحَسَنَةُ عَشْرُ أَمْثَالِهَا إِلَى سَبْعِمائَةِ ضِعْفٍ',
    source: 'Sahih Muslim',
    sourceAr: 'صحيح مسلم',
  },
  {
    en: '"And He found you lost and guided you."',
    ar: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ',
    source: 'Quran 93:7',
    sourceAr: 'الضحى ٧',
  },
  {
    en: '"Whoever provides Iftar for a fasting person earns the same reward without diminishing theirs."',
    ar: 'مَنْ فَطَّرَ صَائِمًا كَانَ لَهُ مِثْلُ أَجْرِهِ',
    source: 'Tirmidhi',
    sourceAr: 'الترمذي',
  },
  {
    en: '"Verily, with hardship comes ease."',
    ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    source: 'Quran 94:6',
    sourceAr: 'الشرح ٦',
  },
  {
    en: '"The supplication of a fasting person is not rejected."',
    ar: 'ثَلَاثَةٌ لاَ \تُرَدُّ دَعْوَتُهُمْ: الصَّائِمُ حينَ يُفْطِرُ',
    source: 'Tirmidhi',
    sourceAr: 'الترمذي',
  },
  {
    en: '"Be in this world as if you were a stranger or a traveler."',
    ar: 'كُنْ في الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ',
    source: 'Sahih Bukhari',
    sourceAr: 'صحيح البخاري',
  },
  {
    en: '"And your Lord says: Call upon Me, I will respond to you."',
    ar: 'وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ',
    source: 'Quran 40:60',
    sourceAr: 'غافر ٦٠',
  },
  {
    en: '"The best charity is that given in Ramadan."',
    ar: 'أَفْضَلُ الصَّدَقَةِ صَدَقَةُ \فِي رَمَضَانَ',
    source: 'Tirmidhi',
    sourceAr: 'الترمذي',
  },
  {
    en: '"O you who believe, fasting is prescribed for you as it was prescribed for those before you."',
    ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ',
    source: 'Quran 2:183',
    sourceAr: 'البقرة ١٨٣',
  },
  {
    en: '"Smiling in the face of your brother is charity."',
    ar: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ',
    source: 'Tirmidhi',
    sourceAr: 'الترمذي',
  },
  {
    en: '"And do good; indeed, Allah loves the doers of good."',
    ar: 'وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ',
    source: 'Quran 2:195',
    sourceAr: 'البقرة ١٩٥',
  },
  {
    en: '"The best of people are those most beneficial to others."',
    ar: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    source: 'Hadith (Al-Mu\'jam Al-Awsat)',
    sourceAr: 'المعجم الأوسط',
  },
  {
    en: '"Read! In the name of your Lord who created."',
    ar: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
    source: 'Quran 96:1',
    sourceAr: 'العلق ١',
  },
  {
    en: '"The fasting person has two occasions of joy: when breaking fast and when meeting his Lord."',
    ar: 'لِلصَّائِمِ فَرْحَتَانِ: فَرْحَةٌ عِنْدَ فِطْرِهِ وَفَرْحَةٌ عِنْدَ لِقَاءِ رَبِّهِ',
    source: 'Sahih Muslim',
    sourceAr: 'صحيح مسلم',
  },
  {
    en: '"Allah is with those who are patient."',
    ar: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    source: 'Quran 2:153',
    sourceAr: 'البقرة ١٥٣',
  },
  {
    en: '"The dearest of deeds to Allah are the most consistent, even if small."',
    ar: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    source: 'Sahih Bukhari',
    sourceAr: 'صحيح البخاري',
  },
  {
    en: '"Indeed, the patient will be given their reward without account."',
    ar: 'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُمْ بِغَيْرِ حِسَابٍ',
    source: 'Quran 39:10',
    sourceAr: 'الزمر ١٠',
  },
  {
    en: '"Seek knowledge from the cradle to the grave."',
    ar: 'اُطْلُبوا العِلْمَ مِنَ المَهْدِ إِلَى اللَّحْدِ',
    source: 'Prophetic Wisdom',
    sourceAr: 'حكمة نبوية',
  },
  {
    en: '"Whoever guides someone to goodness will have a reward like the one who did it."',
    ar: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ',
    source: 'Sahih Muslim',
    sourceAr: 'صحيح مسلم',
  },
  {
    en: '"Ramadan has come to you — a blessed month. May Allah accept your worship."',
    ar: 'أَتَاكُمْ رَمَضَانُ شَهْرٌ مُبَارَكٌ تَقَبَّلَ اللَّهُ طَاعَتَكُمْ',
    source: 'An-Nasa\'i',
    sourceAr: 'النسائي',
  },
];

/** Get the quote for a given Ramadan day (1-30) */
export function getDailyQuote(dayNumber: number): DailyQuote {
  const idx = ((dayNumber - 1) % DAILY_QUOTES.length + DAILY_QUOTES.length) % DAILY_QUOTES.length;
  return DAILY_QUOTES[idx];
}
