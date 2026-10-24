import React, { useState } from 'react';
import { Compass, Briefcase, GraduationCap, Building2, User, ArrowRight, PlusCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ApplicationDecisionCase } from '../types';

interface ScenarioSimulatorProps {
  cases: ApplicationDecisionCase[];
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  onNavigateToAer: (tab?: string) => void;
  onAddNewCase: (newCase: ApplicationDecisionCase) => void;
  lang: 'ar' | 'en';
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  onNavigateToAer,
  onAddNewCase,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newApplicant, setNewApplicant] = useState('');
  const [newDomain, setNewDomain] = useState<'financing' | 'recruitment' | 'education' | 'public_service'>('financing');
  const [newScore, setNewScore] = useState(55);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newApplicant.trim()) return;

    const newCaseItem: ApplicationDecisionCase = {
      id: `CASE-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      titleEn: newTitle,
      domain: newDomain,
      applicantName: newApplicant,
      submittedAt: new Date().toISOString().split('T')[0],
      initialOutcome: 'rejected',
      initialScore: Number(newScore),
      passThreshold: 75,
      rejectionReasonSummary: isAr
        ? 'تم الرفض آلياً بواسطة خوارزمية التقييم الأولية بسبب رصد انخفاض في المؤشرات الإحصائية العامة.'
        : 'Automated rejection triggered by initial ranking heuristics pending A.E.R audit.',
      rejectionReasonSummaryEn: 'Automated rejection triggered by initial ranking heuristics pending A.E.R audit.',
      auditMetrics: [
        {
          id: 'B1',
          name: isAr ? 'تحيز النمط الإحصائي المركزي' : 'Statistical Baseline Bias',
          nameEn: 'Statistical Baseline Bias',
          category: 'socioeconomic',
          severity: 'high',
          detectedWeight: 0.25,
          purifiedWeight: 0.05,
          description: isAr ? 'النموذج يعاقب الحالات غير النمطية.' : 'Model penalizes non-standard application profiles.',
          descriptionEn: 'Model penalizes non-standard application profiles.',
          mitigationAction: isAr ? 'تطبيق فلتر ميزان يَحْيَى للتقييم الموضوعي.' : 'Apply YAHYA Mizān debiasing filter.',
          mitigationActionEn: 'Apply YAHYA Mizān debiasing filter.',
          purified: false,
        }
      ],
      factors: [
        {
          id: 'F1',
          label: isAr ? 'مؤشر الكفاءة المباشرة' : 'Direct Competency Score',
          labelEn: 'Direct Competency Score',
          rawScore: 85,
          weight: 0.5,
          impact: 'positive',
          explanation: isAr ? 'إمكانات ممتازة ومثبتة عملياً.' : 'Verified high competency metrics.',
          explanationEn: 'Verified high competency metrics.',
        },
        {
          id: 'F2',
          label: isAr ? 'عقوبة التصنيف الآلي' : 'Algorithmic Penalty Modifier',
          labelEn: 'Algorithmic Penalty Modifier',
          rawScore: 25,
          weight: 0.5,
          impact: 'negative',
          isBlackBoxPenalty: true,
          explanation: isAr ? 'خصم خوارزمي غير مبرر قانونياً.' : 'Unjustified algorithmic penalty.',
          explanationEn: 'Unjustified algorithmic penalty.',
        }
      ],
      revivalRoadmap: [
        {
          id: 'R1',
          order: 1,
          title: isAr ? 'تطهير التحيز وتحديث معايير الجدارة' : 'Debias Scoring Criteria',
          titleEn: 'Debias Scoring Criteria',
          category: 'governance_clarification',
          description: isAr ? 'إعادة ضبط أوزان القرار لتعتمد حصرياً على الجدارة.' : 'Calibrate weights exclusively to merit.',
          descriptionEn: 'Calibrate weights exclusively to merit.',
          requiredAction: isAr ? 'إلغاء معامل العقوبة الآلي.' : 'Remove automated penalty coefficient.',
          requiredActionEn: 'Remove automated penalty coefficient.',
          estimatedEffort: isAr ? 'فوري' : 'Instant',
          impactScoreIncrease: 15,
          completed: false,
        },
        {
          id: 'R2',
          order: 2,
          title: isAr ? 'تقديم الوثائق الداعمة المعززة' : 'Submit Supplementary Verifications',
          titleEn: 'Submit Supplementary Verifications',
          category: 'documentary',
          description: isAr ? 'رفع شهادات الأداء الفعلي لإتمام الاستحقاق.' : 'Provide certified performance audits.',
          descriptionEn: 'Provide certified performance audits.',
          requiredAction: isAr ? 'رفع التقرير المعتمد.' : 'Upload certified report.',
          requiredActionEn: 'Upload certified performance report.',
          estimatedEffort: isAr ? 'يومان' : '2 days',
          impactScoreIncrease: 10,
          completed: false,
        }
      ],
      hitlReviewer: isAr ? 'أ. هشام فتحي عبد الوهاب' : 'Hisham Abdelwahab',
      hitlStatus: 'verified_fair',
      legalSovereigntyClause: isAr ? 'مستند لميثاق يحيى للسيادة الرقمية 2026' : 'YAHYA Sovereign Digital Justice Framework',
    };

    onAddNewCase(newCaseItem);
    onSelectCase(newCaseItem.id);
    setShowNewModal(false);
    setNewTitle('');
    setNewApplicant('');
  };

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'financing':
        return Building2;
      case 'recruitment':
        return Briefcase;
      case 'education':
        return GraduationCap;
      default:
        return User;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
              {isAr ? 'مختبر المحاكاة والسيناريوهات' : 'Decision Simulation Sandbox'}
            </span>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-white">
              {isAr ? 'حالات دراسية لاختبار العدالة الخوارزمية' : 'Case Studies & AI Audit Scenarios'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              {isAr
                ? 'اختر أحد الملفات التطبيقية لفحص كيفية تفكيك التحيز وتطبيق بروتوكول A.E.R (الميزان، التبيان، الإحياء).'
                : 'Select an application case to run the full A.E.R audit, explanation, and revival cycle.'}
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all cursor-pointer shadow-md self-start sm:self-center"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{isAr ? 'إدراج حالة تجريبية جديدة' : 'Add New Test Case'}</span>
          </button>
        </div>
      </div>

      {/* Case Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cases.map((c) => {
          const isSelected = c.id === selectedCaseId;
          const Icon = getDomainIcon(c.domain);
          const purifiedBiases = c.auditMetrics.filter((m) => m.purified).length;
          const totalBiases = c.auditMetrics.length;

          return (
            <div
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className={`rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-amber-500 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                  : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-amber-300 border border-slate-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-slate-400">{c.id}</span>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-2">
                  {isAr ? c.title : c.titleEn}
                </h3>

                <p className="text-xs text-amber-300/80 font-medium">
                  {c.applicantName}
                </p>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {isAr ? c.rejectionReasonSummary : c.rejectionReasonSummaryEn}
                </p>
              </div>

              <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>{isAr ? 'الدرجة الأولية:' : 'Initial Score:'}</span>
                  <span className="font-mono font-bold text-rose-400">{c.initialScore} / 100</span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>{isAr ? 'التحيزات المزكاة:' : 'Purified Biases:'}</span>
                  <span className="font-mono font-bold text-amber-300">
                    {purifiedBiases} / {totalBiases}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCase(c.id);
                    onNavigateToAer('aer-suite');
                  }}
                  className={`w-full mt-2 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{isAr ? 'تشغيل بروتوكول A.E.R' : 'Launch A.E.R Protocol'}</span>
                  <ArrowRight className={`h-3 w-3 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Case Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              {isAr ? 'إدراج حالة قرار جديدة للمحاكاة' : 'Add New Decision Simulation Case'}
            </h3>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {isAr ? 'عنوان الملف / موضوع المعاملة' : 'Case Subject / Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: طلب اعتماد منحة بحثية للذكاء الاصطناعي' : 'e.g. AI Research Grant Application'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {isAr ? 'اسم صاحب الطلب / الكيان' : 'Applicant Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newApplicant}
                  onChange={(e) => setNewApplicant(e.target.value)}
                  placeholder={isAr ? 'مثال: الباحثة / مريم الكردي' : 'e.g. Dr. Mariam El-Kurdi'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {isAr ? 'مجال القرار' : 'Domain'}
                  </label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="financing">{isAr ? 'تمويل وائتمان' : 'Financing & Credit'}</option>
                    <option value="recruitment">{isAr ? 'توظيف وموارد بشرية' : 'Recruitment & HR'}</option>
                    <option value="education">{isAr ? 'تعليم ومنح' : 'Education & Grants'}</option>
                    <option value="public_service">{isAr ? 'خدمات عامة وإسكان' : 'Public Services'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {isAr ? 'الدرجة الخوارزمية الأولية (0-100)' : 'Initial Score'}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="74"
                    value={newScore}
                    onChange={(e) => setNewScore(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100 focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-4 py-2 font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-md"
                >
                  {isAr ? 'إضافة وبدء التدقيق' : 'Create & Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
