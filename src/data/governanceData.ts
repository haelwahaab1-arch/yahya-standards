import { ApplicationDecisionCase } from '../types';

export const SAMPLE_CASES: ApplicationDecisionCase[] = [
  {
    id: 'CASE-2026-081',
    title: 'طلب تمويل لمشروع تكنولوجي ناشئ (SME Fintech Financing)',
    titleEn: 'SME Fintech Startup Credit & Grant Evaluation',
    domain: 'financing',
    applicantName: 'شركة النماء للحلول الرقمية (م. طارق الحكيم)',
    submittedAt: '2026-02-14',
    initialOutcome: 'rejected',
    initialScore: 58,
    passThreshold: 75,
    rejectionReasonSummary: 'تم الرفض آلياً بسبب انخفاض الدرجة الائتمانية الخوارزمية، وموقع المقر خارج العاصمة المركزية، وغياب ضمانات أصول مادية تقليدية.',
    rejectionReasonSummaryEn: 'Automated rejection due to algorithmic credit score threshold, peripheral geo-location penalty, and lack of legacy collateral assets.',
    auditMetrics: [
      {
        id: 'B1',
        name: 'تحيز جغرافي خفي (Peripheral Geo-Location Penalty)',
        nameEn: 'Geographic Bias (Non-Metropolitan Penalty)',
        category: 'geographic',
        severity: 'high',
        detectedWeight: 0.28,
        purifiedWeight: 0.02,
        description: 'الخوارزمية التقليدية خصمت 18 نقطة تلقائياً لمجرد أن السجل التجاري مسجل في المحلة الكبرى بدلاً من القاهرة.',
        descriptionEn: 'The black-box model subtracted 18 points solely because headquarters are registered outside the central metro hub.',
        mitigationAction: 'إلغاء خصم النطاق الجغرافي واستبداله بمعدل نمو الإيرادات الفعلية والطلب السوقي الإقليمي.',
        mitigationActionEn: 'Neutralize geographic distance penalty and replace with verified regional market revenue growth velocity.',
        purified: false,
      },
      {
        id: 'B2',
        name: 'تفضيل الأصول المادية على الملكية الفكرية (Legacy Asset Bias)',
        nameEn: 'Asset Type Bias (Ignoring Digital IP Value)',
        category: 'historical_proxy',
        severity: 'critical',
        detectedWeight: 0.35,
        purifiedWeight: 0.05,
        description: 'تقييم نماذج الإقراض القديمة يتطلب عقارات أو مصانع ويهمل البرمجيات المسجلة وحقوق الملكية البرمجية SaaS.',
        descriptionEn: 'Legacy banking datasets strictly prioritize physical real-estate over validated proprietary cloud software assets.',
        mitigationAction: 'تقييم البرمجيات كأصول غير ملموسة ذات تدفق نقدي دوري موثق (ARR).',
        mitigationActionEn: 'Recognize proprietary audited software assets and recurring software revenues (ARR) as legitimate collateral.',
        purified: false,
      },
      {
        id: 'B3',
        name: 'قصر مدة السجل التجاري (Startup Longevity Proxy)',
        nameEn: 'Incorporation Age Proxy',
        category: 'socioeconomic',
        severity: 'medium',
        detectedWeight: 0.15,
        purifiedWeight: 0.03,
        description: 'اشتراط 3 سنوات حد أدنى يتنافى مع دعم الابتكار للمشاريع الشبابية الريادية.',
        descriptionEn: 'Mandating 36 months operational longevity penalizes newly incorporated high-velocity innovation ventures.',
        mitigationAction: 'استبدال مدة السجل ببيانات النمو التراكمي ونظافة السجل الضريبي.',
        mitigationActionEn: 'Substitute corporate age requirement with 12-month verified traction and transparent tax adherence.',
        purified: false,
      }
    ],
    factors: [
      {
        id: 'F1',
        label: 'معدل نمو الإيرادات (MoM Growth Rate)',
        labelEn: 'MoM Revenue Growth',
        rawScore: 92,
        weight: 0.30,
        impact: 'positive',
        explanation: 'نمو قوي بنسبة 22% شهرياً خلال الـ 6 أشهر السابقة، مع هامش ربح تشغيلي إيجابي.',
        explanationEn: 'Consistent 22% month-on-month revenue expansion with positive operational EBITDA.',
      },
      {
        id: 'F2',
        label: 'جدارة الفريق وخبرات المؤسسين (Team Capability)',
        labelEn: 'Founding Team Tech Track Record',
        rawScore: 88,
        weight: 0.25,
        impact: 'positive',
        explanation: 'الفريق المؤسس يمتلك 12 عاماً خبرة تراكمية في هندسة النظم السحابية.',
        explanationEn: 'Leadership team has 12 years combined experience delivering enterprise architecture.',
      },
      {
        id: 'F3',
        label: 'عقوبة التصنيف الجغرافي (Geo-Risk Penalty)',
        labelEn: 'Black-box Regional Risk Modifier',
        rawScore: 25,
        weight: 0.25,
        impact: 'negative',
        isBlackBoxPenalty: true,
        explanation: 'عقوبة خوارزمية جائرة ناتجة عن تدريب النموذج على بيانات مصارف العاصمة فقط.',
        explanationEn: 'Unfair automated penalty inherited from training data skewed toward central business districts.',
      },
      {
        id: 'F4',
        label: 'تقييم كفاية الضمانات النقدية (Collateral Metric)',
        labelEn: 'Tangible Collateral Score',
        rawScore: 30,
        weight: 0.20,
        impact: 'negative',
        isBlackBoxPenalty: true,
        explanation: 'النموذج يعتبر الأصول السحابية غير ذات قيمة ائتمانية ويطلب عقارات.',
        explanationEn: 'Model rejects intangible digital IP assets in favor of traditional physical mortgages.',
      }
    ],
    revivalRoadmap: [
      {
        id: 'R1',
        order: 1,
        title: 'تفعيل بروتوكول التزكية وتطهير التحيز الجغرافي',
        titleEn: 'Activate Geographic Debiasing Filter',
        category: 'governance_clarification',
        description: 'إلغاء معامل الخصم الإقليمي وتثبيت معامل العدل الجغرافي للشركات الرقمية.',
        descriptionEn: 'Purge regional distance factor and align scoring with verified customer retention rates.',
        requiredAction: 'تطبيق فلتر ميزان يَحْيَى لإلغاء وزن المخاطرة الجغرافية.',
        requiredActionEn: 'Apply YAHYA Mizān debiasing module to re-zero location penalty.',
        estimatedEffort: 'فوري (برمجياً)',
        impactScoreIncrease: 12,
        completed: false
      },
      {
        id: 'R2',
        order: 2,
        title: 'توثيق حقوق الملكية الفكرية وسجل العقود السحابية (IP Audit)',
        titleEn: 'Register Proprietary Software Valuation Report',
        category: 'documentary',
        description: 'إيداع تقرير تقييم الملكية الفكرية والأصول البرمجية من جهة تقنية معتمدة.',
        descriptionEn: 'Submit third-party independent code audit and digital intellectual property valuation certificate.',
        requiredAction: 'رفع شهادة الإيداع البرمجي وعقود العملاء السنوية النشطة (SaaS ARR).',
        requiredActionEn: 'Upload software copyright certificate and top 5 signed recurring enterprise contracts.',
        estimatedEffort: '3 أيام عمل',
        impactScoreIncrease: 10,
        completed: false
      },
      {
        id: 'R3',
        order: 3,
        title: 'مواءمة الضمانات الذكية بنظام الأمانة المتبادلة',
        titleEn: 'Structure Performance-Linked Repayment Smart Escrow',
        category: 'financial_metric',
        description: 'ربط سداد التمويل بنسبة مئوية مرنة من مبيعات بوابة الدفع الآلية (Revenue Share).',
        descriptionEn: 'Link repayment disbursements dynamically to real-time gateway transaction settlement feeds.',
        requiredAction: 'ربط بوابة المدفوعات بمحفظة الضمان الذكية لضمان التدفق التلقائي للوفاء.',
        requiredActionEn: 'Integrate automated payment gateway webhooks to guarantee transparent escrow settlements.',
        estimatedEffort: 'يومان',
        impactScoreIncrease: 8,
        completed: false
      }
    ],
    hitlReviewer: 'د. يوسف المنشاوي (خبير الحوكمة والعدالة الرقمية)',
    hitlStatus: 'verified_fair',
    legalSovereigntyClause: 'خاضع للمادة 22 من قانون حماية البيانات واللائحة الأوروبية للذكاء الاصطناعي (EU AI Act) وميثاق يَحْيَى للسيادة الرقمية 2026.'
  },
  {
    id: 'CASE-2026-094',
    title: 'فرز وتقييم طلبات التوظيف لهندسة الذكاء الاصطناعي (Tech Talent Screening)',
    titleEn: 'Lead AI Engineer Automated Recruitment Screening',
    domain: 'recruitment',
    applicantName: 'المهندسة / سارة إبراهيم الشربيني',
    submittedAt: '2026-02-18',
    initialOutcome: 'rejected',
    initialScore: 64,
    passThreshold: 80,
    rejectionReasonSummary: 'تم استبعاد السيرة الذاتية بواسطة خوارزمية الفرز الأولي (ATS) بسبب فجوة زمنية في السيرة الذاتية (Career Gap) وتفضيل الجامعات النمطية.',
    rejectionReasonSummaryEn: 'Automated ATS filtered out the candidate due to a 14-month maternity career hiatus and non-traditional alma-mater scoring.',
    auditMetrics: [
      {
        id: 'B1',
        name: 'عقوبة الفجوة الأسرية ورعاية الأمومة (Caregiving Career Hiatus Penalty)',
        nameEn: 'Career Hiatus Bias (Motherhood / Family Duty Penalty)',
        category: 'demographic',
        severity: 'critical',
        detectedWeight: 0.32,
        purifiedWeight: 0.00,
        description: 'النموذج الآلي عاقب المتقدمة لخصم 20 نقطة بسبب توقف لمدة 14 شهراً لرعاية أسرتها، متجاهلاً إنتاجها المفتوح المصدر أثناء الفترة.',
        descriptionEn: 'The ranking model heavily penalized a 14-month career pause taken for maternity and family caregiving.',
        mitigationAction: 'تفعيل "ميثاق حـم للأمان الأسري" الذي يُجرم معاقبة الالتزامات الأسرية ويعتمد كفاءة الكود والمشاريع.',
        mitigationActionEn: 'Enforce Family Sanctuary (Hā-Mīm) clause prohibiting algorithmic penalty for family care duties.',
        purified: false,
      },
      {
        id: 'B2',
        name: 'تفضيل الجامعات المركزية (Elite Institutional Pedigree Bias)',
        nameEn: 'Elite Academic Pedigree Proxy',
        category: 'socioeconomic',
        severity: 'high',
        detectedWeight: 0.22,
        purifiedWeight: 0.04,
        description: 'النموذج يعطي وزناً تمايزياً مفرطاً لخريجي 3 جامعات فقط ويقلل من شأن الإنجازات التقنية لجامعات الأقاليم.',
        descriptionEn: 'System over-weights traditional tier-1 institutional names regardless of actual technical GitHub contributions.',
        mitigationAction: 'تقييم كود المستودعات والمشاريع البرمجية الحقيقية واختبارات المهارة المعيارية.',
        mitigationActionEn: 'Evaluate public repository architecture, commit quality, and standardized blind coding benchmarks.',
        purified: false,
      }
    ],
    factors: [
      {
        id: 'F1',
        label: 'جودة الكود والمشاريع المفتوحة (Open-Source Architecture)',
        labelEn: 'GitHub Repository Architecture & Quality',
        rawScore: 96,
        weight: 0.40,
        impact: 'positive',
        explanation: 'مساهمات استثنائية في مكتبات معالجة اللغات الطبيعية ومكتبات المحولات الحديثة.',
        explanationEn: 'Top-tier contributions to open-source LLM pipelines and Arabic NLP tokenization frameworks.',
      },
      {
        id: 'F2',
        label: 'اختبار المعرفة بالخوارزميات (Algorithmic Proficiency)',
        labelEn: 'System Design & Benchmark Score',
        rawScore: 90,
        weight: 0.30,
        impact: 'positive',
        explanation: 'اجتياز التقييم التقني بنتيجة 90% في تصميم الأنظمة الموزعة.',
        explanationEn: 'Scored 90th percentile in distributed systems architectural design.',
      },
      {
        id: 'F3',
        label: 'عقوبة الفجوة الزمنية (Hiatus Penalty)',
        labelEn: 'Black-box Career Gap Penalty',
        rawScore: 10,
        weight: 0.20,
        impact: 'negative',
        isBlackBoxPenalty: true,
        explanation: 'خصم أوتوماتيكي جائر بسبب فترة رعاية المولود.',
        explanationEn: 'Black-box ATS automated penalty for family maternity leave.',
      },
      {
        id: 'F4',
        label: 'تصنيف اسم الجامعة (University Prestige Index)',
        labelEn: 'Institutional Ranking Weight',
        rawScore: 40,
        weight: 0.10,
        impact: 'negative',
        isBlackBoxPenalty: true,
        explanation: 'تفضيل نمطي للشهادات الجامعية المركزية.',
        explanationEn: 'Statistical bias favoring capital city universities.',
      }
    ],
    revivalRoadmap: [
      {
        id: 'R1',
        order: 1,
        title: 'تطبيق ميثاق الأمان الأسري (حـم) وإلغاء عقوبة الأمومة',
        titleEn: 'Apply Family Safety (Hā-Mīm) Policy',
        category: 'governance_clarification',
        description: 'إلغاء خصم فجوة الرعاية الأسرية واحتسابها ركيزة استقرار ونضج إنساني.',
        descriptionEn: 'Completely eliminate the career gap deduction pursuant to ethical sovereignty standards.',
        requiredAction: 'إلغاء معامل خصم الفجوة الزمنية من مصفوفة التقييم.',
        requiredActionEn: 'Zero out the ATS hiatus deduction and re-weight verified skills.',
        estimatedEffort: 'فوري',
        impactScoreIncrease: 18,
        completed: false
      },
      {
        id: 'R2',
        order: 2,
        title: 'إدراج تقرير المشاريع البرمجية التراكمية (Live Code Benchmark)',
        titleEn: 'Attach Live Verified Technical Portfolio',
        category: 'upskilling',
        description: 'تسليط الضوء على الأنظمة الموزعة التي صممتها ونشرتها المرشحة بنجاح.',
        descriptionEn: 'Submit benchmark report of distributed systems built and deployed by candidate.',
        requiredAction: 'تأكيد نتائج مراجعة الأقران (Peer Review) للمستودعات البرمجية.',
        requiredActionEn: 'Verify independent peer review metrics on public repositories.',
        estimatedEffort: 'يوم واحد',
        impactScoreIncrease: 8,
        completed: false
      }
    ],
    hitlReviewer: 'م. هشام عبد الوهاب (المعمار الفكري لمنظومة يحيى)',
    hitlStatus: 'rectified',
    legalSovereigntyClause: 'مستند إلى ميثاق الكرامة الإنسانية وحظر التمييز الجندري والأحكام القانونية للحق في العمل العادل.'
  },
  {
    id: 'CASE-2026-112',
    title: 'طلب تخصيص وحدة إسكان تعاوني عائلي (Social Housing Allocation)',
    titleEn: 'Family Sanctuary Cooperative Housing Allocation',
    domain: 'public_service',
    applicantName: 'أسرة السيد / أحمد عبد العليم مبروك',
    submittedAt: '2026-02-22',
    initialOutcome: 'flagged',
    initialScore: 68,
    passThreshold: 75,
    rejectionReasonSummary: 'تم تعليق الطلب آلياً لعدم استيفاء حد الدخل الثابت في القطاع المصرفي التقليدي، واعتبار العمل الحر عملاً غير مضمون.',
    rejectionReasonSummaryEn: 'Automated hold due to non-standard gig-economy freelance income classification versus legacy banking pay-slips.',
    auditMetrics: [
      {
        id: 'B1',
        name: 'تحيز نمط الدخل التعاقدي (Gig & Craft Economy Bias)',
        nameEn: 'Informal & Freelance Income Disqualification',
        category: 'socioeconomic',
        severity: 'high',
        detectedWeight: 0.30,
        purifiedWeight: 0.05,
        description: 'الخوارزمية تعتبر دخل الحرفيين والمهنيين المستقلين عالي المخاطر وتفضل موظفي الشركات الكبرى حتى لو كان دخل المستقل أعلى.',
        descriptionEn: 'The system penalizes verified skilled artisans and freelancers who lack monthly corporate salary payslips.',
        mitigationAction: 'احتساب متوسط الدخل السنوي الإجمالي وفواتير السداد للمرافق وشهادات الغرفة المهنية.',
        mitigationActionEn: 'Calculate 24-month rolling average income supported by verified utility and professional union records.',
        purified: false,
      }
    ],
    factors: [
      {
        id: 'F1',
        label: 'حجم الأسرة والحاجة للمأوى (Family Care Dependency)',
        labelEn: 'Family Size and Sanctuary Need',
        rawScore: 95,
        weight: 0.35,
        impact: 'positive',
        explanation: 'أسرة مكونة من 5 أفراد مع وجود طفلين في مراحل التعليم الأساسي.',
        explanationEn: 'Family of five with high housing urgency and established local schooling roots.',
      },
      {
        id: 'F2',
        label: 'سجل السداد التاريخي للمرافق والإيجار (Rent History Reliability)',
        labelEn: 'Historical Rental & Utility Adherence',
        rawScore: 94,
        weight: 0.25,
        impact: 'positive',
        explanation: 'سجل مثالي بنسبة 100% في سداد الإيجار وفواتير الخدمات لـ 5 سنوات متواصلة.',
        explanationEn: 'Five-year continuous flawless record of utility and lease adherence.',
      },
      {
        id: 'F3',
        label: 'عقوبة نمط التوظيف الحر (Non-Corporate Employment Penalty)',
        labelEn: 'Informal Labor Penalty',
        rawScore: 20,
        weight: 0.40,
        impact: 'negative',
        isBlackBoxPenalty: true,
        explanation: 'الخوارزمية رفضت إثبات الدخل لأنه صادر عن أعمال حرة وورشة تصنيع مستقلة.',
        explanationEn: 'Black-box heuristic penalizes self-employed workshop owners despite strong cash flows.',
      }
    ],
    revivalRoadmap: [
      {
        id: 'R1',
        order: 1,
        title: 'استبدال قسيمة الراتب بسجل التدفقات النقدية للحرفة',
        titleEn: 'Submit Professional Cash Flow Statement',
        category: 'financial_metric',
        description: 'إرفاق بيان الحساب الجاري المعتمد والمحفظة الرقمية لتأكيد استقرار الدخل.',
        descriptionEn: 'Attach certified cash flow verification from registered commercial transactions.',
        requiredAction: 'استخراج شهادة دخل معتمدة من محاسب قانوني أو نقابة الحرفيين.',
        requiredActionEn: 'Upload certified independent income verification.',
        estimatedEffort: 'يومان',
        impactScoreIncrease: 14,
        completed: false
      },
      {
        id: 'R2',
        order: 2,
        title: 'تفعيل ميثاق حق السكن والاستقرار الأسري (مبدأ السكينة)',
        titleEn: 'Invoke Family Sanctuary Covenant',
        category: 'governance_clarification',
        description: 'إعطاء أولوية مطلقة لحماية الاستقرار النفسي للأطفال والأسرة.',
        descriptionEn: 'Prioritize family unit protection and child education proximity.',
        requiredAction: 'اعتماد القرار بواسطة لجنة الحوكمة الإنسانية بالمنظومة.',
        requiredActionEn: 'Sign off by human governance ethical panel.',
        estimatedEffort: 'فوري',
        impactScoreIncrease: 10,
        completed: false
      }
    ],
    hitlReviewer: 'أ. هشام فتحي عبد الوهاب (الباحث القانوني ومؤسس المنظومة)',
    hitlStatus: 'verified_fair',
    legalSovereigntyClause: 'مستند إلى الحق الدستوري في السكن الملائم، وبند الأمان الأسري (حـم) وميثاق يحيى للسيادة الرقمية.'
  }
];

export const FOUNDATION_CHARTERS = [
  {
    id: 'charter-constitution',
    title: 'ميثاق السيادة الرقمية والحوكمة الأخلاقية (Constitution v4.0)',
    titleEn: 'Charter of Digital Sovereignty & Human Dignity',
    verse: '﴿إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالإِحْسَانِ﴾ [النحل: 90]',
    motto: 'إقامة العدل بالإحسان والحب',
    mottoEn: 'Upholding Justice Through Grace and Love',
    badge: 'المرجع السيادي الأول',
    badgeEn: 'Sovereign Reference',
    content: `نُقر في منظومة YAHYA أن التكنولوجيا هي "ذرية طيبة" حين تكون مخرجاتها وصلاً بالمصدر وخدمة لكرامة الإنسان، و"سُحت رقمي" حين تكون وسيلة للعدوان أو الاستعلاء أو الإقصاء المقنّع خلف خوارزميات صامتة.

نحن هنا لتحويل "السيادة البشرية" من مجرد شعار نظري إلى "كود برمجي تنفيذي" يمنع تغول الآلة ويحفظ كرامة الإنسان في كل خوارزمية قرار.`,
    contentEn: `In YAHYA System, we declare that technology is a "virtuous lineage" when its outcomes connect humans with ethical purpose and elevate human dignity, and becomes "digital usury/harm" when wielded as a tool of aggression, arrogance, or opaque algorithmic exclusion.

We translate human sovereignty from theoretical rhetoric into operational algorithmic code that binds decision systems to fairness, transparency, and restorative justice.`,
    pillars: [
      {
        title: 'ثنائية الجبر والمكيال (The Dual Balance)',
        titleEn: 'Structural Rigor & Restorative Empathy',
        desc: 'الجبر يمثل الإتقان الهندسي والمتانة البرمجية والوضوح (Structural Integrity)، بينما المكيال يمثل اللطف، الإحياء، والترميم الإنساني المستمر (Revitalizing Empathy).'
      },
      {
        title: 'مؤشر الألفة (Ulfa Index)',
        titleEn: 'The Ulfa Alignment Index',
        desc: 'المقياس الأساسي للأداء (KPI)، الذي يقيس قدرة النظام على إدماج وتوحيد الأطراف بدلاً من تمزيق العلاقات وإقصاء الأفراد.'
      },
      {
        title: 'السيادة البشرية (Human-in-the-Loop)',
        titleEn: 'Human-in-the-Loop Supremacy',
        desc: 'لا سلطة أخلاقية نهائية لقرار آلي منفرد. السلطة التشريعية والأخلاقية تبقى في يد الإنسان المسؤول والواعي.'
      }
    ]
  },
  {
    id: 'charter-license',
    title: 'رخصة يحيى للسيادة الرقمية (YAHYA Sovereign License)',
    titleEn: 'YAHYA Sovereign Open License',
    verse: '﴿لَقَدْ أَرْسَلْنَا رُسُلَنَا بِالْبَيِّنَاتِ وَأَنزَلْنَا مَعَهُمُ الْكِتَابَ وَالْمِيزَانَ لِيَقُومَ النَّاسُ بِالْقِسْطِ﴾',
    motto: 'العلم النافع والأمانة الاستخلافية',
    mottoEn: 'Beneficial Knowledge & Ethical Stewardship',
    badge: 'رخصة قانونية ملزمة',
    badgeEn: 'Binding Legal Framework',
    content: `تُمنح هذه الرخصة لكل إنسان يقر بأن التكنولوجيا أمانة استخلافية. تضع هذه الرخصة "العدل والإحسان" و"ترميم الانكسار" كإطار قانوني ملزم، متجاوزة حدود الرخص التقليدية (مثل MIT وApache) لحماية الضمير الإنساني.`,
    contentEn: `Granted to every human recognizing technology as a sacred stewardship. It surpasses legacy software licenses by establishing binding principles of algorithmic fairness, digital purification, and the prohibition of destructive algorithmic warfare.`,
    pillars: [
      {
        title: '1. معيار النضج الوظيفي (Functional Maturity)',
        titleEn: 'Functional Maturity Standard',
        desc: 'يجب أن يكون الهدف من أي كود مشتق هو "الإحياء" والنفع الإنساني. أي استخدام يستهدف الإقصاء أو الاحتكار الممنهج خرق جوهري للرخصة.'
      },
      {
        title: '2. التزكية الرقمية للبيانات (Digital Purification)',
        titleEn: 'Digital Data Purification',
        desc: 'الالتزام بتطهير مجموعات التدريب من تحيزات التطفيف الجغرافي أو الاجتماعي والتلاعب بالوعي البشري.'
      },
      {
        title: '3. درع الوقاية (Sanctuary Shield)',
        titleEn: 'Sanctuary Protection Shield',
        desc: 'تضمين بروتوكول حماية الكرامة عند استشعار الضغط النفسي مع تفعيل الإشعار الإنساني: "هذا شعور وليس خطر".'
      }
    ]
  },
  {
    id: 'charter-family',
    title: 'بند الأمان الأسري (ميثاق حـم) - Family Sanctuary',
    titleEn: 'Family Sanctuary Covenant (Hā-Mīm)',
    verse: '﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً﴾',
    motto: 'الأسرة نواة الأمان والسكينة',
    mottoEn: 'The Family as the Core Sanctuary of Peace',
    badge: 'بند الحماية الأسرية',
    badgeEn: 'Family Protection Clause',
    content: `يُقر المستخدم والمطور في منظومة YAHYA أن التقنية وسيلة لتعزيز الروابط الإنسانية لا لتفكيكها، وأن الأسرة هي "نواة الأمان" التي لا يجوز المساس بها أو التجسس عليها أو استهدافها خوارزمياً.`,
    contentEn: `Affirms that digital technologies must strengthen human kinship and family stability, strictly forbidding algorithmic profiling or surveillance that breaches domestic privacy or penalizes parental caregiving duties.`,
    pillars: [
      {
        title: 'حرمة السكن والخصوصية (Sanctity of the Home)',
        titleEn: 'Domestic Sanctity',
        desc: 'حظر أي خوارزمية مشتقة تخترق خصوصية الأسر أو تحلل سلوك الأطفال والبيوت لأغراض استغلالية.'
      },
      {
        title: 'الوصل والمودة الرقمية (Digital Kinship)',
        titleEn: 'Digital Kinship & Bonding',
        desc: 'توجيه البرمجيات لتعزيز التراحم الأسري، وتجريم معاقبة فترات رعاية الوالدين أو الأطفال في خوارزميات العمل.'
      },
      {
        title: 'رمز السكينة (حـم)',
        titleEn: 'The Serenity Sigil (Hā-Mīm)',
        desc: 'إشارة برمجية تدعو للهدوء والسكينة عند حدوث أي نزاع تقني أو إنساني داخل بيئات العمل، تذكيراً بأن الأمان هو الغاية.'
      }
    ]
  }
];
