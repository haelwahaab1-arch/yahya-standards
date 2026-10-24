import React, { useState } from 'react';
import { Scale, FileSearch, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { ApplicationDecisionCase } from '../types';
import { AuditModule } from './AuditModule';
import { ExplainModule } from './ExplainModule';
import { RevivalEngine } from './RevivalEngine';

interface AerSuiteProps {
  currentCase: ApplicationDecisionCase;
  onUpdateCase: (updatedCase: ApplicationDecisionCase) => void;
  cases: ApplicationDecisionCase[];
  onSelectCase: (caseId: string) => void;
  lang: 'ar' | 'en';
}

export const AerSuite: React.FC<AerSuiteProps> = ({
  currentCase,
  onUpdateCase,
  cases,
  onSelectCase,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [aerSubPhase, setAerSubPhase] = useState<'audit' | 'explain' | 'revival'>('audit');

  const phases = [
    {
      id: 'audit',
      number: '1',
      titleAr: 'الميزان (التدقيق وتطهير التحيز)',
      titleEn: '1. Mizān (Audit)',
      shortAr: '1. التدقيق (الميزان)',
      shortEn: '1. Audit',
      icon: Scale,
    },
    {
      id: 'explain',
      number: '2',
      titleAr: 'التبيان (التفسير والتعليل القانوني)',
      titleEn: '2. Tibyān (Explain)',
      shortAr: '2. التفسير (التبيان)',
      shortEn: '2. Explain',
      icon: FileSearch,
    },
    {
      id: 'revival',
      number: '3',
      titleAr: 'الإحياء (محرك إحياء الفرص)',
      titleEn: '3. Ihyā\' (Revival)',
      shortAr: '3. الإحياء (الفرص)',
      shortEn: '3. Revival',
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Active Case Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">
              {isAr ? 'الملف الجاري فحصه حالياً:' : 'Active Case Under Audit:'}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {isAr ? currentCase.title : currentCase.titleEn}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">{isAr ? 'تبديل الحالة:' : 'Switch Case:'}</label>
          <select
            value={currentCase.id}
            onChange={(e) => onSelectCase(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none cursor-pointer"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {isAr ? c.title : c.titleEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3-Step A.E.R Process Bar */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {phases.map((phase) => {
          const isActive = aerSubPhase === phase.id;
          const Icon = phase.icon;

          return (
            <button
              key={phase.id}
              onClick={() => setAerSubPhase(phase.id as any)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 rounded-2xl border p-3 sm:p-4 transition-all cursor-pointer text-center sm:text-start ${
                isActive
                  ? 'border-amber-500 bg-amber-500/15 shadow-md shadow-amber-500/10 text-amber-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-xs sm:text-sm font-bold">
                  {isAr ? phase.shortAr : phase.shortEn}
                </span>
                <span className="hidden md:block text-[11px] text-slate-500">
                  {isAr ? phase.titleAr.split('(')[1]?.replace(')', '') : phase.titleEn}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase View */}
      {aerSubPhase === 'audit' && (
        <AuditModule currentCase={currentCase} onUpdateCase={onUpdateCase} lang={lang} />
      )}

      {aerSubPhase === 'explain' && (
        <ExplainModule currentCase={currentCase} lang={lang} />
      )}

      {aerSubPhase === 'revival' && (
        <RevivalEngine currentCase={currentCase} onUpdateCase={onUpdateCase} lang={lang} />
      )}

      {/* Step Navigation Bar */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-6">
        <button
          disabled={aerSubPhase === 'audit'}
          onClick={() => {
            if (aerSubPhase === 'revival') setAerSubPhase('explain');
            else if (aerSubPhase === 'explain') setAerSubPhase('audit');
          }}
          className={`flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold transition-colors ${
            aerSubPhase === 'audit'
              ? 'opacity-40 cursor-not-allowed text-slate-600'
              : 'text-slate-300 hover:bg-slate-800 cursor-pointer'
          }`}
        >
          {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span>{isAr ? 'المرحلة السابقة' : 'Previous Stage'}</span>
        </button>

        <button
          disabled={aerSubPhase === 'revival'}
          onClick={() => {
            if (aerSubPhase === 'audit') setAerSubPhase('explain');
            else if (aerSubPhase === 'explain') setAerSubPhase('revival');
          }}
          className={`flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition-colors shadow-md ${
            aerSubPhase === 'revival'
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-amber-400 cursor-pointer'
          }`}
        >
          <span>{isAr ? 'المرحلة التالية' : 'Next Stage'}</span>
          {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};
