export interface BiasAuditMetric {
  id: string;
  name: string;
  nameEn: string;
  category: 'geographic' | 'demographic' | 'socioeconomic' | 'historical_proxy';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedWeight: number; // e.g. 0.35 (35% unfair penalty)
  purifiedWeight: number; // target fair weight e.g. 0.05
  description: string;
  descriptionEn: string;
  mitigationAction: string;
  mitigationActionEn: string;
  purified: boolean;
}

export interface DecisionFactor {
  id: string;
  label: string;
  labelEn: string;
  rawScore: number; // 0 - 100
  weight: number; // 0 - 1
  impact: 'positive' | 'negative' | 'neutral';
  explanation: string;
  explanationEn: string;
  isBlackBoxPenalty?: boolean;
}

export interface RevivalStep {
  id: string;
  order: number;
  title: string;
  titleEn: string;
  category: 'documentary' | 'upskilling' | 'financial_metric' | 'governance_clarification';
  description: string;
  descriptionEn: string;
  requiredAction: string;
  requiredActionEn: string;
  estimatedEffort: string;
  impactScoreIncrease: number; // percentage points regained
  completed: boolean;
}

export interface ApplicationDecisionCase {
  id: string;
  title: string;
  titleEn: string;
  domain: 'financing' | 'recruitment' | 'education' | 'public_service';
  applicantName: string;
  submittedAt: string;
  initialOutcome: 'rejected' | 'flagged' | 'under_review';
  initialScore: number; // 0 - 100
  passThreshold: number; // e.g. 75
  rejectionReasonSummary: string;
  rejectionReasonSummaryEn: string;
  
  // A.E.R Data
  auditMetrics: BiasAuditMetric[];
  factors: DecisionFactor[];
  revivalRoadmap: RevivalStep[];
  
  // HITL (Human In The Loop) Review
  hitlReviewer?: string;
  hitlStatus: 'pending' | 'verified_fair' | 'rectified';
  legalSovereigntyClause: string;
}

export interface UlfaIndexStats {
  score: number; // 0 - 100
  jabrIntegrity: number; // 0 - 100 (Structural Integrity / قوة الهيكل)
  mikyālEmpathy: number; // 0 - 100 (Empathy & Revitalization / فيض المدد)
  purifiedRatio: number; // percentage of bias neutralized
  activeSanctuaryShield: boolean;
}
