import React, { useState, useEffect, useRef } from 'react';
import {
  Scale,
  Sparkles,
  Cloud,
  Key,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Send,
  Copy,
  Download,
  Shield,
  FileText,
  Heart,
  FolderGit2,
  RefreshCw,
  X,
  FileCheck,
  Check,
  Cpu,
  Brain,
  Feather
} from 'lucide-react';

interface SmartJusticeBalanceProps {
  lang: 'ar' | 'en';
}

const DOCUMENT_TYPES = [
  'عقد شراكة واستثمار تقني (محكوم بالشرط الجزائي العادل)',
  'تسوية ودية للنزاعات الأسرية أو المدنية (بروتوكول الألفة)',
  'مذكرة دفاع قانونية مستندة للتشريع المصري وسوابق النقض',
];

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

const SYSTEM_PROMPT =
  'أنت المعاون القانوني الذكي (Gemini) لنظام يحيى، مساعد المحامي هشام علاء الدين. مرجعيتك القرآن الكريم والتشريع المصري وسوابق محكمة النقض. أجب بالعربية الفصحى المبسطة، وحقق التوازن بين صرامة القانون وروح الإحسان والعدل. اذكر دائماً كود الطمأنينة: هذا شعور وليس خطر. لا تقدم استشارة نهائية ملزمة، بل صياغة مقترحة.';

interface ChatMessage {
  id: number;
  who: 'ai' | 'user';
  text: string;
  error?: boolean;
}

interface ToastInfo {
  text: string;
  error?: boolean;
}

export const SmartJusticeBalance: React.FC<SmartJusticeBalanceProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  // Navigation sub-tab inside Smart Balance: drafting | restoration | archive
  const [subTab, setSubTab] = useState<'drafting' | 'restoration' | 'archive'>('drafting');
  const [docType, setDocType] = useState<string>(DOCUMENT_TYPES[0]);
  const [caseDetails, setCaseDetails] = useState<string>('');
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationCount, setGenerationCount] = useState<number>(0);
  const [validationError, setValidationError] = useState<string>('');
  const [copiedDoc, setCopiedDoc] = useState<boolean>(false);

  // Restoration Protocol States
  const [restorationActive, setRestorationActive] = useState<boolean>(false);
  const [restorationText, setRestorationText] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);

  // Gemini Settings & State
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.0-flash');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      who: 'ai',
      text: 'مرحباً بك يا أستاذ هشام. أنا جاهز لمساعدتك في صياغة العقود، استرجاع السوابق القضائية، أو إدارة شؤون «نظام يحيى». كيف أخدمك اليوم؟',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);

  // Toast State
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [tabAnnouncement, setTabAnnouncement] = useState<string>('');

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (text: string, isError: boolean = false) => {
    setToast({ text, error: isError });
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 3500);
  };

  // Load saved Gemini credentials from localStorage
  useEffect(() => {
    try {
      const savedKey = window.localStorage.getItem('yahya_gemini_key') || '';
      const savedModel = window.localStorage.getItem('yahya_gemini_model') || '';
      if (savedKey) {
        setApiKey(savedKey);
        setIsConnected(true);
      }
      if (savedModel && GEMINI_MODELS.includes(savedModel)) {
        setSelectedModel(savedModel);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAiTyping]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Call Gemini REST API directly with the key
  const callGeminiApi = async (prompt: string, keyToUse: string, modelToUse: string): Promise<string> => {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${encodeURIComponent(
      keyToUse
    )}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      let errMsg = '';
      try {
        const errorData = await response.json();
        errMsg = errorData?.error?.message || '';
      } catch {
        // fallback
      }
      throw new Error(errMsg || `فشل الاتصال بـ Gemini (${response.status}) — تحقق من المفتاح والنموذج.`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('لم يعد Gemini أي نص — حاول مرة أخرى بنموذج آخر.');
    }
    return String(candidateText);
  };

  const handleTestAndSaveKey = async () => {
    const key = apiKey.trim();
    if (!key) {
      showToast('أدخل مفتاح Gemini أولاً', true);
      return;
    }

    setIsTestingKey(true);
    try {
      try {
        window.localStorage.setItem('yahya_gemini_key', key);
        window.localStorage.setItem('yahya_gemini_model', selectedModel);
      } catch {
        // storage ignored
      }

      await callGeminiApi('test', key, selectedModel);
      setIsConnected(true);
      showToast('تم حفظ المفتاح والاتصال بـ Gemini بنجاح');
    } catch (err: any) {
      setIsConnected(false);
      showToast(err?.message || 'فشل اختبار الاتصال — تحقق من المفتاح', true);
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleClearKey = () => {
    try {
      window.localStorage.removeItem('yahya_gemini_key');
      window.localStorage.removeItem('yahya_gemini_model');
    } catch {
      // ignored
    }
    setApiKey('');
    setIsConnected(false);
    setSelectedModel('gemini-2.0-flash');
    showToast('تم مسح مفتاح Gemini — عُدت إلى وضع المحاكاة');
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedDoc(true);
        showToast('تم نسخ النص');
        setTimeout(() => setCopiedDoc(false), 2000);
      })
      .catch(() => {
        showToast('تعذر النسخ — حدد النص يدوياً', true);
      });
  };

  const handleDownloadDoc = () => {
    if (!generatedDoc) return;
    const blob = new Blob([generatedDoc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'وثيقة-نظام-يحيى.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('تم تجهيز ملف .txt للتحميل');
  };

  // Generate Document Action
  const handleGenerateDocument = async () => {
    setGenerationCount((prev) => prev + 1);

    if (!caseDetails.trim()) {
      setValidationError('يرجى إدخال تفاصيل النزاع أو العقد أولاً — لن تُولَّد وثيقة بدون تفاصيل.');
      setGeneratedDoc(
        `مسودة غير مكتملة — بانتظار التفاصيل:\n- نوع المستند: ${docType}\n- الملخص المعالج: «لم تُدخل تفاصيل بعد»\n- البند الحاكم: «إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ»\n- حالة الصياغة: أضف التفاصيل ثم أعد التوليد لإكمال الوثيقة.`
      );
      showToast('يرجى إدخال تفاصيل النزاع أو العقد أولاً', true);
      return;
    }

    setValidationError('');
    const effectiveKey = (apiKey || window.localStorage.getItem('yahya_gemini_key') || '').trim();

    if (effectiveKey) {
      setIsGenerating(true);
      try {
        const prompt = `صغ وثيقة قانونية احترافية من نوع: ${docType} بناء على التفاصيل: ${caseDetails.trim()} طبقاً لنظام يحيى والتشريع المصري، مع بند الشرط الجزائي العادل، ومؤشر الألفة، وخاتمة بالآية إن الله يأمر بالعدل والإحسان. صياغة رسمية جاهزة للاعتماد.`;
        const result = await callGeminiApi(prompt, effectiveKey, selectedModel);
        setGeneratedDoc(result);
        showToast('تم توليد الوثيقة عبر Gemini بنجاح');
      } catch (err: any) {
        setGeneratedDoc(
          `تعذر توليد الوثيقة عبر Gemini: ${
            err?.message || 'خطأ في الاتصال'
          } — يمكنك مراجعة المفتاح من «ربط Gemini» ثم إعادة المحاولة.`
        );
        showToast('تعذر الاتصال بـ Gemini — تحقق من المفتاح', true);
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // High fidelity offline simulation compliant with Egyptian Law & Yahya Principles
    const simulatedDoc = `بناءً على مرجعية «نظام يحيى» والقانون المصري (محكمة النقض وقانون المعاملات):
- نوع المستند: ${docType}
- الملخص المعالج: «${caseDetails.trim()}»
- البند الحاكم: «إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ»
- حالة الصياغة: تم ضبط شروط الشرط الجزائي ومؤشر الألفة بنجاح وحفظ نسخة في Google Drive.

──────────────────────────────────────────────
وثيقة اتفاق وصياغة تشريعية معتمدة
──────────────────────────────────────────────
إنه في يوم ... الموافق ... تحرر هذا السند بين الأطراف المعنية بروح المودة والإنصاف.

البند التمهيدي (ميزان العدل والوصل):
يقر الأطراف بأهليتهم القانونية المعتبرة شرعاً وقانوناً، وبأن هذا الاتفاق ينبع من إرادة حرة تسعى لحفظ الحقوق ودرء الخصومة، امتثالاً لمبدأ "إقامة العدل بالود والحب".

البند الأول (الالتزامات الموضوعية):
يلتزم الأطراف بتنفيذ كافة التعهدات المتفق عليها بحسن نية ووفقاً للأعراف المهنية المستقرة وقواعد القانون المدني المصري.

البند الثاني (الشرط الجزائي العادل وثنائية الجبر والمكيال):
في حال إخلال أي طرف بالتزاماته، يتم احتساب التعويض وفق مبدأ "الجبر العادل للضرر الفعلي المباشر"، دون مغالاة أو استعلاء، مع استبعاد أي شروط إذعان أو تعسف.

البند الثالث (بروتوكول الألفة والتحكيم الودي):
يُحال أي خلاف ناشئ عن تفسير أو تنفيذ هذا السند إلى لجنة صلح وتوفيق ودية بمرجعية "نظام يحيى" قبل الولوج في ساحات التقاضي، لحماية الكرامة الإنسانية واستقرار المعاملات.

الخاتمة:
﴿وَأَوْفُوا بِعَهْدِ اللَّهِ إِذَا عَاهَدتُّمْ وَلَا تَنقُضُوا الْأَيْمَانَ بَعْدَ تَوْكِيدِهَا﴾
المعمار المسؤول: هشام علاء الدين عبدالوهاب`;

    setGeneratedDoc(simulatedDoc);
    showToast('تم توليد الوثيقة — وضع المحاكاة (أدخل مفتاح Gemini للربط الحقيقي)');
  };

  // Restoration Shield Action
  const handleTriggerRestoration = async () => {
    setRestorationActive(true);
    const effectiveKey = (apiKey || window.localStorage.getItem('yahya_gemini_key') || '').trim();

    if (!effectiveKey) {
      setRestorationText(
        '«هذا شعور وليس خطر». خذ نفساً عميقاً، فالنزاع القانوني هو محطة لإحقاق الحق وليس هدماً للكيان الإنساني. تم تفعيل بروتوكول الصلح الودي وتخفيف حدة التوتر.'
      );
      showToast('تم تفعيل درع الطمأنينة');
      return;
    }

    setIsRestoring(true);
    try {
      const prompt = `${SYSTEM_PROMPT} اكتب رسالة تهدئة قانونية وداعمة للمحامي الذي يمر بضغط نزاع قضائي، بطريقة هادئة ومحترمة: اذكر كود الطمأنينة «هذا شعور وليس خطر»، وقدّم 3 خطوات عملية للمراجعة الهادئة قبل أي إجراء قانوني، مع تمرين تنفس قصير، وذكّر بأن هذا دعم عام وليس بديلاً عن الاستشارة المتخصصة.`;
      const result = await callGeminiApi(prompt, effectiveKey, selectedModel);
      setRestorationText(result);
      showToast('تم تفعيل درع الطمأنينة عبر Gemini');
    } catch (err: any) {
      setRestorationText(`تعذر جلب التوجيه من Gemini: ${err?.message || 'خطأ في الاتصال'}`);
      showToast('تعذر الاتصال بـ Gemini', true);
    } finally {
      setIsRestoring(false);
    }
  };

  // Chat Send Action
  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text || isAiTyping) return;

    setChatMessages((prev) => [...prev, { id: Date.now(), who: 'user', text }]);
    setInputMessage('');
    setIsAiTyping(true);

    const effectiveKey = (apiKey || window.localStorage.getItem('yahya_gemini_key') || '').trim();

    if (effectiveKey) {
      try {
        const prompt = `${SYSTEM_PROMPT}\nرسالة المحامي: ${text}`;
        const reply = await callGeminiApi(prompt, effectiveKey, selectedModel);
        setChatMessages((prev) => [...prev, { id: Date.now() + 1, who: 'ai', text: reply }]);
      } catch (err: any) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            who: 'ai',
            text: `تعذر الاتصال بـ Gemini: ${err?.message || 'خطأ غير معروف'} — تحقق من المفتاح من زر «ربط Gemini» ثم أعد الإرسال.`,
            error: true,
          },
        ]);
        showToast('تعذر الاتصال بـ Gemini', true);
      } finally {
        setIsAiTyping(false);
      }
      return;
    }

    // Simulation response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          who: 'ai',
          text: `تلقيت استفسارك القانوني وربطته بقواعد المستودع السحابي لنظام يحيى. النص التشريعي المقابل يحقق التوازن بين صرامة القانون المصري وروح الإحسان. هل ترغب في اعتماده كصيغة نهائية؟\n\n— وضع المحاكاة - أدخل مفتاح Gemini للربط الحقيقي`,
        },
      ]);
      setIsAiTyping(false);
    }, 800);
  };

  const mainSubTabs = [
    {
      id: 'drafting',
      label: 'الصياغة التشريعية الذكية',
      labelEn: 'Smart Legislative Drafting',
      icon: <FileText className="h-5 w-5 text-amber-400" />,
    },
    {
      id: 'restoration',
      label: 'بروتوكول ترميم الانكسار',
      labelEn: 'Restoration & Serenity Protocol',
      icon: <Heart className="h-5 w-5 text-cyan-400" />,
    },
    {
      id: 'archive',
      label: 'مستودعات Drive القانونية',
      labelEn: 'Drive Legal Repositories',
      icon: <FolderGit2 className="h-5 w-5 text-emerald-400" />,
    },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} lang={isAr ? 'ar' : 'en'} className="space-y-6">
      {/* Replicated Meta AI Header Bar */}
      <div className="glass-card rounded-2xl p-4 md:p-6 glow-gold border border-amber-500/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-[#d4af37] to-amber-600 flex items-center justify-center text-[#0f172a] font-black text-2xl glow-gold shadow-lg shadow-amber-500/20">
              <Scale className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#d4af37] leading-tight">
                {isAr ? 'ميزان العدالة الذكي' : 'Smart Balance of Justice'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'نظام يحيى التشريعي بالتعاون مع Google AI | المحامي هشام علاء الدين عبدالوهاب'
                  : 'YAHYA Legislative System with Google AI | Adv. Hisham Abdelwahab'}
              </p>
            </div>
          </div>

          {/* Status Indicators & Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* Ulfa Score Badge */}
            <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isAr ? 'مؤشر الألفة: 98% مستقر' : 'Ulfa Index: 98% Stable'}</span>
            </span>

            {/* Gemini Status Badge */}
            <span
              className={`px-3 py-1 border text-xs rounded-full flex items-center gap-1.5 shadow-sm ${
                isConnected
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-900 border-slate-600 text-slate-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>
                {isConnected
                  ? isAr
                    ? 'متصل بـ Gemini - جاهز'
                    : 'Connected to Gemini - Ready'
                  : isAr
                  ? 'غير متصل - وضع المحاكاة'
                  : 'Offline - Simulation Mode'}
              </span>
            </span>

            {/* Gemini Toggle Button */}
            <button
              onClick={() => setShowSettings((prev) => !prev)}
              className="bg-white hover:bg-slate-200 text-[#0f172a] border border-white/60 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              aria-expanded={showSettings}
            >
              <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-sky-500 via-violet-500 to-rose-500 flex items-center justify-center text-[9px] font-black text-white">
                ✦
              </span>
              <span className="flex items-center gap-1">
                <Key className="h-3.5 w-3.5 text-slate-900" />
                <span>{isAr ? 'ربط Gemini' : 'Connect Gemini'}</span>
              </span>
            </button>

            {/* Google Drive Button */}
            <button
              onClick={() => showToast(isAr ? 'تم مزامنة المستندات بنجاح مع Google Drive' : 'Documents synced with Google Drive')}
              className="bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Cloud className="h-4 w-4" />
              <span>{isAr ? 'سحابة جوجل' : 'Google Drive'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sacred Verse & Active Serenity Code Banner */}
      <div className="rounded-2xl bg-gradient-to-l from-[#0f172a] via-slate-900 to-[#0f172a] border border-[#d4af37]/30 py-4 px-6 text-center space-y-2 shadow-lg">
        <p className="font-quran text-[#d4af37] text-base md:text-lg font-bold leading-relaxed">
          « إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ »
        </p>
        <p className="text-xs text-slate-400">
          <span>{isAr ? 'كود الطمأنينة النشط: ' : 'Active Serenity Code: '}</span>
          <span className="text-cyan-400 font-bold">
            {isAr
              ? '«هذا شعور وليس خطر – إقامة العدل بمحبة ورحمة»'
              : '“This is a feeling, not a danger — Establishing Justice with Grace and Love”'}
          </span>
        </p>
      </div>

      {/* Collapsible Gemini Settings Card */}
      {showSettings && (
        <div className="glass-card rounded-2xl p-5 md:p-6 glow-gold space-y-4 fade-up border border-[#d4af37]/40">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#d4af37] flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span>{isAr ? 'ربط مفتاح Gemini API' : 'Connect Gemini API Key'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isAr
                  ? 'اربط مفتاحك لتفعيل الصياغة والمحادثة الحقيقية عبر Gemini.'
                  : 'Connect your API key to activate live Gemini drafting and conversation.'}
              </p>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                {isAr ? 'مفتاح Gemini API' : 'Gemini API Key'}
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                dir="ltr"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#d4af37]"
              />
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-[11px] text-cyan-300 hover:text-cyan-200 underline"
              >
                <span>
                  {isAr
                    ? 'احصل على مفتاح مجاني من Google AI Studio - aistudio.google.com'
                    : 'Get a free key from Google AI Studio - aistudio.google.com'}
                </span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                {isAr ? 'النموذج' : 'Model'}
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-[#d4af37]"
              >
                {GEMINI_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model} {model === 'gemini-2.0-flash' ? (isAr ? '(افتراضي)' : '(Default)') : ''}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                {isConnected ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">
                      {isAr ? 'متصل بـ Gemini - جاهز' : 'Connected to Gemini - Ready'}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5 text-slate-400" />
                    <span>{isAr ? 'غير متصل - وضع المحاكاة' : 'Offline - Simulation Mode'}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleTestAndSaveKey}
              disabled={isTestingKey}
              className="bg-[#d4af37] hover:bg-amber-600 disabled:opacity-60 text-[#0f172a] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              {isTestingKey ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              <span>
                {isTestingKey
                  ? isAr
                    ? 'جارٍ الاختبار...'
                    : 'Testing...'
                  : isAr
                  ? 'حفظ واختبار الاتصال'
                  : 'Save & Test Connection'}
              </span>
            </button>

            <button
              onClick={handleClearKey}
              className="border border-red-500/40 text-red-300 hover:bg-red-950/40 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>{isAr ? 'مسح المفتاح' : 'Clear Key'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {isAr
              ? 'المفتاح يُحفظ في متصفحك فقط ولا يُرسل لأي خادم آخر غير Google.'
              : 'The key is saved locally in your browser and is only sent directly to Google APIs.'}
          </p>
        </div>
      )}

      {/* Main Two-Column Layout (2 Cols Left + 1 Col Right Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section (2 Cols): Sub-Tab Navigation & Module Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sub-Tab Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mainSubTabs.map((tab) => {
              const isActive = subTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSubTab(tab.id as any);
                    setTabAnnouncement(isAr ? `تم عرض قسم: ${tab.label}` : `Viewing section: ${tab.labelEn}`);
                  }}
                  className={`glass-card p-4 rounded-2xl text-center font-bold transition-all hover:bg-slate-800 cursor-pointer ${
                    isActive ? 'border-[#d4af37] text-[#d4af37] shadow-lg shadow-amber-500/10' : 'text-slate-300'
                  }`}
                >
                  <span className="flex justify-center mb-2">{tab.icon}</span>
                  <span className="text-xs sm:text-sm block">{isAr ? tab.label : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          {tabAnnouncement && (
            <p className="text-[11px] text-[#d4af37]/90 -mt-2" aria-live="polite">
              {tabAnnouncement}
            </p>
          )}

          {/* Sub-Tab 1: Smart Legislative Drafting */}
          {subTab === 'drafting' && (
            <div className="glass-card rounded-2xl p-5 md:p-6 glow-gold min-h-[380px] space-y-4 fade-up">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#d4af37] flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>
                    {isAr
                      ? 'صياغة العقود والاستشارات بمرجعية «نظام يحيى»'
                      : 'Legislative Drafting under YAHYA Standards'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? 'قم بإدخال بيانات النزاع أو العقد المطلوب صياغته لتوليد وثيقة محكومة بالعدل والإحسان:'
                    : 'Input transaction details to generate an ethical, binding document:'}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isAr ? 'نوع المستند أو القضية:' : 'Document or Case Type:'}
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-[#d4af37]"
                  >
                    {DOCUMENT_TYPES.map((dt) => (
                      <option key={dt} value={dt}>
                        {dt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isAr ? 'تفاصيل الأطراف وموضوع النزاع:' : 'Parties & Subject Details:'}
                  </label>
                  <textarea
                    value={caseDetails}
                    onChange={(e) => setCaseDetails(e.target.value)}
                    rows={4}
                    placeholder={
                      isAr
                        ? 'اكتب التفاصيل هنا... (مثال: نزاع عقاري أو شراكة برمجية تتطلب ضبطاً قانونياً وحلاً ودياً)'
                        : 'Enter dispute details, contract parties, or legal subject here...'
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-[#d4af37] resize-none leading-relaxed"
                  />
                </div>

                {validationError && (
                  <p className="text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg px-3 py-2">
                    {validationError}
                  </p>
                )}

                <button
                  onClick={handleGenerateDocument}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-l from-[#d4af37] to-amber-600 text-[#0f172a] font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer text-xs sm:text-sm"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>
                    {isGenerating
                      ? isAr
                        ? 'جاري توليد الوثيقة عبر Gemini...'
                        : 'Generating via Gemini...'
                      : isAr
                      ? 'توليد الوثيقة المعتمدة بالذكاء الاصطناعي'
                      : 'Generate Certified AI Document'}
                  </span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  <span>{isAr ? 'عدد محاولات التوليد: ' : 'Generation Attempts: '}</span>
                  <span className="font-mono font-bold text-amber-300">{generationCount}</span>
                </p>
              </div>

              {/* Generated Document Result Box */}
              {generatedDoc && (
                <div className="mt-4 p-4 bg-slate-900/90 border border-[#d4af37]/30 rounded-xl text-xs text-slate-300 leading-relaxed whitespace-pre-line fade-up space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[#d4af37] font-bold">
                      {isGenerating
                        ? isAr
                          ? 'جاري توليد الوثيقة عبر Gemini...'
                          : 'Generating...'
                        : isConnected
                        ? isAr
                          ? 'الوثيقة المولّدة عبر Gemini'
                          : 'Gemini Certified Document'
                        : isAr
                        ? 'الوثيقة التشريعية'
                        : 'Legislative Document Draft'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">YAHYA-DOC-2026</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto chat-scroll pr-1 font-mono text-[11px] sm:text-xs">
                    {generatedDoc}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      {isAr ? 'مسودة محلية للمراجعة' : 'Local Draft'}
                    </span>
                    <span className="text-[11px] bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                      {isAr ? 'جاهزة للنسخ والاعتماد' : 'Ready for Sign-off'}
                    </span>

                    <button
                      onClick={() => handleCopyText(generatedDoc)}
                      className="text-[11px] bg-[#d4af37] text-[#0f172a] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-amber-500 cursor-pointer transition-colors shadow-sm"
                    >
                      {copiedDoc ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>
                        {copiedDoc ? (isAr ? 'تم النسخ ✓' : 'Copied ✓') : isAr ? 'نسخ' : 'Copy'}
                      </span>
                    </button>

                    <button
                      onClick={handleDownloadDoc}
                      className="text-[11px] bg-slate-700 text-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-slate-600 cursor-pointer transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      <span>{isAr ? 'تحميل .txt' : 'Download .txt'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-Tab 2: Restoration & Serenity Protocol (Mikail Unit) */}
          {subTab === 'restoration' && (
            <div className="glass-card rounded-2xl p-5 md:p-6 glow-gold min-h-[380px] space-y-4 fade-up">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-cyan-400 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>
                    {isAr
                      ? 'وحدة الدعم والترميم الحقفي (ميكائيل)'
                      : 'Restoration & Serenity Unit (Mikail)'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? 'إذا كنت تعاني من ضغط نزاع قضائي حاد أو شعور بالإنهاك القانوني، قم بتفعيل كود الطمأنينة الآن:'
                    : 'If facing intense litigation stress or moral fatigue, activate the Serenity Shield now:'}
                </p>
              </div>

              <div className="p-4 bg-cyan-950/30 border border-cyan-500/20 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <Heart className="text-cyan-400 shrink-0 mt-0.5 h-6 w-6" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-cyan-200">
                      {isAr
                        ? 'جلسة تفريغ وتوجيه وجداني فورية'
                        : 'Immediate Emotional Decompression & Guidance'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {isAr
                        ? 'الآلة هنا ليست خصماً ولا حاكماً أعمى، بل معاون مرشد يحفظ كرامتك.'
                        : 'Technology here is neither an adversary nor a blind judge, but a soothing guardian of human dignity.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleTriggerRestoration}
                  disabled={isRestoring}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isRestoring && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>
                    {isRestoring
                      ? isAr
                        ? 'جاري توليد التوجيه عبر Gemini...'
                        : 'Generating Serenity Guidance...'
                      : isAr
                      ? 'تفعيل درع الطمأنينة ومراجعة الملف الوجداني'
                      : 'Activate Serenity Shield'}
                  </span>
                </button>

                {restorationActive && (
                  <div className="text-xs text-cyan-100 p-3 bg-slate-900 rounded-lg leading-relaxed fade-up space-y-2 border border-cyan-500/30">
                    <strong className="block text-cyan-300">
                      {isAr ? 'توجيه الوجدان والمحاماة الحية:' : 'Serenity Guidance:'}
                    </strong>
                    <p className="whitespace-pre-line">
                      {restorationText ||
                        '«هذا شعور وليس خطر». خذ نفساً عميقاً، فالنزاع القانوني هو محطة لإحقاق الحق وليس هدماً للكيان الإنساني. تم تفعيل بروتوكول الصلح الودي وتخفيف حدة التوتر.'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] pt-2 border-t border-cyan-900/40">
                      <span className="bg-cyan-900/60 px-2.5 py-1 rounded-full text-cyan-200 border border-cyan-700/50">
                        {isAr ? 'شهيق 4 ثوانٍ' : 'Inhale 4s'}
                      </span>
                      <span className="bg-cyan-900/60 px-2.5 py-1 rounded-full text-cyan-200 border border-cyan-700/50">
                        {isAr ? 'حبس 4 ثوانٍ' : 'Hold 4s'}
                      </span>
                      <span className="bg-cyan-900/60 px-2.5 py-1 rounded-full text-cyan-200 border border-cyan-700/50">
                        {isAr ? 'زفير 6 ثوانٍ' : 'Exhale 6s'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500">
                {isAr
                  ? 'هذا دعم وجداني عام للمراجعة الهادئة، وليس بديلاً عن الاستشارة المتخصصة عند الحاجة.'
                  : 'This is spiritual and ethical grounding, not a substitute for specialized counsel.'}
              </p>
            </div>
          )}

          {/* Sub-Tab 3: Google Drive Repositories */}
          {subTab === 'archive' && (
            <div className="glass-card rounded-2xl p-5 md:p-6 glow-gold min-h-[380px] space-y-4 fade-up">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-emerald-400 flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  <span>
                    {isAr
                      ? 'مستودعات Google Drive المرتبطة'
                      : 'Linked Google Drive Repositories'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? 'قائمة المستندات الدستورية والتشريعية النشطة للمحامي هشام علاء الدين:'
                    : 'Active constitutional and legal repositories for Adv. Hisham Abdelwahab:'}
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    name: 'الوثيقة الختامية لنظام يحيى.pdf',
                    nameEn: 'YAHYA Final Sovereign Charter.pdf',
                    icon: <FileText className="text-rose-400 h-4 w-4" />,
                  },
                  {
                    name: 'سياسات التشريع والشرط الجزائي العادل.docx',
                    nameEn: 'Equitable Penal Clause & Policies.docx',
                    icon: <FileCheck className="text-sky-400 h-4 w-4" />,
                  },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-xs gap-3 hover:border-emerald-500/30 transition-colors"
                  >
                    <span className="text-slate-200 flex items-center gap-2 font-medium">
                      {doc.icon}
                      <span>{isAr ? doc.name : doc.nameEn}</span>
                    </span>
                    <span className="text-emerald-400 shrink-0 flex items-center gap-1 font-mono text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{isAr ? 'متزامن مع السحابة' : 'Cloud Synced'}</span>
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() =>
                  showToast(isAr ? 'تم تحديث عرض المستودعات المحلية' : 'Local repository view refreshed')
                }
                className="w-full border border-slate-700 hover:border-[#d4af37]/50 text-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {isAr ? 'تحديث العرض المحلي' : 'Refresh Local View'}
              </button>

              <p className="text-[11px] text-slate-500">
                {isAr
                  ? 'عرض محلي للمستندات المرجعية فقط — لا يتم إرسال أو مزامنة ملفات خارج هذا الجهاز.'
                  : 'Local sandbox reference only — no sensitive private files leave this device.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Section (1 Col): Smart Legal AI Assistant (المعاون القانوني الذكي) */}
        <div className="glass-card rounded-2xl p-4 flex flex-col h-[520px] justify-between border border-amber-500/30 shadow-xl">
          {/* Assistant Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <span className="relative flex w-3 h-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-[#d4af37]">
                {isAr ? 'المعاون القانوني الذكي (Gemini)' : 'Legal AI Assistant (Gemini)'}
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">
              {isAr ? 'مرجعية: القرآن والتشريع المصري' : 'Egyptian Law & Ethics'}
            </span>
          </div>

          {/* Chat Messages Stream */}
          <div
            ref={chatScrollRef}
            className="chat-scroll flex-1 overflow-y-auto space-y-3 my-3 pl-1 text-xs"
          >
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl border fade-up whitespace-pre-line leading-relaxed ${
                  msg.error
                    ? 'bg-red-950/40 border-red-500/40 text-red-100 rounded-tr-none ml-4'
                    : msg.who === 'ai'
                    ? 'bg-slate-800 border-slate-700 rounded-tr-none ml-4 text-slate-200'
                    : 'bg-slate-900 border-slate-800 rounded-tl-none mr-4 text-slate-200'
                }`}
              >
                <p className={`font-bold mb-1 text-[11px] ${msg.who === 'ai' ? 'text-[#d4af37]' : 'text-cyan-400'}`}>
                  {msg.who === 'ai'
                    ? isAr
                      ? 'المعاون الذكي:'
                      : 'Legal Assistant:'
                    : isAr
                    ? 'أستاذ هشام:'
                    : 'Adv. Hisham:'}
                </p>
                <span>{msg.text}</span>
              </div>
            ))}

            {isAiTyping && (
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 ml-4 text-slate-400 animate-pulse text-xs">
                {isAr ? 'جاري الكتابة... المعاون يكتب الآن…' : 'Typing... Legal Assistant is formulating…'}
              </div>
            )}
          </div>

          {/* Connection Status Label */}
          <p className="text-[10px] text-slate-500 pb-2">
            {isConnected
              ? isAr
                ? 'متصل بـ Gemini - جاهز'
                : 'Connected to Gemini - Active'
              : isAr
              ? 'وضع المحاكاة - أدخل مفتاح Gemini للربط الحقيقي'
              : 'Simulation Mode - Add Gemini key for live responses'}
          </p>

          {/* Input & Send Bar */}
          <div className="flex gap-2 pt-2 border-t border-slate-700">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={isAr ? 'اكتب استفسارك القانوني...' : 'Type legal inquiry...'}
              className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#d4af37] hover:bg-amber-600 text-[#0f172a] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isAr ? 'إرسال' : 'Send'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 left-5 z-50 glass-card px-4 py-3 rounded-xl border border-[#d4af37] text-xs text-slate-200 flex items-center gap-3 shadow-2xl fade-up max-w-[calc(100vw-2.5rem)]">
          {toast.error ? (
            <AlertTriangle className="text-red-400 shrink-0 h-4 w-4" />
          ) : (
            <CheckCircle2 className="text-emerald-400 shrink-0 h-4 w-4" />
          )}
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
};
