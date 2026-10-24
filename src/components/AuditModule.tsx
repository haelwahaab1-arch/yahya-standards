import React from 'react';
import { ShieldAlert, CheckCircle2, Sparkles, AlertTriangle, ArrowRight, RefreshCw, BarChart2, Cpu } from 'lucide-react';
import { ApplicationDecisionCase, BiasAuditMetric } from '../types';

interface AuditModuleProps {
  currentCase: ApplicationDecisionCase;
  onUpdateCase: (updatedCase: ApplicationDecisionCase) => void;
  lang: 'ar' | 'en';
}

export const AuditModule: React.FC<AuditModuleProps> = ({
  currentCase,
  onUpdateCase,
  lang,
}) => {
  const isAr = lang === 'ar';

  const togglePurifyMetric = (metricId: string) => {
    const updatedMetrics = currentCase.auditMetrics.map((m) =>
      m.id === metricId ? { ...m, purified: !m.purified } : m
    );

    // Calculate updated score based on purified metrics
    let recalculatedScore = currentCase.initialScore;
    updatedMetrics.forEach((m) => {
      if (m.purified) {
        // Recover points proportional to severity
        const bonus = m.severity === 'critical' ? 14 : m.severity === 'high' ? 10 : 6;
        recalculatedScore = Math.min(100, recalculatedScore + bonus);
      }
    });

    const isNowPassing = recalculatedScore >= currentCase.passThreshold;

    onUpdateCase({
      ...currentCase,
      auditMetrics: updatedMetrics,
      initialOutcome: isNowPassing ? 'under_review' : 'rejected',
    });
  };

  const purifyAll = () => {
    const allPurified = currentCase.auditMetrics.map((m) => ({ ...m, purified: true }));
    let calculated = currentCase.initialScore;
    allPurified.forEach((m) => {
      const bonus = m.severity === 'critical' ? 14 : m.severity === 'high' ? 10 : 6;
      calculated = Math.min(100, calculated + bonus);
    });

    onUpdateCase({
      ...currentCase,
      auditMetrics: allPurified,
      initialOutcome: calculated >= currentCase.passThreshold ? 'under_review' : 'rejected',
    });
  };

  const resetAudit = () => {
    const resetMetrics = currentCase.auditMetrics.map((m) => ({ ...m, purified: false }));
    onUpdateCase({
      ...currentCase,
      auditMetrics: resetMetrics,
      initialOutcome: 'rejected',
    });
  };

  const purifiedCount = currentCase.auditMetrics.filter((m) => m.purified).length;
  const totalBiases = currentCase.auditMetrics.length;
  const purificationPercentage = totalBiases > 0 ? Math.round((purifiedCount / totalBiases) * 100) : 100;

  // Calculate current score with active debiasing
  let dynamicScore = currentCase.initialScore;
  currentCase.auditMetrics.forEach((m) => {
    if (m.purified) {
      const bonus = m.severity === 'critical' ? 14 : m.severity === 'high' ? 10 : 6;
      dynamicScore = Math.min(100, dynamicScore + bonus);
    }
  });

  return (
    <div className="space-y-6">
      {/* Header & Status Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
                {isAr ? 'المرحلة الأولى: الميزان (Audit)' : 'Phase 1: Mizān (Algorithmic Audit)'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentCase.id}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-white">
              {isAr ? 'تفكيك الصندوق الأسود وتطهير التحيزات الخوارزمية' : 'Black-Box Deconstruction & Bias Purification'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
              {isAr
                ? 'فحص نموذج القرار الآلي للكشف عن الأوزان التمييزية الخفية (الجغرافية، الاجتماعية، أو التحيزات التاريخية) وإعادة معايرتها وفق ميزان العدل والجدارة.'
                : 'Scrutinizes black-box algorithmic weights to expose and neutralize geographic, demographic, and legacy statistical penalties.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={purifyAll}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isAr ? 'تطهير كافة التحيزات' : 'Purify All Biases'}</span>
            </button>
            <button
              onClick={resetAudit}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
              title="Reset"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Score Bar & Metrics Summary */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-slate-800 pt-6">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{isAr ? 'الدرجة بعد التطهير' : 'Score (Post-Purification)'}</span>
              <span className={`font-bold ${dynamicScore >= currentCase.passThreshold ? 'text-emerald-400' : 'text-amber-400'}`}>
                {dynamicScore} / 100
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full transition-all duration-500 ${
                  dynamicScore >= currentCase.passThreshold
                    ? 'bg-gradient-to-r from-amber-400 to-emerald-400'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${dynamicScore}%` }}
              ></div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>{isAr ? 'الحد الأدنى للقبول:' : 'Threshold:'} {currentCase.passThreshold}</span>
              <span>
                {dynamicScore >= currentCase.passThreshold
                  ? isAr ? '✅ اجتاز حد الأمان' : '✅ Met Threshold'
                  : isAr ? '⚠️ يتطلب إحياء الفرصة' : '⚠️ Requires Revival'}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{isAr ? 'نسبة تزكية الخوارزمية' : 'Purification Level'}</span>
              <span className="font-bold text-amber-300 font-mono">{purificationPercentage}%</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-amber-400 transition-all duration-500"
                style={{ width: `${purificationPercentage}%` }}
              ></div>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              {purifiedCount} {isAr ? 'من أصل' : 'of'} {totalBiases} {isAr ? 'تحيزات تم إبطالها بنجاح' : 'biases neutralized'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{isAr ? 'الامتثال للمعايير الدولية' : 'EU AI Act Compliance'}</span>
              <span className="font-bold text-emerald-400">
                {purifiedCount === totalBiases ? (isAr ? 'متوافق 100%' : 'Compliant') : (isAr ? 'جزئي' : 'Partial')}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              {isAr ? 'حظر التطفيف الرقمي (المادة 10)' : 'High-Risk AI Debiasing (Art 10)'}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {isAr ? 'مساءلة قانونية مشفرة وغير قابلة للتراجع' : 'Auditable & legally defensible'}
            </p>
          </div>
        </div>
      </div>

      {/* List of Detected Biases */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-400" />
          <span>{isAr ? 'التحيزات المرصودة في القرار الآلي' : 'Detected Algorithmic Biases in Model'}</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {currentCase.auditMetrics.map((metric) => {
            const isPurified = metric.purified;
            return (
              <div
                key={metric.id}
                className={`rounded-xl border p-5 transition-all ${
                  isPurified
                    ? 'border-emerald-500/40 bg-emerald-950/15 shadow-sm'
                    : 'border-rose-900/40 bg-slate-900/80 hover:border-amber-500/40'
                }`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase ${
                          metric.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : metric.severity === 'high'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        {isAr ? `خطورة: ${metric.severity}` : `Severity: ${metric.severity}`}
                      </span>

                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400 font-mono">
                        {metric.category}
                      </span>

                      {isPurified && (
                        <span className="flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/40">
                          <CheckCircle2 className="h-3 w-3" />
                          {isAr ? 'تم التطهير والتزكية' : 'Purified & Calibrated'}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white">
                      {isAr ? metric.name : metric.nameEn}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {isAr ? metric.description : metric.descriptionEn}
                    </p>

                    {/* Weight Comparison */}
                    <div className="mt-3 flex flex-wrap items-center gap-4 rounded-lg bg-slate-950/80 p-3 border border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-500">{isAr ? 'الوزن الخام المجحف:' : 'Raw Unfair Weight:'} </span>
                        <span className="font-mono font-bold text-rose-400">
                          {Math.round(metric.detectedWeight * 100)}%
                        </span>
                      </div>
                      <ArrowRight className={`h-3 w-3 text-slate-500 ${isAr ? 'rotate-180' : ''}`} />
                      <div>
                        <span className="text-slate-500">{isAr ? 'الوزن المزكّى بعد الميزان:' : 'Fair Target Weight:'} </span>
                        <span className="font-mono font-bold text-emerald-400">
                          {Math.round(metric.purifiedWeight * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Mitigation Protocol */}
                    <div className="rounded-lg bg-amber-950/20 border border-amber-500/20 p-3 text-xs text-amber-200/90">
                      <span className="font-bold text-amber-300">{isAr ? 'إجراء المعالجة والتزكية:' : 'Mitigation Action:'} </span>
                      {isAr ? metric.mitigationAction : metric.mitigationActionEn}
                    </div>
                  </div>

                  {/* Toggle Action */}
                  <div className="md:self-center">
                    <button
                      onClick={() => togglePurifyMetric(metric.id)}
                      className={`w-full md:w-auto flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                        isPurified
                          ? 'border border-emerald-500/50 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                          : 'border border-amber-500/50 bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md'
                      }`}
                    >
                      {isPurified ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{isAr ? 'إعادة فرض التحيز' : 'Revert Bias'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>{isAr ? 'تفعيل فلتر التطهير' : 'Apply Purifier'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
