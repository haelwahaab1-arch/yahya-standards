import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SmartJusticeBalance } from './components/SmartJusticeBalance';
import { AerSuite } from './components/AerSuite';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { UlfaIndexDashboard } from './components/UlfaIndexDashboard';
import { ChartersViewer } from './components/ChartersViewer';
import { SmartPalmGarden } from './components/SmartPalmGarden';
import { SAMPLE_CASES } from './data/governanceData';
import { ApplicationDecisionCase } from './types';

export function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [activeTab, setActiveTab] = useState<string>('smart-balance');
  const [cases, setCases] = useState<ApplicationDecisionCase[]>(SAMPLE_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(SAMPLE_CASES[0].id);

  const isAr = lang === 'ar';
  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const handleUpdateCase = (updatedCase: ApplicationDecisionCase) => {
    setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
  };

  const handleAddNewCase = (newCase: ApplicationDecisionCase) => {
    setCases((prev) => [newCase, ...prev]);
  };

  // Calculate live average Ulfa score
  const totalBiases = cases.reduce((acc, c) => acc + c.auditMetrics.length, 0);
  const purifiedBiases = cases.reduce(
    (acc, c) => acc + c.auditMetrics.filter((m) => m.purified).length,
    0
  );
  const biasPurificationRatio = totalBiases > 0 ? (purifiedBiases / totalBiases) * 100 : 100;
  const liveUlfaScore = Math.round(75 + (biasPurificationRatio * 0.22));

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Global Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        ulfaScore={liveUlfaScore}
      />

      {/* Main Content Viewport */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {activeTab === 'smart-balance' && <SmartJusticeBalance lang={lang} />}

        {activeTab === 'aer-suite' && (
          <AerSuite
            currentCase={currentCase}
            onUpdateCase={handleUpdateCase}
            cases={cases}
            onSelectCase={setSelectedCaseId}
            lang={lang}
          />
        )}

        {activeTab === 'cases-sandbox' && (
          <ScenarioSimulator
            cases={cases}
            selectedCaseId={selectedCaseId}
            onSelectCase={setSelectedCaseId}
            onNavigateToAer={(tab) => setActiveTab(tab || 'aer-suite')}
            onAddNewCase={handleAddNewCase}
            lang={lang}
          />
        )}

        {activeTab === 'ulfa-dashboard' && <UlfaIndexDashboard lang={lang} />}

        {activeTab === 'charters-license' && <ChartersViewer lang={lang} />}

        {activeTab === 'palm-garden' && <SmartPalmGarden lang={lang} />}
      </main>

      {/* Sovereign Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-950/80 py-10 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
                  ⚖️
                </div>
                <span className="text-sm font-bold text-white">
                  {isAr
                    ? 'ميزان العدالة الذكي — نظام يحيى التشريعي بالتعاون مع Google AI'
                    : 'Smart Balance of Justice — YAHYA System with Google AI'}
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-amber-300 font-mono">
                  v4.0 Live
                </span>
              </div>
              <p className="font-quran text-sm text-amber-200/90">
                ﴿لَقَدْ أَرْسَلْنَا رُسُلَنَا بِالْبَيِّنَاتِ وَأَنزَلْنَا مَعَهُمُ الْكِتَابَ وَالْمِيزَانَ لِيَقُومَ النَّاسُ بِالْقِسْطِ﴾ [الحديد: 25]
              </p>
            </div>

            <div className="space-y-1 text-slate-400 md:text-end">
              <p className="font-semibold text-slate-200">
                {isAr ? 'المعمار المسؤول والمحامي:' : 'Architect & Legal Counsel:'}{' '}
                <span className="text-amber-300">المحامي هشام علاء الدين عبدالوهاب</span>
              </p>
              <p className="text-[11px] text-slate-500">
                {isAr
                  ? 'جميع الحقوق محفوظة © نظام يحيى | إقامة العدل بمحبة ورحمة | كود الطمأنينة: هذا شعور وليس خطر'
                  : 'All Rights Reserved © YAHYA System | Establishing Justice with Love & Mercy | Serenity Code: This is a feeling, not a danger'}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
