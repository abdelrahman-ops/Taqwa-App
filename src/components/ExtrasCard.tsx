import React, { useState } from 'react';
import { FiHeart, FiPlus, FiTrash2, FiCheck, FiUsers, FiDollarSign, FiHome, FiStar } from 'react-icons/fi';
import { IoRestaurantOutline } from 'react-icons/io5';
import { useApp } from '../context/AppContext';

const DEED_SUGGESTIONS: { key: 'helped' | 'charity' | 'visited' | 'fedIftar' | 'dua' | 'reconciled'; Icon: React.ElementType }[] = [
  { key: 'helped', Icon: FiUsers },
  { key: 'charity', Icon: FiDollarSign },
  { key: 'visited', Icon: FiHome },
  { key: 'fedIftar', Icon: IoRestaurantOutline },
  { key: 'dua', Icon: FiStar },
  { key: 'reconciled', Icon: FiHeart },
];

export default function ExtrasCard() {
  const { dailyLog, addExtra, toggleExtra, removeExtra, t } = useApp();
  const [inputVal, setInputVal] = useState('');

  if (!dailyLog) return null;
  const { extras } = dailyLog;

  function handleAdd() {
    const val = inputVal.trim();
    if (val) {
      addExtra(val);
      setInputVal('');
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <FiHeart className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">{t.goodDeeds}</h2>
      </div>

      {/* Suggestion chips — 2-column grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {DEED_SUGGESTIONS.map(({ key, Icon }) => (
          <button
            key={key}
            onClick={() => addExtra(t.suggestions[key])}
            className="flex items-center gap-2 text-sm px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-xl border border-amber-200 dark:border-amber-800/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors text-left font-medium"
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.suggestions[key]}</span>
          </button>
        ))}
      </div>

      {/* Add input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder={t.whatGoodDeed}
          className="flex-1 min-w-0 text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={handleAdd}
          disabled={!inputVal.trim()}
          className="shrink-0 w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 disabled:opacity-40 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
        </button>
      </div>

      {/* List */}
      {extras.length > 0 ? (
        <ul className="space-y-2">
          {extras.map(deed => (
            <li key={deed.id} className="flex items-center gap-3 group bg-gray-50 dark:bg-gray-800/50 rounded-xl px-3 py-2.5">
              <button
                onClick={() => toggleExtra(deed.id)}
                className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  deed.completed
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 hover:border-amber-400'
                }`}
              >
                {deed.completed && <FiCheck className="w-3.5 h-3.5" />}
              </button>
              <span className={`flex-1 text-sm font-medium ${deed.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                {deed.description}
              </span>
              <button
                onClick={() => removeExtra(deed.id)}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-300 dark:text-gray-600 hover:text-red-400 transition-all p-1 shrink-0"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-3">
          {t.whatGoodDeed}
        </p>
      )}
    </div>
  );
}
