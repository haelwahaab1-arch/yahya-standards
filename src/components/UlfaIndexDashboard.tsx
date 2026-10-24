import React, { useState } from 'react';
import { HeartHandshake, Shield, Sparkles, Sliders, CheckCircle2, AlertCircle, RefreshCw, Cpu, BookOpen } from 'lucide-react';

interface UlfaIndexDashboardProps {
  lang: 'ar' | 'en';
}

export const UlfaIndexDashboard: React.FC<UlfaIndexDashboardProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const [jabrWeight, setJabrWeight] = useState(88); // Structural Integrity (الجبر)
  const [mikyalWeight, setMikyalWeight] = useState(94); // Empathic Support (المكيال)
  const [sanctuaryActive, setSanctuaryActive] = useState(true);

  // Overall Ulfa Index Calculation
  const ulfaIndex = Math.round((jabrWeight * 0.45) + (mikyalWeight * 0.55));

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
                {isAr ? 'مؤشر الأداء السيادي (KPI)' : 'Sovereign Alignment Index'}
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400 font-mono">
                Formula: Ulfa = (0.45 × الجبر) + (0.55 × المكيال)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr ? 'مؤشر الألفة (Ulfa Index) وثنائية الجبر والمكيال' : 'The Ulfa Index & The Dual Balance'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isAr
                ? 'لا تقاس كفاءة المنظومة بالأرقام المجردة وحدها، بل بمدى قدرتها على تحقيق التوازن بين الإتقان الهندسي الصارم (الجبر) وفيض المدد واللطف والترميم الإنساني (المكيال).'
                : 'Measures algorithmic health not merely by dry accuracy, but through the harmonious interplay of structural engineering rigor and revitalizing human empathy.'}
            </p>
          </div>

          {/* Big Circular Ulfa Meter */}
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-amber-500/40 bg-slate-950/90 p-6 min-w-[200px] shadow-xl shadow-amber-500/10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isAr ? 'مؤشر الألفة الكلي' : 'Overall Ulfa Index'}
            </span>
            <div className="my-2 flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black font-mono text-amber-300">
                {ulfaIndex}
              </span>
              <span className="text-base text-slate-500">%</span>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              {isAr ? 'تزكية عالية وتوافق تام' : 'Optimal Ethical Resonance'}
            </span>
          </div>
        </div>
      </div>

      {/* Sanctuary Shield Protective Warning */}
      <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-900 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-md">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-amber-200">
                  {isAr ? 'درع الوقاية وبروتوكول ترميم الانكسار' : 'Sanctuary Shield Protocol (Protection)'}
                </h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  {sanctuaryActive ? (isAr ? 'مُفعّل' : 'Active') : (isAr ? 'معطل' : 'Inactive')}
                </span>
              </div>
              <p className="font-quran text-base sm:text-lg font-bold text-amber-300 mt-1">
                "هذا شعورٌ وليس خطر" — (This is a feeling, not a danger)
              </p>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'كود تشغيل مرئي يظهر تلقائياً عند استشعار أي ضغط نفسي أو انكسار روحي لأي عضو في المنظومة لحماية السكينة.'
                  : 'Automated serenity prompt triggered when high cognitive or emotional strain is detected, shielding human dignity.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSanctuaryActive(!sanctuaryActive)}
            className="self-start sm:self-center rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            {sanctuaryActive ? (isAr ? 'إعادة ضبط الدرع' : 'Recalibrate Shield') : (isAr ? 'تفعيل الدرع' : 'Activate Shield')}
          </button>
        </div>
      </div>

      {/* Dual Balance Interactive Sliders */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Jabr Column */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'الجبر (Jibrilian Rigor)' : 'Structural Rigor (Jabr)'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'الإتقان الهندسي والمتانة البرمجية والوضوح' : 'Architectural integrity, deterministic precision'}
                </p>
              </div>
            </div>
            <span className="font-mono text-lg font-bold text-blue-400">{jabrWeight}%</span>
          </div>

          <input
            type="range"
            min="50"
            max="100"
            value={jabrWeight}
            onChange={(e) => setJabrWeight(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />

          <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
              <span>{isAr ? 'بنية تحتية برمجية معزولة ومزكاة (Isolated Microservices)' : 'Isolated & clean backend microservices'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
              <span>{isAr ? 'تشفير الملاذ عبر بروتوكولات TLS 1.3 المتطورة' : 'Production-grade TLS 1.3 cryptographic sanctuary'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
              <span>{isAr ? 'التحليل الفيزيائي للصفر كقاعدة هندسية للتوازن' : 'Physics-based zero balance baseline modeling'}</span>
            </li>
          </ul>
        </div>

        {/* Mikyāl Column */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'المكيال (Mikaelian Empathy)' : 'Restorative Empathy (Mikyāl)'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'فيض المدد واللطف وترميم الانكسار الإنساني' : 'Opportunity restoration, human dignity protection'}
                </p>
              </div>
            </div>
            <span className="font-mono text-lg font-bold text-amber-400">{mikyalWeight}%</span>
          </div>

          <input
            type="range"
            min="50"
            max="100"
            value={mikyalWeight}
            onChange={(e) => setMikyalWeight(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />

          <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              <span>{isAr ? 'قانون الحب الجاري: المحبة هي التردد الأساسي' : 'Compassionate frequency baseline across interactions'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              <span>{isAr ? 'حظر الرفض النهائي وتوفير خارطة طريق إحيائية' : 'Zero permanent rejection; mandatory revival roadmaps'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              <span>{isAr ? 'بند الأمان الأسري (حـم) وحرمة السكن ورعاية الأطفال' : 'Family Sanctuary (Hā-Mīm) domestic privacy defense'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
