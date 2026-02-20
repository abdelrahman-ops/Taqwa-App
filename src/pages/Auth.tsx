import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

type AuthMode = 'login' | 'register';

export default function Auth() {
  const { loginUser, registerUser, continueAsGuest, locale } = useApp();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === 'register';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim() || (isRegister && !name.trim())) {
      setError(locale === 'ar' ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError(locale === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const resultError = isRegister
        ? await registerUser(name.trim(), email.trim(), password)
        : await loginUser(email.trim(), password);

      if (resultError) {
        setError(resultError);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center px-6 py-10">
      <p className="text-2xl arabic-text text-emerald-700 dark:text-emerald-400 mb-2 text-center">
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </p>
      <h1 className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mb-1">
        {locale === 'ar' ? 'تسجيل الدخول' : 'Welcome Back'}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
        {locale === 'ar' ? 'سجّل دخولك لمزامنة تقدمك' : 'Sign in to sync your Ramadan progress'}
      </p>

      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
              !isRegister
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            {locale === 'ar' ? 'دخول' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
              isRegister
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            {locale === 'ar' ? 'حساب جديد' : 'Register'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <div className="relative">
              <FiUser className="w-4 h-4 text-gray-400 absolute top-3.5 left-3" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={locale === 'ar' ? 'الاسم' : 'Name'}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div className="relative">
            <FiMail className="w-4 h-4 text-gray-400 absolute top-3.5 left-3" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="relative">
            <FiLock className="w-4 h-4 text-gray-400 absolute top-3.5 left-3" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={locale === 'ar' ? 'كلمة المرور' : 'Password'}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {isRegister && (
            <div className="relative">
              <FiLock className="w-4 h-4 text-gray-400 absolute top-3.5 left-3" />
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder={locale === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-lg px-2.5 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {isRegister ? <FiUserPlus className="w-4 h-4" /> : <FiLogIn className="w-4 h-4" />}
            {submitting
              ? (locale === 'ar' ? 'جارٍ التحميل...' : 'Please wait...')
              : (isRegister
                ? (locale === 'ar' ? 'إنشاء حساب' : 'Create account')
                : (locale === 'ar' ? 'تسجيل الدخول' : 'Sign in'))}
          </button>

          <button
            type="button"
            onClick={continueAsGuest}
            className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-emerald-400 transition-colors"
          >
            {locale === 'ar' ? 'تخطي والمتابعة كضيف' : 'Skip and continue as guest'}
          </button>
        </form>
      </div>
    </div>
  );
}
