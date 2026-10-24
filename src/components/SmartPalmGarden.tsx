import React, { useState } from 'react';
import { TreePine, Landmark, Sparkles, Shield, HeartHandshake, FileCheck, Layers, MapPin, Copy, Check } from 'lucide-react';

interface SmartPalmGardenProps {
  lang: 'ar' | 'en';
}

export const SmartPalmGarden: React.FC<SmartPalmGardenProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);

  const pillars = [
    {
      num: '1',
      titleAr: '1. الواجهة السيادية (رسالة التقديم وعائد الأوقاف)',
      titleEn: '1. Sovereign Vision & Endowment Yield',
      descAr: 'تحويل أرض الوقف إلى مشكاة نور تعتمد على التوكل كمحرك أساسي، مع تعظيم العائد الاقتصادي للهيئة بنسبة 60% من صافي الأرباح، مع الالتزام بالبُعد الأخلاقي والقانوني.',
      descEn: 'Transforms endowment land into an ethical beacon while optimizing returns to the Egyptian Awqaf Authority at 60% net share.'
    },
    {
      num: '2',
      titleAr: '2. التقسيم المكاني والخدمي (المنحة من رحم المحنة)',
      titleEn: '2. Spatial & Social Architecture (Family Sanctuary)',
      descAr: 'يشمل: محور النخيل (دمج الطبيعة بالتكنولوجيا)، الممرات المتوهجة (مسارات آمنة تضيء بنور هادئ)، و"ركن العائلة" المجهز مجاناً لإنفاذ أحكام الرؤية بكرامة إنسانية.',
      descEn: 'Features: Date Palm Axis, Serenity Pathways, and the dedicated free Family Sanctuary area designed to honor parental visitation rights with supreme dignity.'
    },
    {
      num: '3',
      titleAr: '3. المحصن القانوني (النص الذكي وشراكة الجبر والمكيال)',
      titleEn: '3. Legal Fortress (Smart Contracts & Dual Balance)',
      descAr: 'صياغة عقد الشراكة وحق الانتفاع وفق معيار "ثنائية الجبر والمكيال"، واعتماد مؤشر الألفة (Ulfa Index) لتقييم نجاح المشروع وربط المعاملات بنظام محاسبي ذكي.',
      descEn: 'Structures the partnership using the Dual Balance standard, binding transparent financial accounting to the Ulfa Alignment Index.'
    },
    {
      num: '4',
      titleAr: '4. ميثاق الكرامة (شروط السيادة الرقمية)',
      titleEn: '4. Dignity Covenant (Digital Sovereignty)',
      descAr: 'توفير بيئة آمنة تكنولوجياً واجتماعياً عبر "بوابة يحيى"، وتفعيل بروتوكول "هذا شعور وليس خطر" لحماية الزوار والأعضاء من أي ضغط أو استعلاء.',
      descEn: 'Guarantees digital privacy and serene environment through Yahya Gate and the automated protective prompt "This is a feeling, not a danger".'
    },
    {
      num: '5',
      titleAr: '5. الأمانة والكفاءة (الباحث والمنظومة)',
      titleEn: '5. Stewardship & Expertise (Legal-Tech Synergy)',
      descAr: 'إشراف أ. هشام فتحي عبد الوهاب، باحث قانوني متخصص في حوكمة الذكاء الاصطناعي، ودمج عراقة ممارسة القانون مع ريادة الحلول الرقمية.',
      descEn: 'Led by Legal AI Governance Researcher Hisham Fathi Abdelwahab, bridging institutional jurisprudence with cutting-edge ethical computing.'
    },
    {
      num: '6',
      titleAr: '6. الجسر إلى الواقع والتحليل الفيزيائي للصفر',
      titleEn: '6. Bridge to Reality & Zero Physical Equilibrium',
      descAr: 'نقل التصورات البصرية والهندسية، بما في ذلك التحليل الفيزيائي للصفر كقاعدة هندسية للتوازن، إلى منصة مكانية حية تحقق أثراً اجتماعياً واقتصادياً ملموساً.',
      descEn: 'Grounding geometric harmony and zero-balance equilibrium into a living space generating tangible social uplift.'
    }
  ];

  const copyProposal = () => {
    const text = `مشروع حديقة النخيل الذكية | منظومة YAHYA
الموقع: المحلة الكبرى - شارع الجيش (قطعة رقم 9)
المشرف: هشام فتحي عبد الوهاب (مؤسس منظومة يحيى)
الشعار: إقامة العدل بالود والحب
الآية: ﴿إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ﴾`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-900 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                {isAr ? 'مشروع ميداني استثماري واجتماعي' : 'Endowment Civic Initiative'}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="h-3 w-3 text-amber-400" />
                {isAr ? 'المحلة الكبرى - شارع الجيش (قطعة 9)' : 'El Mahalla El Kubra - El Geish St'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr ? 'مشروع حديقة النخيل الذكية (Smart Palm Garden)' : 'Smart Palm Garden Civic Initiative'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isAr
                ? 'رؤية متكاملة لاستغلال أراضي الأوقاف لترميم الانكسار الاجتماعي، وتعزيز الكرامة الإنسانية، وربط التقنية بالسكينة والأمان الأسري.'
                : 'A flagship civic initiative integrating nature, technology, and family harmony to transform social challenges into serene spiritual opportunities.'}
            </p>
          </div>

          <button
            onClick={copyProposal}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/40 transition-colors cursor-pointer self-start md:self-center"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-emerald-400" />
                <span>{isAr ? 'نسخ بيانات المقترح' : 'Copy Summary'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Six Jewels (الدرر الست للمشروع) */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span>{isAr ? 'الدرر الست للمشروع (Six Strategic Pillars)' : 'Strategic Pillars'}</span>
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-2 hover:border-emerald-500/40 transition-colors"
            >
              <h4 className="text-sm font-bold text-emerald-300">
                {isAr ? pillar.titleAr : pillar.titleEn}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isAr ? pillar.descAr : pillar.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
