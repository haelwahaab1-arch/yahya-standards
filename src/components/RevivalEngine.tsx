import React, { useState } from 'react';
import { Award, CheckCircle2, ChevronRight, Sparkles, ArrowUpRight, ShieldCheck, Printer, Download, Clock } from 'lucide-react';
import { ApplicationDecisionCase, RevivalStep } from '../types';

interface RevivalEngineProps {
  currentCase: ApplicationDecisionCase;
  onUpdateCase: (updatedCase: ApplicationDecisionCase) => void;
  lang: 'ar' | 'en';
}

export const RevivalEngine: React.FC<RevivalEngineProps> = ({
  currentCase,
  onUpdateCase,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [showCertificate, setShowCertificate] = useState(false);

  // Compute base score (including debiased points if audit purified)
  let baseScore = currentCase.initialScore;
  currentCase.auditMetrics.forEach((m) => {
    if (m.purified) {
      const bonus = m.severity === 'critical' ? 14 : m.severity === 'high' ? 10 : 6;
      baseScore = Math.min(100, baseScore + bonus);
    }
  });

  // Calculate points from completed revival roadmap steps
  let completedPoints = 0;
  currentCase.revivalRoadmap.forEach((step) => {
    if (step.completed) {
      completedPoints += step.impactScoreIncrease;
    }
  });

  const simulatedFinalScore = Math.min(100, baseScore + completedPoints);
  const isApproved = simulatedFinalScore >= currentCase.passThreshold;

  const toggleStepCompletion = (stepId: string) => {
    const updatedRoadmap = currentCase.revivalRoadmap.map((s) =>
      s.id === stepId ? { ...s, completed: !s.completed } : s
    );

    onUpdateCase({
      ...currentCase,
      revivalRoadmap: updatedRoadmap,
    });
  };

  const completeAllSteps = () => {
    const updated = currentCase.revivalRoadmap.map((s) => ({ ...s, completed: true }));
    onUpdateCase({
      ...currentCase,
      revivalRoadmap: updated,
    });
  };

  return (
    <div className="space-y-6">
      {/* Principle Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-950 p-6 shadow-lg shadow-amber-500/10">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl"></div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-400 px-2.5 py-1 text-xs font-bold text-slate-950">
                {isAr ? 'المرحلة الثالثة: الإحياء (Revival)' : 'Phase 3: Ihyā\' (Opportunity Revival)'}
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-amber-300 font-mono">
                {isAr ? 'المبدأ الحاكم لمنظومة يحيى' : 'Core Governing Doctrine'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {isAr ? 'لا يوجد "رفض نهائي" في منظومة يَحْيَى' : 'The "No Final Rejection" Doctrine'}
            </h2>

            <p className="text-xs sm:text-sm text-amber-100/80 max-w-2xl leading-relaxed">
              {isAr
                ? 'كل قرار سلبي يُرفق تلقائياً بـ "خارطة طريق إحيائية" (Roadmap) توضح للمستخدم الخطوات العملية الدقيقة المطلوبة لترميم الانكسار وتحويل الرفض إلى قبول واستحقاق كامل.'
                : 'Every automated rejection is paired with an actionable, step-by-step roadmap to repair deficiencies and guide the applicant toward full qualification.'}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl bg-slate-950/80 p-4 border border-amber-500/30 min-w-[160px]">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? 'الدرجة المتوقعة بعد الإحياء' : 'Simulated Score'}
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span
                className={`text-3xl font-extrabold font-mono ${
                  isApproved ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {simulatedFinalScore}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <span
              className={`mt-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                isApproved
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {isApproved
                ? (isAr ? 'مؤهل للقبول الفوري' : 'Revived & Approved')
                : (isAr ? `متبقي ${currentCase.passThreshold - simulatedFinalScore} نقطة` : `${currentCase.passThreshold - simulatedFinalScore} pts needed`)}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-amber-500/20 pt-4">
          <button
            onClick={completeAllSteps}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all cursor-pointer shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isAr ? 'إنجاز كافة خطوات خارطة الطريق' : 'Complete All Steps'}</span>
          </button>

          {isApproved && (
            <button
              onClick={() => setShowCertificate(!showCertificate)}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500 bg-emerald-950/40 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/60 transition-all cursor-pointer"
            >
              <Award className="h-4 w-4 text-emerald-400" />
              <span>{isAr ? 'عرض شهادة إحياء الفرصة والعدالة' : 'View Revival Certificate'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Certificate Modal / View */}
      {showCertificate && (
        <div className="rounded-2xl border-2 border-amber-500/60 bg-gradient-to-b from-slate-950 to-slate-900 p-6 sm:p-8 shadow-2xl relative">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300">
              <Award className="h-8 w-8" />
            </div>

            <span className="inline-block rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-300 font-mono border border-amber-500/30">
              CERT-YAHYA-2026-REVIVAL
            </span>

            <h3 className="font-quran text-2xl sm:text-3xl font-bold text-amber-200">
              {isAr ? 'شهادة إحياء الفرصة والسيادة الرقمية' : 'Certificate of Algorithmic Opportunity Revival'}
            </h3>

            <p className="font-quran text-sm text-amber-300/80">
              {isAr
                ? '﴿إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ﴾ — إقامة العدل بالرفق والمحبة'
                : 'Upholding Digital Justice, Equity, and Restorative Dignity'}
            </p>

            <div className="mx-auto max-w-xl rounded-xl border border-slate-800 bg-slate-950/90 p-4 text-xs sm:text-sm text-slate-200 space-y-2 text-start">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">{isAr ? 'صاحب الطلب المستفيد:' : 'Beneficiary:'}</span>
                <span className="font-bold text-white">{currentCase.applicantName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">{isAr ? 'المعاملة والملف:' : 'Case Subject:'}</span>
                <span className="font-bold text-amber-300">{isAr ? currentCase.title : currentCase.titleEn}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">{isAr ? 'الدرجة المكتسبة بعد الإحياء:' : 'Revived Score:'}</span>
                <span className="font-bold text-emerald-400 font-mono text-base">{simulatedFinalScore} / 100 (مقبول)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isAr ? 'المعمار القانوني والفكري:' : 'Lead Architect:'}</span>
                <span className="text-slate-300">هشام فتحي عبد الوهاب (مؤسس منظومة يَحْيَى)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic max-w-md mx-auto">
              {isAr
                ? 'تم تسجيل هذه الشهادة الرقمية بنفخة الإخلاص والشهود وحفظ السيادة البشرية ضد قرارات الصندوق الأسود.'
                : 'Formally sealed under the YAHYA Sovereign Protocol for algorithmic restorative fairness.'}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Roadmap Steps */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ChevronRight className="h-5 w-5 text-amber-400" />
          <span>{isAr ? 'خطوات خارطة طريق إحياء الفرصة' : 'Actionable Opportunity Roadmap Steps'}</span>
        </h3>

        <div className="space-y-3">
          {currentCase.revivalRoadmap.map((step) => {
            const isCompleted = step.completed;
            return (
              <div
                key={step.id}
                onClick={() => toggleStepCompletion(step.id)}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-5 transition-all cursor-pointer ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/15'
                    : 'border-slate-800 bg-slate-900/70 hover:border-amber-500/40 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isCompleted
                        ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                        : 'border-slate-600 bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-mono">{step.order}</span>}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-sm font-bold ${isCompleted ? 'text-emerald-300 line-through' : 'text-white'}`}>
                        {isAr ? step.title : step.titleEn}
                      </h4>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                        {step.estimatedEffort}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isAr ? step.description : step.descriptionEn}
                    </p>

                    <p className="text-xs text-amber-300/90 font-medium">
                      <span className="font-semibold">{isAr ? 'الإجراء المطلوب:' : 'Action Required:'} </span>
                      {isAr ? step.requiredAction : step.requiredActionEn}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0 shrink-0">
                  <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    +{step.impactScoreIncrease} {isAr ? 'نقطة' : 'pts'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    {isCompleted ? (isAr ? 'مكتمل' : 'Completed') : (isAr ? 'انقر للإكمال' : 'Click to complete')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
