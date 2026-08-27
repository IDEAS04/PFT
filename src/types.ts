export type ProcessingMode = 'local' | 'cloud';

export type GroundingEngine = 'hybrid' | 'grok' | 'chatgpt' | 'local';

export type GeminiModelId = 'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'auto';

export interface ChatbotRole {
  id: string;
  name: string;
  badge: string;
  model: GeminiModelId;
  description: string;
  systemInstruction: string;
  icon: string;
}

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RiskCategory =
  | 'NONE'
  | 'MEDICAL'
  | 'LEGAL'
  | 'FINANCIAL'
  | 'SAFETY'
  | 'EMPLOYMENT'
  | 'IMMIGRATION'
  | 'COMPLIANCE'
  | 'MAJOR_DECISION';

export interface SensitiveItem {
  id: string;
  type:
    | 'EMAIL'
    | 'PHONE'
    | 'CREDIT_CARD'
    | 'SSN_GOV_ID'
    | 'BANK_ACCOUNT'
    | 'API_KEY_PASSWORD'
    | 'ADDRESS'
    | 'MEDICAL_DATA'
    | 'CONFIDENTIAL_MARKER';
  label: string;
  matchedText: string;
  redactedText: string;
  startIndex: number;
  endIndex: number;
  severity: 'high' | 'medium' | 'low';
}

export interface GroundingSource {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet?: string;
  publishedDate?: string;
  trustScore: number; // 1-100
  reliabilityRating: 'High' | 'Medium' | 'Unverified';
  category?: string;
}

export interface EvidenceItem {
  id: string;
  claim: string;
  classification: 'VERIFIED' | 'INFERENCE' | 'OPINION' | 'UNCERTAINTY' | 'UNKNOWN';
  sources: string[]; // Source IDs or titles
  confidenceNotes: string;
}

export interface RiskAnalysis {
  detected: boolean;
  category: RiskCategory;
  level: RiskLevel;
  whatIsKnown: string[];
  whatIsUnknown: string[];
  potentialConsequences: string[];
  recommendedNextStep: string;
  disclaimer: string;
}

export interface DecisionFactor {
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  timeframe: 'short-term' | 'long-term' | 'ongoing';
}

export interface DecisionOption {
  id: string;
  title: string;
  advantages: string[];
  disadvantages: string[];
  financialImpact: string;
  careerPersonalImpact: string;
  shortTermRisks: string[];
  longTermRisks: string[];
}

export interface DecisionEvaluation {
  goal: string;
  options: DecisionOption[];
  alternatives: string[];
  missingInformation: string[];
  possibleOutcomes: string[];
  frameworkSummary: string;
}

export interface ConsequentialActionRequest {
  id: string;
  actionTitle: string;
  actionCategory:
    | 'READ_DOCUMENTS'
    | 'USE_LOCATION'
    | 'ACCESS_CONTACTS'
    | 'SEND_MESSAGE'
    | 'BOOK_APPOINTMENT'
    | 'MAKE_PURCHASE'
    | 'MODIFY_ACCOUNT'
    | 'TRANSFER_MONEY';
  whatWillDo: string;
  whyDoIt: string;
  dataUsed: string[];
  potentialConsequences: string[];
  requiresExplicitSignature: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: number;
}

export interface ActionAuditItem {
  id: string;
  timestamp: number;
  action: string;
  category: string;
  permissionRequired: string;
  status: 'Awaiting approval' | 'Approved' | 'Blocked' | 'Completed' | 'Rejected';
  details: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'pft';
  text: string;
  timestamp: number;
  mode: ProcessingMode;
  engine?: GroundingEngine;
  modelUsed?: string;
  roleId?: string;
  roleName?: string;
  confidence?: ConfidenceLevel;
  sources?: GroundingSource[];
  evidence?: EvidenceItem[];
  riskAnalysis?: RiskAnalysis;
  decisionEvaluation?: DecisionEvaluation;
  pendingAction?: ConsequentialActionRequest;
  privacyNotice?: string;
  wasRedacted?: boolean;
  redactedOriginal?: string;
  tokensCount?: number;
  searchGrounded?: boolean;
  sourcesAgreementRate?: number; // 0 - 100%
  conflictingInfo?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  mode: ProcessingMode;
}

export interface MemoryItem {
  id: string;
  category: 'preference' | 'context' | 'instruction';
  content: string;
  savedReason: string;
  createdAt: number;
  updatedAt: number;
}

export interface OutboundNetworkLog {
  id: string;
  timestamp: number;
  endpoint: string;
  service: 'Google Gemini' | 'Google Search Grounding' | 'Local Engine (0 Remote Traffic)';
  purpose: string;
  payloadSummary: string;
  bytesSent: number;
  retentionPolicy: string;
  encryptionStatus: string;
  piiChecked: boolean;
}

export interface PermissionSettings {
  readDocuments: boolean;
  useLocation: boolean;
  accessContacts: boolean;
  sendMessage: boolean;
  bookAppointment: boolean;
  makePurchase: boolean;
  modifyAccount: boolean;
  transferMoneyAlwaysAsk: boolean; // Always true
}

export interface DocumentAnalysisResult {
  fileName: string;
  fileSize: number;
  fileType: string;
  textSnippet: string;
  modeUsed: ProcessingMode;
  piiDetected: SensitiveItem[];
  summary: string;
  keyClauses: { title: string; explanation: string; risk: 'low' | 'medium' | 'high' }[];
  missingProvisions: string[];
  recommendations: string[];
}
