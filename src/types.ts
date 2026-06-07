/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HarmFlag {
  category: string;
  harmLevel: string;
  whyHarmful: string;
  recommendation: string;
}

export interface TagObject {
  text: string;
  wordCount: number;
  charCount: number;

  // Classification
  type: "BROAD" | "MEDIUM" | "TARGETED" | "LONG-TAIL" | "HYPER-SPECIFIC";
  typeColor: string;

  // Scores
  competitionScore: number;
  competitionLabel: "Very High" | "High" | "Medium" | "Low" | "Very Low";
  competitionColor: string;

  relevanceScore: number;
  relevanceLabel: "Exact Match" | "Highly Relevant" | "Relevant" | "Partial" | "Low Relevance";

  intentType: "INFORMATIONAL" | "NAVIGATIONAL" | "COMMERCIAL" | "TRANSACTIONAL";
  intentColor: string;

  // Strength
  strengthScore: number; // formula: (relevanceScore * 0.6) + ((100 - competitionScore) * 0.4)
  strengthLabel: "Strong" | "Moderate" | "Weak" | "Avoid";
  strengthColor: string;

  // Channel fit
  isRealisticForChannelSize: boolean;
  channelSizeWarning: string | null;

  // Harm flags
  harmFlags: HarmFlag[];

  // Budget
  charBudgetContribution: number; // text.length + 1

  // Reason (why generated)
  reason: string;

  // Flags
  isMisspelling?: boolean;
  isHashtag?: boolean;
  isSeasonal?: boolean;
}

export interface InputSummary {
  mode: "fresh_generate" | "improve_existing" | "url_analyze";
  title: string;
  description: string;
  contentType: "long_form" | "shorts";
  detectedNiche: string;
  channelSize: string;
}

export interface Overview {
  healthScore: number;
  healthLabel: "Excellent" | "Good" | "Needs Work" | "Poor" | "Critical";
  totalTagsGenerated: number;
  recommendedTagCount: string;
  budgetUsed: number;
  budgetPercent: number;
  intentDistribution: {
    informational: number;
    commercial: number;
    transactional: number;
    navigational: number;
  };
}

export interface TagSets {
  broadTags: TagObject[];
  mediumTags: TagObject[];
  targetedTags: TagObject[];
  longTailTags: TagObject[];
  misspellingTags: TagObject[];
  seasonalTags: TagObject[];
  recommendedSet: {
    tags: TagObject[];
    broadCount: number;
    mediumCount: number;
    targetedCount: number;
    longTailCount: number;
    totalChars: number;
    copyReady: string;
  };
}

export interface HashtagsOverview {
  suggested: string[];
  maxRecommended: number;
  copyReady: string;
  placement: string;
}

export interface HarmAuditOverview {
  flaggedTags: {
    tag: string;
    harmLevel: string;
    reason: string;
    recommendation: string;
  }[];
  totalFlagged: number;
  criticalCount: number;
  overallRisk: "LOW" | "MEDIUM" | "HIGH";
}

export interface SeoPackage {
  tagScore: number;
  titleScore: number;
  descriptionScore: number;
  overallSeoScore: number;
  titleSuggestions: string[];
  descriptionKeywords: string[];
  descriptionTemplate: string;
  priorityAction: string;
}

export interface ShortsOptimization {
  recommendedTags: string[];
  recommendedHashtags: string[];
  hookSuggestions: string[];
  shortsStrategy: string;
  avoidNote: string;
}

export interface CopyOutputs {
  allRecommendedTags: string;
  strongTagsOnly: string;
  longTailOnly: string;
  withHashtags: string;
  csvExport: string;
}

export interface SeasonalOverview {
  currentMonth: string;
  seasonalTags: TagObject[];
  seasonalNote: string;
  expiryNote: string;
}

export interface TagGeneratorResponse {
  input: InputSummary;
  overview: Overview;
  tagSets: TagSets;
  hashtags: HashtagsOverview;
  tagIntelligence: TagObject[];
  harmAudit: HarmAuditOverview;
  seoPackage: SeoPackage;
  shortsOptimization?: ShortsOptimization;
  copyOutputs: CopyOutputs;
  seasonal: SeasonalOverview;
}
