// ===== Internationalization System =====

export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export function getDirection(locale: Locale): Direction {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export interface Translations {
  // App
  appName: string;
  ramadanMubarak: string;
  ramadanHabitTracker: string;

  // Navigation
  home: string;
  quran: string;
  prayers: string;
  progress: string;
  settings: string;

  // Common
  day: string;
  days: string;
  of: string;
  pages: string;
  pagesPerDay: string;
  save: string;
  saved: string;
  cancel: string;
  confirm: string;
  reset: string;
  today: string;
  tapForToday: string;
  completed: string;
  notYet: string;
  goBack: string;
  next: string;
  previous: string;
  overall: string;
  current: string;
  close: string;

  // Fasting
  fasting: string;
  fasted: string;
  hadSuhoor: string;
  fastingNotes: string;
  fastingNotesPlaceholder: string;
  daysFasted: string;

  // Prayers
  prayersTitle: string;
  prayersAndAzkar: string;
  trackPrayers: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  taraweeh: string;
  prayerStreaks: string;
  prayersPrayed: string;
  prayerBreakdown: string;

  // Quran
  quranTracker: string;
  quranGoal: string;
  quranGoalQuestion: string;
  khatma: string;
  readPages: string;
  pagesRead: string;
  pagesGoal: string;
  dailyPages: string;
  readingPlan: string;
  quranProgress: string;
  totalPagesRead: string;
  completions: string;
  times: string;

  // Azkar
  azkar: string;
  morningAzkar: string;
  eveningAzkar: string;
  morning: string;
  evening: string;
  azkarDone: string;

  // Extras
  goodDeeds: string;
  whatGoodDeed: string;
  addDeed: string;
  suggestions: {
    helped: string;
    charity: string;
    visited: string;
    fedIftar: string;
    dua: string;
    reconciled: string;
    taught: string;
    smiled: string;
    removedHarm: string;
    calledFamily: string;
  };

  // Progress
  yourProgress: string;
  seeProgress: string;
  perfectDays: string;
  ramadanCalendar: string;
  noData: string;
  excellent: string;
  good: string;
  fair: string;
  low: string;

  // Settings
  settingsTitle: string;
  customize: string;
  yourName: string;
  enterName: string;
  about: string;
  aboutDescription: string;
  dataStoredLocally: string;
  resetData: string;
  resetWarning: string;
  confirmReset: string;
  language: string;
  theme: string;
  darkMode: string;
  lightMode: string;
  auto: string;
  arabic: string;
  english: string;

  // Onboarding
  getStarted: string;
  whatsYourName: string;
  personalizeExperience: string;
  continue: string;
  youreAllSet: string;
  mayAllahAccept: string;
  startTracking: string;
  recommendedForMost: string;
  moderateChallenge: string;
  advanced: string;
  expertLevel: string;
  dailyTracking: string;
  morningAndEvening: string;
  dailyPlusTaraweeh: string;

  // Motivation
  amazingProgress: string;
  keepGoing: string;
  startTracking2: string;
  bismillah: string;
}

const en: Translations = {
  appName: 'Ramadan Tracker',
  ramadanMubarak: 'Ramadan Mubarak!',
  ramadanHabitTracker: 'Taqwa',

  home: 'Home',
  quran: 'Quran',
  prayers: 'Prayers',
  progress: 'Progress',
  settings: 'Settings',

  day: 'Day',
  days: 'days',
  of: 'of',
  pages: 'pages',
  pagesPerDay: 'pages/day',
  save: 'Save',
  saved: 'Saved!',
  cancel: 'Cancel',
  confirm: 'Confirm',
  reset: 'Reset',
  today: 'Today',
  tapForToday: 'Tap for today',
  completed: 'Completed',
  notYet: 'Not Yet',
  goBack: 'Go back',
  next: 'Next',
  previous: 'Previous',
  overall: 'Overall',
  current: 'Current',
  close: 'Close',

  fasting: 'Fasting',
  fasted: 'Fasted',
  hadSuhoor: 'Had Suhoor (Pre-dawn meal)',
  fastingNotes: 'Fasting notes',
  fastingNotesPlaceholder: 'Any notes about today\'s fast...',
  daysFasted: 'Days Fasted',

  prayersTitle: 'Prayers',
  prayersAndAzkar: 'Prayers & Azkar',
  trackPrayers: 'Track your daily prayers and remembrance',
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
  taraweeh: 'Taraweeh',
  prayerStreaks: 'Prayer Streaks',
  prayersPrayed: 'Prayers Prayed',
  prayerBreakdown: 'Prayer Breakdown',

  quranTracker: 'Quran Tracker',
  quranGoal: 'Quran Goal',
  quranGoalQuestion: 'How many times do you want to complete the Quran this Ramadan?',
  khatma: 'Khatma',
  readPages: 'Read pages',
  pagesRead: 'pages read',
  pagesGoal: 'pages goal',
  dailyPages: 'Pages/Day',
  readingPlan: '30-Day Reading Plan',
  quranProgress: 'Quran Progress',
  totalPagesRead: 'Total Pages Read',
  completions: 'completions',
  times: 'time(s)',

  azkar: 'Azkar',
  morningAzkar: 'Morning Azkar',
  eveningAzkar: 'Evening Azkar',
  morning: 'Morning',
  evening: 'Evening',
  azkarDone: 'Azkar Done',

  goodDeeds: 'Good Deeds',
  whatGoodDeed: 'What good did you do today?',
  addDeed: 'Add deed',
  suggestions: {
    helped: 'Helped someone in need',
    charity: 'Gave charity (Sadaqah)',
    visited: 'Visited a sick person',
    fedIftar: 'Fed someone Iftar',
    dua: 'Made Dua for others',
    reconciled: 'Reconciled with someone',
    taught: 'Taught someone something beneficial',
    smiled: 'Smiled at someone',
    removedHarm: 'Removed harm from the road',
    calledFamily: 'Called family/parents',
  },

  yourProgress: 'Your Progress',
  seeProgress: 'See how your Ramadan is going',
  perfectDays: 'Perfect Days',
  ramadanCalendar: 'Ramadan Calendar',
  noData: 'No data',
  excellent: '90%+',
  good: '70-89%',
  fair: '40-69%',
  low: '<40%',

  settingsTitle: 'Settings',
  customize: 'Customize your Ramadan experience',
  yourName: 'Your Name',
  enterName: 'Enter your name',
  about: 'About',
  aboutDescription: 'Track your fasting, prayers, Quran reading, azkar, and good deeds throughout the blessed month of Ramadan.',
  dataStoredLocally: 'Your data is stored locally on your device and synced to the server when online.',
  resetData: 'Reset Data',
  resetWarning: 'This will permanently delete all your tracking data. This action cannot be undone.',
  confirmReset: 'Confirm Reset - Tap Again',
  language: 'Language',
  theme: 'Theme',
  darkMode: 'Dark',
  lightMode: 'Light',
  auto: 'Auto',
  arabic: 'العربية',
  english: 'English',

  getStarted: 'Get Started',
  whatsYourName: "What's your name?",
  personalizeExperience: "We'll use this to personalize your experience.",
  continue: 'Continue',
  youreAllSet: "You're all set",
  mayAllahAccept: 'May Allah accept your good deeds this Ramadan.',
  startTracking: 'Start Tracking',
  recommendedForMost: 'Recommended for most',
  moderateChallenge: 'Moderate challenge',
  advanced: 'Advanced',
  expertLevel: 'Expert level',
  dailyTracking: 'Daily tracking',
  morningAndEvening: 'Morning & Evening',
  dailyPlusTaraweeh: '5 daily + Taraweeh',

  amazingProgress: 'MashaAllah! Amazing progress today!',
  keepGoing: 'Keep going! Every small deed counts.',
  startTracking2: 'Start tracking your day!',
  bismillah: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
};

const ar: Translations = {
  appName: 'متتبع رمضان',
  ramadanMubarak: 'رمضان مبارك!',
  ramadanHabitTracker: 'تقوى',

  home: 'الرئيسية',
  quran: 'القرآن',
  prayers: 'الصلاة',
  progress: 'التقدم',
  settings: 'الإعدادات',

  day: 'يوم',
  days: 'أيام',
  of: 'من',
  pages: 'صفحة',
  pagesPerDay: 'صفحة/يوم',
  save: 'حفظ',
  saved: 'تم الحفظ!',
  cancel: 'إلغاء',
  confirm: 'تأكيد',
  reset: 'إعادة تعيين',
  today: 'اليوم',
  tapForToday: 'اضغط لليوم',
  completed: 'مكتمل',
  notYet: 'لم يتم بعد',
  goBack: 'رجوع',
  next: 'التالي',
  previous: 'السابق',
  overall: 'الإجمالي',
  current: 'الحالي',
  close: 'إغلاق',

  fasting: 'الصيام',
  fasted: 'صائم',
  hadSuhoor: 'تناولت السحور',
  fastingNotes: 'ملاحظات الصيام',
  fastingNotesPlaceholder: 'أي ملاحظات عن صيام اليوم...',
  daysFasted: 'أيام الصيام',

  prayersTitle: 'الصلوات',
  prayersAndAzkar: 'الصلاة والأذكار',
  trackPrayers: 'تتبع صلواتك اليومية وأذكارك',
  fajr: 'الفجر',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
  taraweeh: 'التراويح',
  prayerStreaks: 'سلسلة الصلاة',
  prayersPrayed: 'الصلوات المؤداة',
  prayerBreakdown: 'تفصيل الصلوات',

  quranTracker: 'متتبع القرآن',
  quranGoal: 'هدف القرآن',
  quranGoalQuestion: 'كم مرة تريد ختم القرآن في رمضان؟',
  khatma: 'ختمة',
  readPages: 'اقرأ صفحات',
  pagesRead: 'صفحة مقروءة',
  pagesGoal: 'الهدف',
  dailyPages: 'صفحة/يوم',
  readingPlan: 'خطة القراءة لـ 30 يوم',
  quranProgress: 'تقدم القرآن',
  totalPagesRead: 'إجمالي الصفحات المقروءة',
  completions: 'ختمات',
  times: 'مرة/مرات',

  azkar: 'الأذكار',
  morningAzkar: 'أذكار الصباح',
  eveningAzkar: 'أذكار المساء',
  morning: 'الصباح',
  evening: 'المساء',
  azkarDone: 'الأذكار المنجزة',

  goodDeeds: 'الأعمال الصالحة',
  whatGoodDeed: 'ما الخير الذي فعلته اليوم؟',
  addDeed: 'إضافة عمل',
  suggestions: {
    helped: 'ساعدت شخصاً محتاجاً',
    charity: 'تصدقت (صدقة)',
    visited: 'زرت مريضاً',
    fedIftar: 'أطعمت صائماً',
    dua: 'دعوت للآخرين',
    reconciled: 'صالحت أحداً',
    taught: 'علّمت أحداً شيئاً نافعاً',
    smiled: 'ابتسمت في وجه أخيك',
    removedHarm: 'أزلت الأذى عن الطريق',
    calledFamily: 'اتصلت بالأهل/الوالدين',
  },

  yourProgress: 'تقدمك',
  seeProgress: 'تابع تقدمك في رمضان',
  perfectDays: 'أيام مثالية',
  ramadanCalendar: 'تقويم رمضان',
  noData: 'لا بيانات',
  excellent: '+٩٠٪',
  good: '٧٠-٨٩٪',
  fair: '٤٠-٦٩٪',
  low: '٤٠٪>',

  settingsTitle: 'الإعدادات',
  customize: 'خصص تجربتك الرمضانية',
  yourName: 'اسمك',
  enterName: 'أدخل اسمك',
  about: 'حول التطبيق',
  aboutDescription: 'تتبع صيامك وصلواتك وقراءتك للقرآن وأذكارك وأعمالك الصالحة خلال شهر رمضان المبارك.',
  dataStoredLocally: 'بياناتك محفوظة على جهازك ومزامنة مع الخادم عند الاتصال.',
  resetData: 'إعادة تعيين البيانات',
  resetWarning: 'سيؤدي هذا إلى حذف جميع بيانات التتبع نهائياً. لا يمكن التراجع عن هذا الإجراء.',
  confirmReset: 'تأكيد إعادة التعيين - اضغط مرة أخرى',
  language: 'اللغة',
  theme: 'المظهر',
  darkMode: 'داكن',
  lightMode: 'فاتح',
  auto: 'تلقائي',
  arabic: 'العربية',
  english: 'English',

  getStarted: 'ابدأ الآن',
  whatsYourName: 'ما اسمك؟',
  personalizeExperience: 'سنستخدم اسمك لتخصيص تجربتك.',
  continue: 'متابعة',
  youreAllSet: 'أنت جاهز',
  mayAllahAccept: 'تقبل الله طاعتكم في رمضان.',
  startTracking: 'ابدأ التتبع',
  recommendedForMost: 'موصى بها للأغلبية',
  moderateChallenge: 'تحدي متوسط',
  advanced: 'متقدم',
  expertLevel: 'مستوى خبير',
  dailyTracking: 'تتبع يومي',
  morningAndEvening: 'صباحية ومسائية',
  dailyPlusTaraweeh: '٥ صلوات + التراويح',

  amazingProgress: 'ما شاء الله! تقدم رائع اليوم!',
  keepGoing: 'استمر! كل عمل صالح يُحتسب.',
  startTracking2: 'ابدأ تتبع يومك!',
  bismillah: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
};

const translations: Record<Locale, Translations> = { en, ar };

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

export function getPrayerName(prayer: string, locale: Locale): string {
  const t = translations[locale];
  const map: Record<string, string> = {
    fajr: t.fajr,
    dhuhr: t.dhuhr,
    asr: t.asr,
    maghrib: t.maghrib,
    isha: t.isha,
    taraweeh: t.taraweeh,
  };
  return map[prayer] || prayer;
}
