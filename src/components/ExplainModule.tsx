import React, { useState } from 'react';
import { FileSearch, CheckCircle2, UserCheck, Shield, Copy, Check, Info, AlertCircle } from 'lucide-react';
import { ApplicationDecisionCase } from '../types';

interface ExplainModuleProps {
  currentCase: ApplicationDecisionCase;
  lang: 'ar' | 'en';
}

export const ExplainModule: React.FC<ExplainModuleProps> = ({ currentCase, lang }) => {
  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);

  const copyLegalStatement = () => {
    const text = isAr
      ? `منظومة يَحْيَى للحوكمة الأخلاقية | بيان التعليل والتفسير القانوني
رقم الملف: ${currentCase.id}
المتقدم: ${currentCase.applicantName}
الموضوع: ${currentCase.title}
تاريخ الفحص: ${currentCase.submittedAt}
المراجع البشري (HITL): ${currentCase.hitlReviewer || 'المكتب القانوني لمنظومة يحيى'}
المرجع القانوني: ${currentCase.legalSovereigntyClause}

ملخص التعليل الإنساني:
${currentCase.rejectionReasonSummary}`
      : `YAHYA Ethical AI Governance | Legal Statement of Reasons
Case ID: ${currentCase.id}
Applicant: ${currentCase.applicantName}
Subject: ${currentCase.titleEn}
Audit Date: ${currentCase.submittedAt}
HITL Reviewer: ${currentCase.hitlReviewer || 'YAHYA Legal Panel'}
Sovereignty Framework: ${currentCase.legalSovereigntyClause}

Human-Centered Explanation:
${currentCase.rejectionReasonSummaryEn}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
                {isAr ? 'المرحلة الثانية: التبيان (Explain)' : 'Phase 2: Tibyān (Transparent Explanation)'}
              </span>
              <span className="text-xs text-slate-400 font-mono">{currentCase.id}</span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-white">
              {isAr ? 'ترجمة قرارات الآلة إلى تعليل إنساني وقانوني واضح' : 'Explainability & Legal Justification Matrix'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
              {isAr
                ? 'لا يُقبل في منظومة يَحْيَى أي رفض مبهم أو قرار صامت. يحق لكل مستخدم معرفة الحيثيات التفصيلية وتفكيك المؤثرات الإيجابية والسلبية بدقة.'
                : 'Eliminates arbitrary black-box silence by delivering human-readable, legally verifiable factor-by-factor decision breakdowns.'}
            </p>
          </div>

          <button
            onClick={copyLegalStatement}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-300">{isAr ? 'تم النسخ بنجاح' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-amber-400" />
                <span>{isAr ? 'نسخ بيان التعليل القانوني' : 'Copy Legal Statement'}</span>
              </>
            )}
          </button>
        </div>

        {/* Human-in-the-Loop Sovereignty Box */}
        <div className="mt-6 rounded-xl border border-amber-500/25 bg-amber-950/20 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-200">
                  {isAr ? 'المراجعة البشرية المعتمدة (Human-in-the-Loop)' : 'Certified Human Reviewer (HITL)'}
                </p>
                <p className="text-xs text-slate-300">
                  {currentCase.hitlReviewer || (isAr ? 'لجنة الحوكمة السيادية' : 'Sovereign Governance Panel')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                {isAr ? 'تم التحقق من النزاهة' : 'Sovereignty Verified'}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-amber-300/80 border-t border-amber-500/15 pt-2">
            <span className="font-semibold">{isAr ? 'المرجع القانوني والحقوقي:' : 'Legal Sovereignty Basis:'} </span>
            {currentCase.legalSovereigntyClause}
          </p>
        </div>
      </div>

      {/* Decision Factors Breakdown */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-amber-400" />
          <span>{isAr ? 'مصفوفة العوامل والمؤثرات في القرار' : 'Factor Attribution Matrix'}</span>
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {currentCase.factors.map((factor) => {
            const isPositive = factor.impact === 'positive';
            const isPenalty = factor.isBlackBoxPenalty;

            return (
              <div
                key={factor.id}
                className={`rounded-xl border p-4 transition-all ${
                  isPenalty
                    ? 'border-rose-900/40 bg-rose-950/10'
                    : isPositive
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase mb-1.5 ${
                        isPenalty
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isPenalty
                        ? (isAr ? 'عقوبة خوارزمية جائرة' : 'Algorithmic Penalty')
                        : (isAr ? 'مؤشر جدارة واستحقاق' : 'Merit Indicator')}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {isAr ? factor.label : factor.labelEn}
                    </h4>
                  </div>

                  <div className="text-end">
                    <span className="text-xs text-slate-400">{isAr ? 'الوزن:' : 'Weight:'} </span>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {Math.round(factor.weight * 100)}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{isAr ? 'درجة التقييم الفردي:' : 'Sub-score:'}</span>
                  <span className={`font-mono font-bold ${factor.rawScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {factor.rawScore} / 100
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                  {isAr ? factor.explanation : factor.explanationEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
