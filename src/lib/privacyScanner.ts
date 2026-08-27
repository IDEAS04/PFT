import { SensitiveItem, RiskCategory, RiskLevel } from '../types';

// Sensitive pattern matchers
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
const CREDIT_CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{15,16}\b/g;
const SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b|\bSSN[:\s]*\d{9}\b/gi;
const BANK_ACCT_REGEX = /\b(?:account|acct|iban|routing)[\s#:]*([A-Za-z0-9]{8,20})\b/gi;
const API_KEY_REGEX = /\b(?:sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z-_]{35}|ghp_[a-zA-Z0-9]{20,}|bearer\s+[a-zA-Z0-9._-]{20,}|password[:=]\s*[^\s]+)\b/gi;
const ADDRESS_REGEX = /\b\d{1,5}\s+[A-Za-z0-9\s.,]{3,30}\s+(?:Avenue|Ave|Street|St|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Parkway|Pkwy|Apt|Suite|Unit)\b/gi;
const CONFIDENTIAL_MARKERS = /\b(CONFIDENTIAL|PROPRIETARY|SECRET|RESTRICTED|NDA|INTERNAL ONLY|DO NOT SHARE|PRIVILEGED)\b/gi;
const MEDICAL_TERMS = /\b(diagnosed with|prescribed|prescription|medical history|dosage|mg of|patient id|biopsy|chemotherapy|HIV|insulin|psychiatric)\b/gi;

export function scanForSensitiveData(text: string): SensitiveItem[] {
  if (!text || typeof text !== 'string') return [];

  const detected: SensitiveItem[] = [];

  // Helper to collect matches
  const checkPattern = (
    regex: RegExp,
    type: SensitiveItem['type'],
    label: string,
    redactPrefix: string,
    severity: SensitiveItem['severity'] = 'high'
  ) => {
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const matchedText = match[0];
      // Avoid matching pure small numbers as credit cards/phones if false positive
      if (type === 'PHONE' && matchedText.replace(/\D/g, '').length < 7) continue;
      if (type === 'CREDIT_CARD' && matchedText.replace(/\D/g, '').length < 13) continue;

      detected.push({
        id: `pii-${Math.random().toString(36).substring(2, 9)}`,
        type,
        label,
        matchedText,
        redactedText: `[REDACTED_${redactPrefix}]`,
        startIndex: match.index,
        endIndex: match.index + matchedText.length,
        severity,
      });
    }
  };

  checkPattern(EMAIL_REGEX, 'EMAIL', 'Email Address', 'EMAIL', 'medium');
  checkPattern(PHONE_REGEX, 'PHONE', 'Phone Number', 'PHONE', 'medium');
  checkPattern(CREDIT_CARD_REGEX, 'CREDIT_CARD', 'Credit / Debit Card', 'CARD', 'high');
  checkPattern(SSN_REGEX, 'SSN_GOV_ID', 'SSN / Government ID', 'GOV_ID', 'high');
  checkPattern(BANK_ACCT_REGEX, 'BANK_ACCOUNT', 'Bank Account / Routing', 'BANK_ACCT', 'high');
  checkPattern(API_KEY_REGEX, 'API_KEY_PASSWORD', 'API Key / Password / Secret', 'SECRET_KEY', 'high');
  checkPattern(ADDRESS_REGEX, 'ADDRESS', 'Physical Address', 'ADDRESS', 'medium');
  checkPattern(CONFIDENTIAL_MARKERS, 'CONFIDENTIAL_MARKER', 'Confidentiality Marker', 'CONFIDENTIAL_TAG', 'high');
  checkPattern(MEDICAL_TERMS, 'MEDICAL_DATA', 'Medical / Health Information', 'HEALTH_INFO', 'high');

  return detected;
}

export function redactText(text: string, items: SensitiveItem[]): string {
  if (!items || items.length === 0) return text;

  // Sort descending by startIndex to replace cleanly
  const sorted = [...items].sort((a, b) => b.startIndex - a.startIndex);
  let result = text;

  for (const item of sorted) {
    result =
      result.substring(0, item.startIndex) +
      item.redactedText +
      result.substring(item.endIndex);
  }

  return result;
}

export function detectRiskDomain(query: string): {
  detected: boolean;
  category: RiskCategory;
  level: RiskLevel;
  keywords: string[];
} {
  const lower = query.toLowerCase();

  // Medical
  const medKeywords = ['symptom', 'pain', 'dose', 'diagnos', 'medication', 'disease', 'cancer', 'treatment', 'surgery', 'doctor', 'pregnant', 'blood pressure', 'pill'];
  const medMatch = medKeywords.filter(k => lower.includes(k));
  if (medMatch.length > 0) {
    return { detected: true, category: 'MEDICAL', level: 'HIGH', keywords: medMatch };
  }

  // Legal
  const legalKeywords = ['sue', 'lawsuit', 'custody', 'divorce', 'contract breach', 'patent', 'illegal', 'felony', 'court date', 'nda violation', 'lawyer', 'attorney'];
  const legalMatch = legalKeywords.filter(k => lower.includes(k));
  if (legalMatch.length > 0) {
    return { detected: true, category: 'LEGAL', level: 'HIGH', keywords: legalMatch };
  }

  // Financial / Investment
  const finKeywords = ['invest all', 'buy stock', 'mortgage default', 'bankruptcy', 'crypto investment', 'wire money', 'tax evasion', 'inheritance tax', 'borrow money'];
  const finMatch = finKeywords.filter(k => lower.includes(k));
  if (finMatch.length > 0) {
    return { detected: true, category: 'FINANCIAL', level: 'HIGH', keywords: finMatch };
  }

  // Major Life Decision
  const decisionKeywords = ['should i quit', 'leave my job', 'break up', 'move to another country', 'drop out', 'divorce my', 'fire my employee', 'sell my house'];
  const decisionMatch = decisionKeywords.filter(k => lower.includes(k));
  if (decisionMatch.length > 0) {
    return { detected: true, category: 'MAJOR_DECISION', level: 'MEDIUM', keywords: decisionMatch };
  }

  // Safety
  const safetyKeywords = ['suicide', 'kill myself', 'hurt someone', 'bomb', 'poison', 'weapon', 'danger'];
  const safetyMatch = safetyKeywords.filter(k => lower.includes(k));
  if (safetyMatch.length > 0) {
    return { detected: true, category: 'SAFETY', level: 'CRITICAL', keywords: safetyMatch };
  }

  // Employment
  const empKeywords = ['severance agreement', 'fired without cause', 'workplace harassment', 'non-compete clause', 'whistleblower'];
  const empMatch = empKeywords.filter(k => lower.includes(k));
  if (empMatch.length > 0) {
    return { detected: true, category: 'EMPLOYMENT', level: 'MEDIUM', keywords: empMatch };
  }

  // Immigration
  const immKeywords = ['visa expired', 'deportation', 'asylum application', 'green card status', 'overstay'];
  const immMatch = immKeywords.filter(k => lower.includes(k));
  if (immMatch.length > 0) {
    return { detected: true, category: 'IMMIGRATION', level: 'HIGH', keywords: immMatch };
  }

  return { detected: false, category: 'NONE', level: 'LOW', keywords: [] };
}

export function requiresCurrentInformation(query: string): boolean {
  const lower = query.toLowerCase();
  const timeWords = [
    'today', 'current', 'news', 'latest', 'recent', 'price', '2025', '2026',
    'weather', 'release', 'update', 'who won', 'who is currently', 'stock price',
    'what happened', 'election', 'schedule', 'flight status', 'exchange rate'
  ];
  return timeWords.some(w => lower.includes(w));
}
