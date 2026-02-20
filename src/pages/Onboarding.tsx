import React, { useState } from 'react';
import { FiUser, FiBookOpen, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

type Step = 'name' | 'goal' | 'done';

const QUICK_GOALS = [
  { n: 1, desc: 'recommendedForMost' as const },
  { n: 2, desc: 'moderateChallenge' as const },
  { n: 3, desc: 'advanced' as const },
];

export default function Onboarding() {
  const { completeOnboarding, t, locale } = useApp();
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(1);
  const [customGoal, setCustomGoal] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const effectiveGoal = useCustom ? (parseInt(customGoal) || 1) : goal;

  function handleContinue() {
    if (step === 'name' && name.trim()) setStep('goal');
    else if (step === 'goal') setStep('done');
    else if (step === 'done') completeOnboarding(name.trim(), effectiveGoal);
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center px-6 py-10 overflow-y-auto">
      {/* Bismillah */}
      <p className="bismillah text-emerald-700 dark:text-emerald-400 mb-2 text-center" style={{ fontSize: '1.3rem' }}>
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </p>
      <h1 className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mb-1 latin-only">
        {t.ramadanMubarak}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center latin-only">{t.ramadanHabitTracker}</p>

      <div className="w-full max-w-sm">
        {/* Step: Name */}
        {step === 'name' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiUser className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-bold text-gray-800 dark:text-gray-100">{t.whatsYourName}</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.personalizeExperience}</p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && name.trim() && handleContinue()}
              placeholder={t.enterName}
              autoFocus
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
            />
            <button
              onClick={handleContinue}
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-emerald-700 transition-colors"
            >
              {t.continue} <FiArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setName(locale === 'ar' ? 'ضيف' : 'Guest');
                setStep('goal');
              }}
              className="mt-2 w-full text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {locale === 'ar' ? 'تخطي الآن' : 'Skip for now'}
            </button>
          </div>
        )}

        {/* Step: Goal */}
        {step === 'goal' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiBookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-bold text-gray-800 dark:text-gray-100">{t.quranGoalQuestion}</h2>
            </div>

            {/* Preset options */}
            <div className="space-y-2 mb-4">
              {QUICK_GOALS.map(({ n, desc }) => (
                <button
                  key={n}
                  onClick={() => { setGoal(n); setUseCustom(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${!useCustom && goal === n ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400'}`}
                >
                  <span className="font-bold text-lg">{n}x</span>
                  <span className="text-xs opacity-75">{t[desc]}</span>
                  {!useCustom && goal === n && <FiCheck className="w-4 h-4" />}
                </button>
              ))}
            </div>

            {/* Custom */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                {locale === 'ar' ? 'أو أدخل عدداً مخصصاً:' : 'Or a custom number:'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { const v = Math.max(1, (parseInt(customGoal) || 1) - 1); setCustomGoal(String(v)); setUseCustom(true); }}
                  className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300"
                >−</button>
                <input
                  type="number"
                  min={1}
                  value={customGoal}
                  onChange={e => { setCustomGoal(e.target.value); setUseCustom(true); }}
                  placeholder="4"
                  className={`flex-1 text-center font-bold bg-gray-50 dark:bg-gray-800 border-2 rounded-xl py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${useCustom ? 'border-emerald-500' : 'border-gray-200 dark:border-gray-700'}`}
                />
                <button
                  onClick={() => { const v = (parseInt(customGoal) || 0) + 1; setCustomGoal(String(v)); setUseCustom(true); }}
                  className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400"
                >+</button>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              {t.continue} <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step: Done */}
        {step === 'done' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-2">{t.youreAllSet}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              {locale === 'ar' ? `مرحباً ${name}` : `Welcome, ${name}!`}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">{t.mayAllahAccept}</p>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 mb-6 text-sm text-emerald-700 dark:text-emerald-400">
              {locale === 'ar' ? `هدفك: ${effectiveGoal} ختمة` : `Goal: ${effectiveGoal}x Khatma`}
            </div>
            <button
              onClick={handleContinue}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              {t.startTracking}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
