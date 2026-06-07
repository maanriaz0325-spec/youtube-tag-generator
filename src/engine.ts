/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TagObject,
  HarmFlag,
  InputSummary,
  Overview,
  TagSets,
  HashtagsOverview,
  HarmAuditOverview,
  SeoPackage,
  ShortsOptimization,
  CopyOutputs,
  SeasonalOverview,
  TagGeneratorResponse
} from './types';

// Niche Taxonomy
export const NICHE_TAXONOMY: Record<string, { keywords: string[]; rpmTier: 'high' | 'medium' | 'low' }> = {
  finance: {
    keywords: ['invest', 'stock', 'crypto', 'money', 'budget', 'trading', 'wealth', 'etf', 'dividend', 'portfolio', 'finance', 'investing', 'shares', 'bitcoin', 'saving'],
    rpmTier: 'high'
  },
  tech: {
    keywords: ['tech', 'software', 'coding', 'ai', 'phone', 'laptop', 'review', 'developer', 'programming', 'chatgpt', 'iphone', 'android', 'gadget', 'windows', 'linux', 'macbook'],
    rpmTier: 'high'
  },
  gaming: {
    keywords: ['game', 'gaming', 'gameplay', 'fps', 'minecraft', 'xbox', 'ps5', 'esports', 'walkthrough', 'playthrough', 'streamer', 'nintendo', 'twitch', 'fortnite', 'roblox'],
    rpmTier: 'medium'
  },
  education: {
    keywords: ['learn', 'tutorial', 'course', 'study', 'explained', 'lesson', 'university', 'school', 'science', 'math', 'history', 'physics', 'educational', 'teacher'],
    rpmTier: 'high'
  },
  health: {
    keywords: ['fitness', 'workout', 'diet', 'health', 'yoga', 'nutrition', 'gym', 'wellness', 'cardio', 'weightloss', 'muscles', 'strength', 'healthy'],
    rpmTier: 'medium'
  },
  cooking: {
    keywords: ['recipe', 'cook', 'food', 'kitchen', 'meal', 'baking', 'restaurant', 'chef', 'dessert', 'dinner', 'lunch', 'breakfast', 'culinary', 'taste'],
    rpmTier: 'medium'
  },
  beauty: {
    keywords: ['makeup', 'skincare', 'beauty', 'fashion', 'style', 'hairstyle', 'outfit', 'cosmetics', 'glow', 'transformation', 'clothing', 'routine'],
    rpmTier: 'medium'
  },
  travel: {
    keywords: ['travel', 'trip', 'destination', 'explore', 'adventure', 'vlog', 'hotel', 'flight', 'backpacking', 'wanderlust', 'tourism', 'itinerary', 'vacation'],
    rpmTier: 'low'
  },
  business: {
    keywords: ['business', 'entrepreneur', 'startup', 'marketing', 'ecommerce', 'sales', 'brand', 'agency', 'dropshipping', 'side hustle', 'passive income', 'smma'],
    rpmTier: 'high'
  },
  entertainment: {
    keywords: ['funny', 'comedy', 'prank', 'reaction', 'challenge', 'viral', 'celebrity', 'movie', 'vlog', 'music', 'pop culture', 'drama', 'show', 'entertainment'],
    rpmTier: 'low'
  }
};

// Content type signals
export const CONTENT_SIGNALS = {
  tutorial: ['how to', 'tutorial', 'guide', 'learn', 'step by step', 'beginner', 'course', 'basics'],
  review: ['review', 'vs', 'comparison', 'best', 'worth it', 'honest', 'unboxing', 'rating'],
  news: ['breaking', 'update', 'news', 'just happened', 'explained', 'today', 'current events', 'latest'],
  entertainment: ['vlog', 'day in my life', 'story time', 'reacting', 'challenge', 'prank', 'funny', 'watch me'],
  educational: ['explained', 'what is', 'why', 'science', 'history', 'facts', 'know', 'discover'],
};

// Overused Keywords database
export const OVERUSED_WORDS = [
  'viral', 'funny', 'amazing', 'best ever', 'must watch',
  'you wont believe', 'shocking', 'insane', 'epic', 'omg',
  'watch this now', 'dont skip', 'important', 'youtube', 'video',
  'channel', 'subscribe', 'like', 'comment', 'new video', 'today'
];

// Avoid tags database for harm auditing
export const AVOID_TAGS_DATABASE = {
  clickbait: {
    tags: ['viral', 'viral video', 'going viral', 'must watch', 'you wont believe', 'shocking', 'unbelievable', 'mind blowing', 'insane', 'omg', 'watch this now', 'dont skip', 'important'],
    harmLevel: 'HIGH',
    whyHarmful: "YouTube algorithm detects mismatch between tag promise and viewer behavior. If viewers click expecting viral/shocking content but find normal tutorial, watch time/CTR drops and the video gets suppressed.",
    recommendation: "Only use these if your content ACTUALLY delivers on a literal shocking/viral event."
  },
  overused: {
    tags: ['youtube', 'video', 'channel', 'subscribe', 'like', 'comment', 'new video', 'today', 'watch', 'content creator'],
    harmLevel: 'MEDIUM',
    whyHarmful: "These tags have astronomical competition and zero specificity. They dilute your tag metadata set without adding discovery values, wasting your 500-char budget.",
    recommendation: "Remove and replace with specific, unique niche tags."
  },
  spam: {
    tags: ['sub4sub', 'like4like', 'free subscribers', 'get more views', 'youtube growth hack', 'algorithm hack'],
    harmLevel: 'VERY HIGH',
    whyHarmful: "These tags are heavily blacklisted or filtered by YouTube's spam detection systems. Using them may cause your video to be buried or flagged.",
    recommendation: "Remove immediately."
  },
  inappropriate: {
    tags: ['18+', 'nsfw', 'adult', 'mature content', 'explicit'],
    harmLevel: 'CRITICAL',
    whyHarmful: "These triggers trigger automatic age-restriction or demonetization filters, regardless of actual video content.",
    recommendation: "Remove immediately unless the video genuinely requires age-restriction."
  }
};

// Power words and Emotional triggers for Title Optimization
export const POWER_WORDS = ['revolutionary', 'ultimate', 'essential', 'proven', 'shocking', 'unbelievable', 'complete', 'amazing', 'secrets', 'hacks', 'tips', 'guide', 'best', 'fast', 'easy', 'quick', 'free', 'new', 'now'];
export const EMOTIONAL_TRIGGERS = ['fear', 'mistakes', 'lose', 'gain', 'master', 'save', 'win', 'stop', 'start', 'worst', 'perfect', 'success', 'fail', 'dangerous', 'safe', 'smart', 'regret'];

// Normalizes text input for keyword tokenization
export function normalizeText(text: string): string[] {
  const clean = text.toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove special characters except spaces, hyphens, underscores
    .replace(/\s+/g, ' ')
    .trim();
  return clean.split(' ').filter(word => word.length > 0);
}

// Simple stopword checker
export function removeStopwords(tokens: string[]): string[] {
  const stopwords = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
    'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
    'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres',
    'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is',
    'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of',
    'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
    'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats',
    'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll',
    'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt',
    'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which',
    'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll',
    'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves'
  ]);
  return tokens.filter(t => !stopwords.has(t));
}

// Detect dominant signal
export function findDominantSignal(titleTokens: string[]): string {
  const text = titleTokens.join(' ');
  let maxCount = 0;
  let dominant = 'tutorial'; // default fallback

  for (const [key, signals] of Object.entries(CONTENT_SIGNALS)) {
    let count = 0;
    for (const signal of signals) {
      if (text.includes(signal)) {
        count += 2; // heavier weight for exact phrase matches
      }
    }
    if (count > maxCount) {
      maxCount = count;
      dominant = key;
    }
  }
  return dominant;
}

// Detect Niche from taxonomy keyword matches
export function detectNiche(text: string): string {
  const normText = text.toLowerCase();
  let bestNiche = 'tech'; // default
  let maxMatches = -1;

  for (const [niche, data] of Object.entries(NICHE_TAXONOMY)) {
    let matches = 0;
    for (const kw of data.keywords) {
      if (normText.includes(kw)) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestNiche = niche;
    }
  }
  return bestNiche;
}

// Generate misspellings of primary terms (>6 chars) to hijack typo traffic safely
export function generateMisspellings(keyword: string): string[] {
  if (keyword.length <= 6) return [];
  const lowercase = keyword.toLowerCase();
  const misspellings: string[] = [];

  // 1. Double letter confusion (e.g., investing -> invessting/investting)
  if (lowercase.includes('s')) misspellings.push(lowercase.replace('s', 'ss'));
  if (lowercase.includes('t')) misspellings.push(lowercase.replace('t', 'tt'));

  // 2. Phonetic/omitted letters (omitting vowels or key consonants)
  const omitted = lowercase.replace(/[aeiou]/g, (match, offset) => {
    return offset === 0 ? match : ''; // don't omit starting vowel
  });
  if (omitted !== lowercase && omitted.length > 4) {
    misspellings.push(omitted);
  }

  // 3. Transposed letters (e.g., finance -> finacne)
  if (lowercase.length >= 6) {
    const chars = lowercase.split('');
    const midIndex = Math.floor(chars.length / 2);
    // swap two middle letters
    const temp = chars[midIndex];
    chars[midIndex] = chars[midIndex + 1];
    chars[midIndex + 1] = temp;
    misspellings.push(chars.join(''));
  }

  return Array.from(new Set(misspellings)).slice(0, 2);
}

// Assigns Competition Score (1 - 100) based on formula
export function calculateCompetitionScore(tag: string, niche: string): number {
  const wordCount = tag.split(' ').length;
  let baseScore = 40;

  if (wordCount === 1) baseScore = 90;
  else if (wordCount === 2) baseScore = 65;
  else if (wordCount === 3) baseScore = 45;
  else if (wordCount >= 4 && wordCount <= 5) baseScore = 22;
  else baseScore = 10;

  // Niche competition modifier
  let nicheModifier = 0;
  if (niche === 'gaming') nicheModifier = 15;
  else if (niche === 'entertainment') nicheModifier = 12;
  else if (niche === 'cooking') nicheModifier = 8;
  else if (niche === 'finance') nicheModifier = 5;
  else if (niche === 'education') nicheModifier = 3;
  else nicheModifier = -10; // less saturated for obscure categories

  // Overused/clickbait modifiers
  let overusedModifier = 0;
  for (const ow of OVERUSED_WORDS) {
    if (tag.toLowerCase().includes(ow)) {
      overusedModifier += 10;
    }
  }
  if (overusedModifier > 20) overusedModifier = 20;

  // Recency modifier (reduces competition offset slightly)
  const currentYear = new Date().getFullYear();
  let yearModifier = 0;
  if (tag.includes(String(currentYear)) || tag.includes(String(currentYear + 1))) {
    yearModifier = -8;
  } else if (tag.match(/\b(201\d|202[0-3])\b/)) {
    yearModifier = -3;
  }

  const finalScore = baseScore + nicheModifier + overusedModifier + yearModifier;
  return Math.min(100, Math.max(1, finalScore));
}

// Assigns Relevance Score (0 - 100)
export function calculateRelevanceScore(tag: string, title: string, description: string, detectedNiche: string): number {
  const normTag = tag.toLowerCase();
  const normTitle = title.toLowerCase();
  const normDesc = description.toLowerCase();

  let phraseMatchScore = 0;
  if (normTitle.includes(normTag)) {
    phraseMatchScore = 40;
  } else if (normDesc.includes(normTag)) {
    phraseMatchScore = 20;
  }

  // Word overlap comparison
  const tagWords = normTag.split(' ').filter(w => w.length > 1);
  const contextWords = (normTitle + ' ' + normDesc).split(/\s+/).filter(w => w.length > 1);
  const matchingWords = tagWords.filter(w => contextWords.includes(w));
  const wordOverlapScore = tagWords.length > 0 ? (matchingWords.length / tagWords.length) * 40 : 0;

  // Semantic niche match
  const tagNiche = detectNiche(normTag);
  const categoryScore = tagNiche === detectedNiche ? 20 : 0;

  const totalScore = phraseMatchScore + wordOverlapScore + categoryScore;
  return Math.min(100, Math.round(totalScore));
}

// Intent Classifier
export function detectIntent(tag: string): 'INFORMATIONAL' | 'NAVIGATIONAL' | 'COMMERCIAL' | 'TRANSACTIONAL' {
  const text = tag.toLowerCase();
  
  const informationalSignals = ['how to', 'what is', 'why', 'explained', 'guide', 'learn', 'tutorial', 'tips', 'diy', 'steps'];
  const commercialSignals = ['best', 'top', 'review', 'vs', 'comparison', 'worth', 'should i', 'pricing', 'alternative'];
  const transactionalSignals = ['buy', 'get', 'start', 'open', 'sign up', 'download', 'deal', 'cheap', 'discount', 'coupon'];
  const navigationalSignals = ['official', 'channel', 'brand', 'website', 'sign in', 'login', 'creator', 'podcast'];

  if (informationalSignals.some(s => text.includes(s))) return 'INFORMATIONAL';
  if (commercialSignals.some(s => text.includes(s))) return 'COMMERCIAL';
  if (transactionalSignals.some(s => text.includes(s))) return 'TRANSACTIONAL';
  if (navigationalSignals.some(s => text.includes(s))) return 'NAVIGATIONAL';

  // default to informational or navigational depending on structure
  return text.split(' ').length <= 2 ? 'NAVIGATIONAL' : 'INFORMATIONAL';
}

// Audits a tag for potential algorithmic harms
export function auditTagForHarm(tag: string, contentType: 'long_form' | 'shorts'): HarmFlag[] {
  const normTag = tag.toLowerCase();
  const flags: HarmFlag[] = [];

  for (const [category, item] of Object.entries(AVOID_TAGS_DATABASE)) {
    if (item.tags.some(t => normTag === t || normTag.includes(t))) {
      flags.push({
        category: category.toUpperCase(),
        harmLevel: item.harmLevel,
        whyHarmful: item.whyHarmful,
        recommendation: item.recommendation
      });
    }
  }

  // Clickbait vs educational content mismatch
  const clickbaitTriggers = ['viral', 'mind blowing', 'insane', 'shocking', 'omg'];
  if (clickbaitTriggers.some(t => normTag.includes(t)) && contentType === 'long_form') {
    flags.push({
      category: 'REDUNDANT CLICKBAIT',
      harmLevel: 'MEDIUM',
      whyHarmful: 'Using hyper-clickbait keywords on standard long-form videos leads to viewer demographic mismatches. Viewers drop off quickly when expectations are not met, ruining retention metrics.',
      recommendation: 'Replace with descriptive keyword phrases matching the actual learning outcome.'
    });
  }

  return flags;
}

// Mapping of channel size capabilities
export const CHANNEL_TIERS: Record<string, { subscribers: string; canRankUpTo: number }> = {
  micro: { subscribers: '< 10K', canRankUpTo: 45 },  // focus on low competition (<45)
  small: { subscribers: '10K-50K', canRankUpTo: 60 }, // can rank for medium (<60)
  mid: { subscribers: '50K-200K', canRankUpTo: 75 },  // can rank for high-medium (<75)
  large: { subscribers: '200K-1M', canRankUpTo: 85 }, // can rank for high (<85)
  mega: { subscribers: '1M+', canRankUpTo: 100 }     // can target all
};

// Character Budget Manager Simulation
export class CharacterConfig {
  static maxBudget = 500;
}

// Maps competition scores to UI badges
export function gCompetitionMeta(score: number): { label: 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low'; color: string } {
  if (score >= 80) return { label: 'Very High', color: 'red' };
  if (score >= 60) return { label: 'High', color: 'orange' };
  if (score >= 40) return { label: 'Medium', color: 'amber' };
  if (score >= 20) return { label: 'Low', color: 'green' };
  return { label: 'Very Low', color: 'teal' };
}

// Maps relevance score to labels
export function gRelevanceMeta(score: number): 'Exact Match' | 'Highly Relevant' | 'Relevant' | 'Partial' | 'Low Relevance' {
  if (score >= 80) return 'Exact Match';
  if (score >= 60) return 'Highly Relevant';
  if (score >= 40) return 'Relevant';
  if (score >= 20) return 'Partial';
  return 'Low Relevance';
}

// Seasonal Tag Engine data lookup
export function getSeasonalMetadata(niche: string, monthValue?: number): { tags: string[]; displayNote: string; expiryNote: string; currentMonth: string } {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthNum = typeof monthValue === 'number' ? monthValue : new Date().getMonth() + 1; // 1-indexed
  const monthName = monthNames[currentMonthNum - 1];

  const OPPORTUNITIES: Record<number, { universal: string[]; [key: string]: string[] }> = {
    1: { // January
      universal: ["new year planning", "goals 2026", "fresh start", "new year resolution"],
      finance: ["financial plan 2026", "new year budget", "money resolutions"],
      health: ["new year workout", "january diet", "fitness resolution"],
      business: ["business strategy 2026", "goals for entrepreneurs"]
    },
    2: { // February
      universal: ["valentines day prep", "winter design tips", "february ideas"],
      cooking: ["valentines day recipe", "romantic dinner ideas"],
      beauty: ["valentines day makeup", "date night outfit ideas"]
    },
    3: { // March
      universal: ["spring cleaning", "march update", "spring fashion"],
      finance: ["tax file guide", "tax returns 2026", "maximize writeoffs"],
      education: ["study schedule exams", "spring break learning"]
    },
    4: { // April
      universal: ["spring travel", "earth day", "tax season deadline"],
      finance: ["last minute taxes", "financial health audit"],
      cooking: ["easter recipes", "spring baking ideas"]
    },
    5: { // May
      universal: ["summer vibes", "mid year review", "memorial day"],
      travel: ["summer travel guide", "best booking deals"],
      cooking: ["bbq recipes", "healthy summer meal prep"]
    },
    6: { // June
      universal: ["summer solstice", "half year checkpoint", "midyear goals"],
      fitness: ["summer cutting diet", "beach body preparation"],
      gaming: ["e3 alternative stream", "summer steam sale games"]
    },
    7: { // July
      universal: ["independence day", "mid summer vlog", "july update"],
      travel: ["road trip packing", "budget travel destinations"],
      tech: ["prime day tech deals", "smart home upgrades"]
    },
    8: { // August
      universal: ["back to school hacks", "august weather", "end of summer"],
      education: ["school supply haul", "student study habits", "back to school tips"],
      tech: ["best student laptop", "perfect dorm room tech"]
    },
    9: { // September
      universal: ["autumn aesthetic", "fall starts", "q4 planning"],
      business: ["q4 sales strategy", "pre holiday growth plan"],
      education: ["school organization ideas", "semester productivity tip"]
    },
    10: { // October
      universal: ["halloween party", "spooky season", "autumn mood"],
      cooking: ["pumpkin spice recipe", "halloween baking tutorials"],
      beauty: ["easy halloween makeup", "fall cozy layers style"]
    },
    11: { // November
      universal: ["black friday deals", "thanksgiving planning", "holiday shopping guide"],
      finance: ["black friday savings", "cyber monday tips"],
      tech: ["cyber monday laptop deals", "smartphone shopping tips"]
    },
    12: { // December
      universal: ["christmas vlog", "new year countdown", "year wrap up", "recap of 2025"],
      finance: ["tax loss harvesting", "holiday budgeting guide"],
      cooking: ["christmas dinner recipe", "easy holiday desserts"]
    }
  };

  const currentOpp = OPPORTUNITIES[currentMonthNum] || OPPORTUNITIES[1];
  const tags: string[] = [];

  tags.push(...(currentOpp.universal || []));
  if (currentOpp[niche]) {
    tags.push(...currentOpp[niche]);
  }

  return {
    tags: tags.slice(0, 5),
    displayNote: `It is currently ${monthName} — these seasonal topics are highly search-relevant with temporary competitive advantages.`,
    expiryNote: "These lose algorithm search volume after this season ends. Remember to rotate them out.",
    currentMonth: monthName
  };
}

// Assembles a tag object with all metrics
export function buildTagObject(
  text: string,
  title: string,
  description: string,
  niche: string,
  contentType: 'long_form' | 'shorts',
  channelSize: string,
  reason: string,
  isMisspelling = false,
  isSeasonal = false
): TagObject {
  const words = text.split(' ').filter(w => w.length > 0);
  const wordCount = words.length;
  const charCount = text.length;

  // Type tag
  let type: TagObject['type'] = "TARGETED";
  let typeColor = "indigo";
  if (wordCount === 1) {
    type = "BROAD";
    typeColor = "slate";
  } else if (wordCount === 2) {
    type = "MEDIUM";
    typeColor = "blue";
  } else if (wordCount === 3) {
    type = "TARGETED";
    typeColor = "indigo";
  } else if (wordCount >= 4 && wordCount <= 5) {
    type = "LONG-TAIL";
    typeColor = "green";
  } else {
    type = "HYPER-SPECIFIC";
    typeColor = "amber";
  }

  // Scores
  const competitionScore = calculateCompetitionScore(text, niche);
  const compMeta = gCompetitionMeta(competitionScore);

  const relevanceScore = calculateRelevanceScore(text, title, description, niche);
  const relevanceLabel = gRelevanceMeta(relevanceScore);

  const intentType = detectIntent(text);
  const intentColors = {
    INFORMATIONAL: 'blue',
    NAVIGATIONAL: 'violet',
    COMMERCIAL: 'amber',
    TRANSACTIONAL: 'teal'
  };

  // Strength Formula: (Relevance * 0.6) + ((100 - Competition) * 0.4)
  const strengthScore = Math.min(100, Math.round((relevanceScore * 0.60) + ((100 - competitionScore) * 0.40)));
  let strengthLabel: TagObject['strengthLabel'] = "Moderate";
  let strengthColor = "amber";

  if (strengthScore >= 75) {
    strengthLabel = "Strong";
    strengthColor = "green";
  } else if (strengthScore >= 45) {
    strengthLabel = "Moderate";
    strengthColor = "blue";
  } else if (strengthScore >= 25) {
    strengthLabel = "Weak";
    strengthColor = "slate";
  } else {
    strengthLabel = "Avoid";
    strengthColor = "red";
  }

  // Channel rank check
  const tier = CHANNEL_TIERS[channelSize] || CHANNEL_TIERS.micro;
  const isRealistic = competitionScore <= tier.canRankUpTo || channelSize === 'mega';
  const warning = !isRealistic
    ? `⚠ High competition for subscriber density tier is challenging to rank in early hours.`
    : null;

  const harmFlags = auditTagForHarm(text, contentType);

  return {
    text,
    wordCount,
    charCount,
    type,
    typeColor,
    competitionScore,
    competitionLabel: compMeta.label,
    competitionColor: compMeta.color,
    relevanceScore,
    relevanceLabel,
    intentType,
    intentColor: intentColors[intentType],
    strengthScore,
    strengthLabel,
    strengthColor,
    isRealisticForChannelSize: isRealistic,
    channelSizeWarning: warning,
    harmFlags,
    charBudgetContribution: text.length + 1, // include comma spacing contribution
    reason,
    isMisspelling,
    isSeasonal
  };
}

// Programmatic core fallback generators (in case of connection errors or API missing)
export function expandSeedProgrammatically(seed: string): string[] {
  const norm = seed.toLowerCase().trim();
  const variations: string[] = [];

  variations.push(norm); // direct
  
  const segments = norm.split(' ').filter(s => s.length > 2);
  if (segments.length > 0) {
    // broads
    segments.forEach(s => variations.push(s));
  }

  // Question prefix additions
  variations.push(`how to ${norm}`);
  variations.push(`learn ${norm}`);
  variations.push(`what is ${norm}`);

  // qualifier additions
  const currentYear = new Date().getFullYear();
  variations.push(`${norm} tutorial`);
  variations.push(`${norm} for beginners`);
  variations.push(`${norm} ${currentYear}`);
  variations.push(`best ${norm}`);

  if (segments.length >= 2) {
    variations.push(`${segments[0]} vs ${segments[1]}`);
    variations.push(`${segments[0]} tutorial`);
  }

  return Array.from(new Set(variations)).filter(v => v.length > 2);
}

// Core tag filtering budget engine
export function applyTagSelectionBudget(allTags: TagObject[]): TagObject[] {
  // Select top tags honoring 500 characters comma length limit
  const selected: TagObject[] = [];
  let currentUsage = 0;

  // Prioritize tags without harmful flags, sorted by strengthScore descending
  const sorted = [...allTags]
    .filter(t => t.harmFlags.length === 0)
    .sort((a, b) => b.strengthScore - a.strengthScore);

  for (const tag of sorted) {
    const projectedLength = currentUsage + (selected.length > 0 ? 1 : 0) + tag.text.length;
    if (projectedLength <= 485) { // leave safety buffer for tags
      selected.push(tag);
      currentUsage = projectedLength;
    }
  }

  return selected;
}

// Tag Health Score calculator
export function calculateTagHealth(selectedTags: TagObject[], contentType: 'long_form' | 'shorts'): Overview {
  const tagCount = selectedTags.length;

  // Factor 1: Count Optimization (15%)
  let countScore = 20;
  if (contentType === 'shorts') {
    countScore = tagCount >= 3 && tagCount <= 5 ? 100 : tagCount >= 2 ? 70 : 30;
  } else {
    countScore = tagCount >= 10 && tagCount <= 16 ? 100 : tagCount >= 7 && tagCount <= 19 ? 85 : tagCount >= 4 ? 60 : 30;
  }

  // Factor 2: Character Budget (15%)
  const charsUsed = selectedTags.map(t => t.text).join(',').length;
  const budgetPercent = Math.min(100, (charsUsed / 500) * 100);
  let budgetScore = 20;
  if (contentType === 'shorts') {
    budgetScore = budgetPercent >= 30 && budgetPercent <= 70 ? 100 : budgetPercent > 70 ? 80 : 50;
  } else {
    budgetScore = budgetPercent >= 75 && budgetPercent <= 96 ? 100 : budgetPercent >= 60 && budgetPercent < 75 ? 85 : budgetPercent > 96 ? 75 : 40;
  }

  // Factor 3: Type Diversity (20%)
  const types = {
    broad: selectedTags.filter(t => t.wordCount === 1).length,
    medium: selectedTags.filter(t => t.wordCount === 2).length,
    targeted: selectedTags.filter(t => t.wordCount === 3).length,
    longTail: selectedTags.filter(t => t.wordCount >= 4).length
  };
  const typeDiversityCount = Object.values(types).filter(v => v > 0).length;
  const diversityScore = typeDiversityCount === 4 ? 100 : typeDiversityCount === 3 ? 80 : typeDiversityCount === 2 ? 60 : 30;

  // Factor 4: average relevance (25%)
  const avgRelevance = tagCount > 0 ? selectedTags.reduce((sum, t) => sum + t.relevanceScore, 0) / tagCount : 0;

  // Factor 5: harm free indicators (15%)
  const harmfulCount = selectedTags.filter(t => t.harmFlags.length > 0).length;
  const harmScore = Math.max(0, 100 - (harmfulCount * 30));

  // Factor 6: Competition Mix Balance (10%)
  const avgCompetition = tagCount > 0 ? selectedTags.reduce((sum, t) => sum + t.competitionScore, 0) / tagCount : 50;
  let compBalanceScore = 60;
  if (avgCompetition >= 30 && avgCompetition <= 60) compBalanceScore = 100;
  else if (avgCompetition >= 20 && avgCompetition <= 70) compBalanceScore = 80;

  // Weighted calculation
  const healthScore = Math.round(
    (countScore * 0.15) +
    (budgetScore * 0.15) +
    (diversityScore * 0.20) +
    (avgRelevance * 0.25) +
    (harmScore * 0.15) +
    (compBalanceScore * 0.10)
  );

  let healthLabel: Overview['healthLabel'] = 'Needs Work';
  if (healthScore >= 85) healthLabel = 'Excellent';
  else if (healthScore >= 70) healthLabel = 'Good';
  else if (healthScore >= 50) healthLabel = 'Needs Work';
  else if (healthScore >= 30) healthLabel = 'Poor';
  else healthLabel = 'Critical';

  // Count distribution of intent types
  const intents = {
    informational: selectedTags.filter(t => t.intentType === 'INFORMATIONAL').length,
    commercial: selectedTags.filter(t => t.intentType === 'COMMERCIAL').length,
    transactional: selectedTags.filter(t => t.intentType === 'TRANSACTIONAL').length,
    navigational: selectedTags.filter(t => t.intentType === 'NAVIGATIONAL').length
  };

  return {
    healthScore,
    healthLabel,
    totalTagsGenerated: selectedTags.length,
    recommendedTagCount: contentType === 'shorts' ? '3-5 tags' : '10-15 tags',
    budgetUsed: charsUsed,
    budgetPercent,
    intentDistribution: intents
  };
}

// Generate the optimization suite for SEO package
export function generateMetadataSEOPackage(
  title: string,
  selectedTags: TagObject[],
  description: string,
  niche: string,
  contentType: 'long_form' | 'shorts',
  healthScore: number
): SeoPackage {
  const normTitle = title.toLowerCase();
  const primaryKeywords = selectedTags.slice(0, 3).map(t => t.text);
  const primaryKeyword = primaryKeywords[0] || 'tutorial';

  // Analysis variables
  const hasKeywordInFront = primaryKeywords.some(kw => normTitle.startsWith(kw) || normTitle.substring(0, 15).includes(kw));
  const hasNumber = /\d+/.test(title);
  const currentYear = new Date().getFullYear();
  const hasYear = title.includes(String(currentYear));

  // Count power and emotional keywords
  const scorePower = POWER_WORDS.filter(w => normTitle.includes(w)).length;
  const scoreEmotion = EMOTIONAL_TRIGGERS.filter(w => normTitle.includes(w)).length;

  const suggestions: string[] = [];
  let titleScore = 100;

  if (!hasKeywordInFront) {
    suggestions.push(`Front-load Keyword: Try starting your title with a core searchable phrase (e.g., "${primaryKeyword.toUpperCase()}: [Your Creative Title]")`);
    titleScore -= 20;
  }
  if (title.length < 35) {
    suggestions.push("Title feels short. YouTube indexes titles up to 100 characters, ideally aim for 55-68 characters for searchable keyphrases.");
    titleScore -= 15;
  } else if (title.length > 75) {
    suggestions.push("Title is truncated in mobile watch streams. Snip slightly under 70 characters for higher average click CTR.");
    titleScore -= 10;
  }
  if (!hasNumber) {
    suggestions.push("Hooking with Data: Titles containing numbers or metrics (like '5 Steps' or '100% Free') fetch higher benchmark click rates.");
    titleScore -= 15;
  }
  if (!hasYear) {
    suggestions.push(`Recency boost: Use the current year (${currentYear}) in title brackets to signal highly up-to-date guide parameters.`);
    titleScore -= 10;
  }

  titleScore = Math.max(25, titleScore);

  // Description calculations
  let descriptionScore = 100;
  if (description.length < 100) {
    descriptionScore -= 30;
  }
  // Check overlapping primary tag keywords presence
  const overlapMatched = primaryKeywords.filter(kw => description.toLowerCase().includes(kw)).length;
  if (overlapMatched === 0) {
    descriptionScore -= 40;
  } else if (overlapMatched < primaryKeywords.length) {
    descriptionScore -= 15;
  }

  descriptionScore = Math.max(30, descriptionScore);

  // Suggested keywords to plant inside the description
  const descriptionKeywords = selectedTags
    .filter(t => t.relevanceScore >= 60)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5)
    .map(t => t.text);

  // Build high indexing template
  const tagListStr = descriptionKeywords.join(', ');
  const hashtagListStr = selectedTags.slice(0, 3).map(t => `#${t.text.replace(/\s+/g, '')}`).join(' ');

  const descriptionTemplate = `[Write a captivating 1-2 sentence hook here containing "${primaryKeyword}"]

In this video on ${niche}, we explore everything you need to build mastery. Whether you want to know how ${primaryKeyword} handles, or have been struggling with finding a solution, this tutorial breaks down each milestone.

TIMESTAMPS:
0:00 Introduction & Quick Setup
1:40 Core Methods Explained
4:15 Troubleshooting Commonalities
6:45 Summary & Free Resources

RESOURCES MENTIONED:
- Support links: http://example.com/join
- Related Guide: http://example.com/course

─────────────────────────────
TOPICS COVERED:
${tagListStr}

${hashtagListStr} #[YourChannelName]`;

  const overallSeoScore = Math.round((healthScore * 0.3) + (titleScore * 0.4) + (descriptionScore * 0.2) + (overlapMatched > 0 ? 100 * 0.1 : 50 * 0.1));

  let priorityAction = "Your tags are fully optimized. Write a descriptive, keyword-rich title to start ranking.";
  if (titleScore < healthScore && titleScore < descriptionScore) {
    priorityAction = "❌ Title Optimization: Your title lacks direct search keywords front-loaded. Review suggested headline variations.";
  } else if (descriptionScore < titleScore && descriptionScore < healthScore) {
    priorityAction = "⚠ Description Length: Your descriptions could carry higher search engine crawl weight. Fill out your timestamps template.";
  }

  return {
    tagScore: healthScore,
    titleScore,
    descriptionScore,
    overallSeoScore,
    titleSuggestions: suggestions,
    descriptionKeywords,
    descriptionTemplate,
    priorityAction
  };
}

// Generates fully optimized dataset from Title and optional Description
export function assembleProcessedResults(
  title: string,
  rawDesc: string,
  mode: 'fresh_generate' | 'improve_existing' | 'url_analyze',
  contentType: 'long_form' | 'shorts',
  channelSize: string,
  language = 'English',
  aiSuggestedKeywords: string[] = []
): TagGeneratorResponse {
  const description = rawDesc || '';
  const niche = detectNiche(title + ' ' + description);

  // Combine expansion ideas programmatically and using AI results if any
  let uniqueSeedTerms = new Set<string>();

  // Use programmatic expander
  const seedKeywords = removeStopwords(normalizeText(title));
  seedKeywords.forEach(k => {
    uniqueSeedTerms.add(k);
    expandSeedProgrammatically(k).forEach(v => uniqueSeedTerms.add(v));
  });

  // Also extract phrases
  const rawWords = normalizeText(title);
  if (rawWords.length >= 2) {
    for (let i = 0; i < rawWords.length - 1; i++) {
      uniqueSeedTerms.add(`${rawWords[i]} ${rawWords[i+1]}`);
      if (i < rawWords.length - 2) {
        uniqueSeedTerms.add(`${rawWords[i]} ${rawWords[i+1]} ${rawWords[i+2]}`);
      }
    }
  }

  // Infuse AI keywords if provided
  aiSuggestedKeywords.forEach(kw => uniqueSeedTerms.add(kw.toLowerCase().trim()));

  // Let's refine and assemble tag objects
  const rawTagsList = Array.from(uniqueSeedTerms)
    .filter(t => t.length > 2 && t.length < 50)
    .slice(0, 60);

  const tagObjects: TagObject[] = [];
  
  // Categorized tags
  rawTagsList.forEach(text => {
    const isOverused = OVERUSED_WORDS.some(ow => text === ow);
    const reason = text === title.toLowerCase().trim()
      ? "Direct video title match — high discovery signal."
      : text.includes(title.split(' ')[0]?.toLowerCase() || '___')
      ? "Anchor keyword relation tag."
      : `Topical ${niche} contextual keyword suggestion.`;

    if (!isOverused) {
      tagObjects.push(buildTagObject(text, title, description, niche, contentType, channelSize, reason));
    }
  });

  // Sub-Engine B: Misspelling captures
  const misspellingTags: TagObject[] = [];
  const primaryCandidates = tagObjects
    .filter(t => t.strengthScore > 60 && t.text.length > 6)
    .slice(0, 3);

  primaryCandidates.forEach(cand => {
    const typos = generateMisspellings(cand.text);
    typos.forEach(ty => {
      misspellingTags.push(buildTagObject(
        ty,
        title,
        description,
        niche,
        contentType,
        channelSize,
        `Typo safe: Extracts views from common search keyboard slips for "${cand.text}".`,
        true,
        false
      ));
    });
  });

  // Seasonal
  const seasonalMeta = getSeasonalMetadata(niche);
  const seasonalTags: TagObject[] = seasonalMeta.tags.map(st => {
    return buildTagObject(
      st,
      title,
      description,
      niche,
      contentType,
      channelSize,
      `Trending ${seasonalMeta.currentMonth} seasonal topic tag.`,
      false,
      true
    );
  });

  // Recommended Set (optimized selection fitting 500 budget strictly)
  const combinedCandidates = [...tagObjects, ...seasonalTags];
  const recommendedTags = applyTagSelectionBudget(combinedCandidates);

  // Standard health score mapping
  const healthOverview = calculateTagHealth(recommendedTags, contentType);

  // Extract separate list for misspellings output
  const finalMisspellingSet = misspellingTags.slice(0, 4);

  // Split into classification tables
  const broadTags = combinedCandidates.filter(t => t.type === "BROAD");
  const mediumTags = combinedCandidates.filter(t => t.type === "MEDIUM");
  const targetedTags = combinedCandidates.filter(t => t.type === "TARGETED");
  const longTailTags = combinedCandidates.filter(t => t.type === "LONG-TAIL" || t.type === "HYPER-SPECIFIC");

  // Hashtags priority Position
  // Positioning 1: Exact niche, 2: Broad, 3: content style
  const hashtagsSuggested: string[] = [];
  const contentTerm = findDominantSignal(seedKeywords);
  hashtagsSuggested.push(niche);
  if (recommendedTags.length > 0) {
    hashtagsSuggested.push(recommendedTags[0].text.replace(/\s+/g, ''));
  }
  hashtagsSuggested.push(contentTerm);
  
  const filteredHashtags = Array.from(new Set(hashtagsSuggested))
    .map(h => h.replace(/[^\w]/g, ''))
    .filter(h => h.length > 2)
    .slice(0, contentType === 'shorts' ? 3 : 5);

  const hashtagsOverview: HashtagsOverview = {
    suggested: filteredHashtags,
    maxRecommended: contentType === 'shorts' ? 3 : 5,
    copyReady: filteredHashtags.map(h => `#${h}`).join(' '),
    placement: "Add to the bottom of your description file — not inside metadata tags"
  };

  // Harm audits overview
  const flaggedDetails: HarmAuditOverview['flaggedTags'] = [];
  recommendedTags.forEach(t => {
    t.harmFlags.forEach(hf => {
      flaggedDetails.push({
        tag: t.text,
        harmLevel: hf.harmLevel,
        reason: hf.whyHarmful,
        recommendation: hf.recommendation
      });
    });
  });

  const criticalCount = flaggedDetails.filter(f => f.harmLevel === 'CRITICAL' || f.harmLevel === 'VERY HIGH').length;
  const overallRisk: HarmAuditOverview['overallRisk'] = criticalCount > 0 ? "HIGH" : flaggedDetails.length > 1 ? "MEDIUM" : "LOW";

  const harmAuditOverview: HarmAuditOverview = {
    flaggedTags: flaggedDetails,
    totalFlagged: flaggedDetails.length,
    criticalCount,
    overallRisk
  };

  // SEO Package Setup
  const seoPackage = generateMetadataSEOPackage(
    title,
    recommendedTags,
    description,
    niche,
    contentType,
    healthOverview.healthScore
  );

  // Shorts Specific optimizations
  let shortsOptimization: ShortsOptimization | undefined;
  if (contentType === 'shorts') {
    shortsOptimization = {
      recommendedTags: recommendedTags.slice(0, 5).map(t => t.text),
      recommendedHashtags: ['#shorts', ...filteredHashtags.slice(0, 2)].map(h => h.startsWith('#') ? h : `#${h}`),
      hookSuggestions: [
        `POV: You just discovered this ${niche} method...`,
        `This simple ${title.split(' ')[0] || 'guide'} trick changes everything.`,
        `Why nobody talks about this insane ${niche} breakthrough!`
      ],
      shortsStrategy: "Shorts discovery relies on the user Swipe Feed index, not lookup indexing. Keep tags under 5, focus entirely on description tags and first 3 seconds video retention hook overlays.",
      avoidNote: "Long-tail descriptive search hooks have been replaced with high trend bracket targets to suit dynamic auto feeds."
    };
  }

  // Copy-ready fields
  const allRecText = recommendedTags.map(t => t.text).join(',');
  const strongText = recommendedTags.filter(t => t.strengthScore >= 70).map(t => t.text).join(',');
  const longTailText = recommendedTags.filter(t => t.wordCount >= 4).map(t => t.text).join(',');
  const withHashtags = `-- Tags --\n${allRecText}\n\n-- Hashtags --\n${hashtagsOverview.copyReady}`;

  // CSV
  let csvExport = "tag,competition,relevance,intent,strength\n";
  recommendedTags.forEach(t => {
    csvExport += `"${t.text}",${t.competitionScore},${t.relevanceScore},${t.intentType},${t.strengthScore}\n`;
  });

  const copyOutputs: CopyOutputs = {
    allRecommendedTags: allRecText,
    strongTagsOnly: strongText,
    longTailOnly: longTailText,
    withHashtags,
    csvExport
  };

  return {
    input: {
      mode,
      title,
      description,
      contentType,
      detectedNiche: niche,
      channelSize
    },
    overview: healthOverview,
    tagSets: {
      broadTags: broadTags.slice(0, 10),
      mediumTags: mediumTags.slice(0, 10),
      targetedTags: targetedTags.slice(0, 10),
      longTailTags: longTailTags.slice(0, 10),
      misspellingTags: finalMisspellingSet,
      seasonalTags: seasonalTags.slice(0, 5),
      recommendedSet: {
        tags: recommendedTags,
        broadCount: recommendedTags.filter(t => t.type === 'BROAD').length,
        mediumCount: recommendedTags.filter(t => t.type === 'MEDIUM').length,
        targetedCount: recommendedTags.filter(t => t.type === 'TARGETED').length,
        longTailCount: recommendedTags.filter(t => t.type === 'LONG-TAIL' || t.type === 'HYPER-SPECIFIC').length,
        totalChars: allRecText.length,
        copyReady: allRecText
      }
    },
    hashtags: hashtagsOverview,
    tagIntelligence: recommendedTags,
    harmAudit: harmAuditOverview,
    seoPackage,
    shortsOptimization,
    copyOutputs,
    seasonal: {
      currentMonth: seasonalMeta.currentMonth,
      seasonalTags: seasonalTags.slice(0, 5),
      seasonalNote: seasonalMeta.displayNote,
      expiryNote: seasonalMeta.expiryNote
    }
  };
}
