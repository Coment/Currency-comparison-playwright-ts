export const FAILURE_CATEGORIES = [
  'locator',
  'network',
  'assertion',
  'test-data',
  'timeout',
  'application',
  'unknown',
] as const;

export type FailureCategory = (typeof FAILURE_CATEGORIES)[number];

export interface FailureContext {
  testTitle: string;
  titlePath: string[];
  projectName: string;
  tags: string[];
  status: string;
  expectedStatus: string;
  retry: number;
  durationMs: number;
  source: {
    file: string;
    featureFile?: string;
    line: number;
    column: number;
  };
  errors: Array<{
    message?: string;
    stack?: string;
    snippet?: string;
  }>;
  attachments: Array<{
    name: string;
    contentType: string;
    text?: string;
  }>;
}

export interface FailureAnalysisInput {
  context: FailureContext;
  screenshotDataUrl?: string;
}

export interface FailureRecommendation {
  category: FailureCategory;
  confidence: number;
  summary: string;
  evidence: string[];
  recommendations: string[];
  suspectedFiles: string[];
  requiresHumanReview: boolean;
}

export interface FailureAnalyzer {
  analyze(input: FailureAnalysisInput): Promise<FailureRecommendation>;
}
