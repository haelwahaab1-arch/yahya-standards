import React from 'react';
import { Scale, ShieldCheck, HeartHandshake, FileText, Compass, Sparkles, Globe, TreePine } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  ulfaScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  ulfaScore,
}) => {
  const isAr = lang === 'ar';

  const navItems = [
    {
      id: 'smart-balance',
      labelAr: 'ميزان العدالة الذكي (Google AI)',
      labelEn: 'Smart Balance & Legal AI',
      icon: Scale,
    },
    {
      id: 'aer-suite',
      labelAr: 'بروتوكول A.E.R (ميزان، تبيان، إحياء)',
      labelEn: 'A.E.R Protocol Suite',
      icon: ShieldCheck,
    },
    {
      id: 'cases-sandbox',
      labelAr: 'محاكي الحالات والقرارات',
      labelEn: 'Decision Sandbox',
      icon: Compass,
    },
    {
      id: 'ulfa-dashboard',
      labelAr: 'مؤشر الألفة والجبر والمكيال',
      labelEn: 'Ulfa Index & Dual Balance',
      icon: HeartHandshake,
    },
    {
      id: 'charters-license',
      labelAr: 'المواثيق والرخصة السيادية',
      labelEn: 'Charters & Sovereign License',
      icon: FileText,
    },
    {
      id: 'palm-garden',
      labelAr: 'مشروع حديقة النخيل',
      labelEn: 'Smart Palm Garden',
      icon: TreePine,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top Banner with Sovereign Verse */}
      <div className="border-b border-amber-500/15 bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 px-4 py-1.5 text-center text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="hidden items-center gap-2 text-amber-300/80 sm:flex">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px]">
              {isAr ? 'الدرع السيادي نشط • بروتوكول الإصدار v4.0' : 'Sovereign Shield Active • Protocol v4.0'}
            </span>
          </div>

          <p className="mx-auto font-quran text-sm font-semibold text-amber-200/90 tracking-wide">
            {isAr
              ? '﴿إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ﴾ — إقامة العدل بالإحسان والحب'
              : '“Verily, God commands justice, grace, and empathy” — Justice Through Compassion'}
          </p>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 rounded-full bg-slate-900/90 px-2.5 py-0.5 border border-amber-500/20 text-amber-300">
              <HeartHandshake className="h-3 w-3 text-amber-400" />
              <span className="text-[11px] font-mono font-medium">
                {isAr ? 'مؤشر الألفة:' : 'Ulfa KPI:'} {ulfaScore}%
              </span>
            </div>

            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:border-amber-400/50 hover:text-amber-300 transition-colors"
              title="Toggle Language"
            >
              <Globe className="h-3 w-3 text-amber-400" />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand Logo & Sovereign Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 shadow-md shadow-amber-500/20">
            <Scale className="h-5 w-5 text-slate-950" />
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-amber-400 border border-amber-500/40">
              ي
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                {isAr ? 'منظومة يَحْيَى' : 'YAHYA SYSTEM'}
              </h1>
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                A.E.R Framework
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'حوكمة الذكاء الاصطناعي والعدالة الخوارزمية السيادية'
                : 'Ethical AI Meta-Governance & Digital Justice'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{isAr ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
