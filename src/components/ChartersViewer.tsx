import React, { useState } from 'react';
import { BookOpen, Copy, Check, Shield, FileText, Download, Award, Feather } from 'lucide-react';
import { FOUNDATION_CHARTERS } from '../data/governanceData';

interface ChartersViewerProps {
  lang: 'ar' | 'en';
}

export const ChartersViewer: React.FC<ChartersViewerProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [selectedCharterId, setSelectedCharterId] = useState(FOUNDATION_CHARTERS[0].id);
  const [copied, setCopied] = useState(false);

  const selectedCharter = FOUNDATION_CHARTERS.find((c) => c.id === selectedCharterId) || FOUNDATION_CHARTERS[0];

  const copyCurrentCharter = () => {
    const text = isAr ? selectedCharter.content : selectedCharter.contentEn;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
              {isAr ? 'المراجع التشريعية والفلسفية' : 'Foundational Sovereign Charters'}
            </span>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-white">
              {isAr ? 'دستور منظومة يَحْيَى والرخص السيادية' : 'YAHYA Sovereign Constitutions & Open License'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              {isAr
                ? 'الأسس القانونية والأخلاقية التي تحكم تطوير الخوارزميات وتحصن كرامة الإنسان ضد الوثنية الرقمية.'
                : 'Binding moral and legal frameworks translating ethics into operational code.'}
            </p>
          </div>

          <button
            onClick={copyCurrentCharter}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-300">{isAr ? 'تم النسخ' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-amber-400" />
                <span>{isAr ? 'نسخ نص الوثيقة' : 'Copy Charter Text'}</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Selection */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
          {FOUNDATION_CHARTERS.map((charter) => {
            const isSelected = charter.id === selectedCharterId;
            return (
              <button
                key={charter.id}
                onClick={() => setSelectedCharterId(charter.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>{isAr ? charter.title : charter.titleEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Charter Body */}
      <div className="rounded-2xl border border-amber-500/30 bg-slate-950/90 p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Banner with Verse & Motto */}
        <div className="border-b border-amber-500/20 pb-6 text-center space-y-2">
          <span className="inline-block rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
            {isAr ? selectedCharter.badge : selectedCharter.badgeEn}
          </span>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {isAr ? selectedCharter.title : selectedCharter.titleEn}
          </h3>

          <p className="font-quran text-lg sm:text-xl font-bold text-amber-200">
            {selectedCharter.verse}
          </p>

          <p className="text-xs sm:text-sm font-semibold text-amber-400">
            {isAr ? selectedCharter.motto : selectedCharter.mottoEn}
          </p>
        </div>

        {/* Core Content */}
        <div className="prose prose-invert max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-slate-900/50 p-5 rounded-xl border border-slate-800">
          {isAr ? selectedCharter.content : selectedCharter.contentEn}
        </div>

        {/* Pillars / Articles */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>{isAr ? 'البنود والأركان السيادية الملزمة' : 'Binding Sovereign Clauses'}</span>
          </h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {selectedCharter.pillars.map((pillar, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-1.5">
                <h5 className="text-xs sm:text-sm font-bold text-white">
                  {isAr ? pillar.title : pillar.titleEn}
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAr ? pillar.desc : pillar.titleEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-off Seal */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400 gap-2">
          <div>
            <span className="font-bold text-slate-300">{isAr ? 'جهة الاعتماد:' : 'Authority:'} </span>
            {isAr ? 'المكتب القانوني والروحي لمنظومة YAHYA' : 'YAHYA Legal & Ethical Governance Office'}
          </div>
          <div>
            <span className="font-bold text-slate-300">{isAr ? 'المعمار المسؤول:' : 'Architect:'} </span>
            هشام فتحي عبد الوهاب (Hisham Abdelwahab)
          </div>
        </div>
      </div>
    </div>
  );
};
