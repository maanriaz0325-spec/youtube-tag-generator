/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Youtube,
  Sparkles,
  Sliders,
  Flame,
  Copy,
  Check,
  Search,
  AlertTriangle,
  TrendingUp,
  X,
  Languages,
  Users,
  Info,
  FileText,
  Calendar,
  BarChart2,
  Download,
  AlertCircle,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { TagGeneratorResponse, TagObject, HarmFlag } from './types';

// Default mock values for initial state before generate triggers
const initialPlaceholderResults: TagGeneratorResponse = {
  input: {
    mode: 'fresh_generate',
    title: 'How to invest in stocks for beginners 2026',
    description: 'A complete step by step stock market investing guide. In this tutorial, learn dividend stocks, index funds, and compound wealth strategies.',
    contentType: 'long_form',
    detectedNiche: 'finance',
    channelSize: 'micro'
  },
  overview: {
    healthScore: 82,
    healthLabel: 'Good',
    totalTagsGenerated: 14,
    recommendedTagCount: '10-15 tags',
    budgetUsed: 395,
    budgetPercent: 79,
    intentDistribution: { informational: 8, commercial: 3, transactional: 2, navigational: 1 }
  },
  tagSets: {
    broadTags: [],
    mediumTags: [],
    targetedTags: [],
    longTailTags: [],
    misspellingTags: [],
    seasonalTags: [],
    recommendedSet: {
      tags: [],
      broadCount: 2,
      mediumCount: 4,
      targetedCount: 4,
      longTailCount: 3,
      totalChars: 395,
      copyReady: ''
    }
  },
  hashtags: {
    suggested: ['investing', 'stockmarket', 'finance', 'investingbasics'],
    maxRecommended: 5,
    copyReady: '#investing #stockmarket #finance #investingbasics',
    placement: 'Add to the bottom of your description file — not inside metadata tags'
  },
  tagIntelligence: [],
  harmAudit: {
    flaggedTags: [],
    totalFlagged: 0,
    criticalCount: 0,
    overallRisk: 'LOW'
  },
  seoPackage: {
    tagScore: 82,
    titleScore: 70,
    descriptionScore: 100,
    overallSeoScore: 80,
    titleSuggestions: [
      'Front-load Keyword: Try starting your title with a core searchable phrase (e.g., "INVESTING FOR BEGINNERS: How to start")'
    ],
    descriptionKeywords: ['investing', 'stock market', 'finance', 'dividend stocks'],
    descriptionTemplate: '',
    priorityAction: 'Your tags are fully optimized. Work on front-loading keywords in the title.'
  },
  seasonal: {
    currentMonth: 'May',
    seasonalTags: [],
    seasonalNote: 'It is currently May — these seasonal topics are highly search-relevant.',
    expiryNote: 'These lose efficacy next season.'
  },
  copyOutputs: {
    allRecommendedTags: '',
    strongTagsOnly: '',
    longTailOnly: '',
    withHashtags: '',
    csvExport: ''
  }
};

export default function App() {
  // Input fields
  const [activeTab, setActiveTab ] = useState<'fresh' | 'improve'>('fresh');
  const [titleInput, setTitleInput] = useState('How to invest in stocks for beginners 2026');
  const [descInput, setDescInput] = useState('A complete step by step stock market investing guide. In this tutorial, learn dividend stocks, index funds, and compound wealth strategies.');
  const [existingTagsInput, setExistingTagsInput] = useState('investing, stocks, finance, stocks for beginners');
  
  // Custom toggles
  const [contentType, setContentType] = useState<'long_form' | 'shorts'>('long_form');
  const [channelSize, setChannelSize] = useState<string>('micro');
  const [language, setLanguage] = useState<string>('English');
  const [currentMonthNum] = useState<number>(new Date().getMonth() + 1);

  // Tool states
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [results, setResults] = useState<TagGeneratorResponse | null>(null);
  const [errorText, setErrorText] = useState('');
  
  // Real-time custom-selected tags state
  const [activeSelectedTags, setActiveSelectedTags] = useState<TagObject[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Active explorer list filters
  const [activeExplorerTab, setActiveExplorerTab] = useState<'all' | 'broad' | 'medium' | 'targeted' | 'longtail' | 'misspelling' | 'seasonal'>('all');

  // Trigger loading message changes nicely to guide user patience
  useEffect(() => {
    if (loading) {
      const messages = [
        "Analyzing search demographics & niche taxonomy...",
        "Querying Gemini AI for competitor audience search intents...",
        "Identifying high-value long-tail search opportunities...",
        "Evaluating clickbait risks and negative algorithms...",
        "Formulating SEO authority clusters & seasonals..."
      ];
      let idx = 0;
      setLoadingMessage(messages[0]);
      const intv = setInterval(() => {
        idx = (idx + 1) % messages.length;
        setLoadingMessage(messages[idx]);
      }, 1500);
      return () => clearInterval(intv);
    }
  }, [loading]);




  const triggerToast = (text: string) => {
    setCopiedText(text);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  // Run generation logic (POST to Node server)
  const handleGenerate = async (isDemo = false) => {
    setErrorText('');
    setLoading(true);

    let titleText = titleInput;
    let descriptionText = descInput;

    if (activeTab === 'improve') {
      titleText = titleInput || "How to improve video SEO";
      descriptionText = `Pasted existing tags to optimize: ${existingTagsInput}`;
    }

    try {
      const payload = {
        title: titleText,
        description: descriptionText,
        mode: activeTab === 'fresh' ? 'fresh_generate' : 'improve_existing',
        contentType,
        channelSize,
        language
      };

      const endpoint = '/api/generate-tags';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to finalize tags generation on server.");
      }

      const parsedData: TagGeneratorResponse = await response.json();
      setResults(parsedData);
      
      // Auto-select tags from the initial recommended set
      setActiveSelectedTags(parsedData.tagSets.recommendedSet.tags);
      
      if (!isDemo) {
        triggerToast("Discoverability system metrics processed!");
      }
    } catch (err: any) {
  console.error(err);
  setErrorText(err.message || "Failed to generate tags. Please try again.");
  
} finally {
      setLoading(false);
    }
  };

  // Live real-time selection toggle inside current tags
  const toggleTagSelection = (tag: TagObject) => {
    const exists = activeSelectedTags.some(t => t.text === tag.text);
    let updatedTags: TagObject[] = [];
    
    if (exists) {
      // remove
      updatedTags = activeSelectedTags.filter(t => t.text !== tag.text);
    } else {
      updatedTags = [...activeSelectedTags, tag];
    }
    
    setActiveSelectedTags(updatedTags);
  };

  // recalculate interactive live statistics for active selected set
  const getActiveSelectedStats = () => {
    if (!results) return initialPlaceholderResults.overview;
    const tagCount = activeSelectedTags.length;
    const cleanJoin = activeSelectedTags.map(t => t.text).join(',');
    const charactersUsed = cleanJoin.length;
    const budgetPercentage = Math.round((charactersUsed / 500) * 100);

    // Calculate interactive health score safely based on selection
    let countRating = 20;
    if (contentType === 'shorts') {
      countRating = tagCount >= 3 && tagCount <= 5 ? 100 : tagCount >= 2 ? 70 : 30;
    } else {
      countRating = tagCount >= 10 && tagCount <= 16 ? 100 : tagCount >= 7 && tagCount <= 19 ? 85 : tagCount >= 4 ? 60 : 30;
    }

    let budgetRating = 20;
    if (contentType === 'shorts') {
      budgetRating = budgetPercentage >= 35 && budgetPercentage <= 65 ? 100 : 70;
    } else {
      budgetRating = budgetPercentage >= 75 && budgetPercentage <= 96 ? 100 : budgetPercentage >= 55 ? 85 : 40;
    }

    const typesPresent = {
      broad: activeSelectedTags.some(t => t.wordCount === 1),
      medium: activeSelectedTags.some(t => t.wordCount === 2),
      targeted: activeSelectedTags.some(t => t.wordCount === 3),
      longtail: activeSelectedTags.some(t => t.wordCount >= 4)
    };
    const diversityCount = Object.values(typesPresent).filter(Boolean).length;
    const diversityScore = diversityCount === 4 ? 100 : diversityCount === 3 ? 80 : 50;

    const avgRelevance = tagCount > 0 ? activeSelectedTags.reduce((s, t) => s + t.relevanceScore, 0) / tagCount : 0;
    const avgComp = tagCount > 0 ? activeSelectedTags.reduce((s, t) => s + t.competitionScore, 0) / tagCount : 50;

    const currentCalculatedScore = Math.round(
      (countRating * 0.15) + (budgetRating * 0.15) + (diversityScore * 0.20) + (avgRelevance * 0.25) + (avgComp * 0.1) + 15
    );
    
    const finalScoreBound = Math.min(100, Math.max(12, currentCalculatedScore));
    let lbl: 'Excellent' | 'Good' | 'Needs Work' | 'Poor' | 'Critical' = 'Needs Work';
    if (finalScoreBound >= 85) lbl = 'Excellent';
    else if (finalScoreBound >= 70) lbl = 'Good';
    else if (finalScoreBound >= 50) lbl = 'Needs Work';
    else lbl = 'Critical';

    // Intent allocation
    const intents = {
      informational: activeSelectedTags.filter(t => t.intentType === 'INFORMATIONAL').length,
      commercial: activeSelectedTags.filter(t => t.intentType === 'COMMERCIAL').length,
      transactional: activeSelectedTags.filter(t => t.intentType === 'TRANSACTIONAL').length,
      navigational: activeSelectedTags.filter(t => t.intentType === 'NAVIGATIONAL').length
    };

    return {
      healthScore: finalScoreBound,
      healthLabel: lbl,
      totalTagsGenerated: tagCount,
      recommendedTagCount: contentType === 'shorts' ? '3-5 tags' : '10-15 tags',
      budgetUsed: charactersUsed,
      budgetPercent: budgetPercentage,
      intentDistribution: intents
    };
  };

  const runtimeStats = getActiveSelectedStats();

  const getFilteredTagsList = () => {
    if (!results) return [];
    
    // Merge standard recommended and seasonal for filters
    const allCandidates = [...results.tagSets.broadTags, ...results.tagSets.mediumTags, ...results.tagSets.targetedTags, ...results.tagSets.longTailTags];
    const unique = Array.from(new Map(allCandidates.map(item => [item.text, item])).values());

    const resultList = (() => {
      switch (activeExplorerTab) {
        case 'broad':
          return unique.filter(t => t.wordCount === 1);
        case 'medium':
          return unique.filter(t => t.wordCount === 2);
        case 'targeted':
          return unique.filter(t => t.wordCount === 3);
        case 'longtail':
          return unique.filter(t => t.wordCount >= 4);
        case 'misspelling':
          return results.tagSets.misspellingTags;
        case 'seasonal':
          return results.tagSets.seasonalTags;
        case 'all':
        default:
          return unique;
      }
    })();

    // Sort: lowest competition to highest competition (competitionScore ascending)
    return [...resultList].sort((a, b) => a.competitionScore - b.competitionScore);
  };

  const currentFilteredTags = getFilteredTagsList();

  // Export copies
  const handleCopyText = (textToCopy: string, actionLabel: string) => {
    navigator.clipboard.writeText(textToCopy);
    triggerToast(`Copied ${actionLabel} straight to your clipboard!`);
  };

  const handleDownloadCSV = () => {
    if (!results) return;
    const csvContent = results.copyOutputs.csvExport;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `youtube_tags_seo_${results.input.detectedNiche}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("SEO tags CSV export completed!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans leading-relaxed transition-colors selection:bg-indigo-100 selection:text-indigo-900">
      

      {/* Toast Feedback */}
      {copiedText && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 font-medium flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{copiedText}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Main Central Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight leading-tight">
            <span className="text-red-600">YouTube </span>
            <span className="text-slate-950">Tag </span>
            <span className="text-red-600">Generator</span>
          </h1>
        </div>

        {/* Global Input Calibration parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel: Mode select & form configurations */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Control Tower Configurations Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold font-serif text-slate-800">Calibrate settings</h3>
              </div>

              {/* Toggle Content Type (Long vs Shorts) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Video Format Focus</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setContentType('long_form')}
                    className={`py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition border ${
                      contentType === 'long_form'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    <span>Long-Form (Evergreen)</span>
                  </button>
                  <button
                    onClick={() => setContentType('shorts')}
                    className={`py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition border ${
                      contentType === 'shorts'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Youtube className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>Shorts / Reel Feed</span>
                  </button>
                </div>
              </div>

              {/* Channel Size Subscriber Tier Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Channel Size</label>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Calibrates tag competition limit</span>
                </div>
                <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1.5 rounded-xl">
                  {['micro', 'small', 'mid', 'large', 'mega'].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setChannelSize(tier)}
                      className={`py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${
                        channelSize === tier
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-[10px] text-slate-500 flex gap-2 font-roboto">
                  <Users className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>
                    {channelSize === 'micro' && 'Subscribers < 10K. Limits recommendations to low-competition queries.'}
                    {channelSize === 'small' && 'Subscribers 10K - 50K. Unlocks medium density searches.'}
                    {channelSize === 'mid' && 'Subscribers 50K - 200K. Balances highly saturated keywords.'}
                    {channelSize === 'large' && 'Subscribers 200K - 1M. Able to rank for competitive head tags.'}
                    {channelSize === 'mega' && 'Subscribers 1M+. Max power unlocked for high traffic niches.'}
                  </span>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Content Language</label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español (Spanish)</option>
                    <option value="Hindi">हिन्दी (Hindi / Hinglish)</option>
                    <option value="French">Français (French)</option>
                    <option value="German">Deutsch (German)</option>
                    <option value="Urdu">اردو (Urdu)</option>
                  </select>
                  <Languages className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

            </div>

            {/* Selection modes form inputs */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold font-serif text-slate-800">Provide Details</h3>
              </div>

              {/* Modes tabs selection */}
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => { setActiveTab('fresh'); setErrorText(''); }}
                  className={`flex-1 pb-3 text-xs font-bold uppercase transition border-b-2 ${
                    activeTab === 'fresh' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Fresh Generate
                </button>
                <button
                  onClick={() => { setActiveTab('improve'); setErrorText(''); }}
                  className={`flex-1 pb-3 text-xs font-bold uppercase transition border-b-2 ${
                    activeTab === 'improve' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Improve Tags
                </button>
              </div>

              {/* Tab 1: Fresh Generate */}
              {activeTab === 'fresh' && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video Title or Core Topic</label>
                    <input
                      type="text"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      placeholder="e.g. How to grow garden plants for beginners step by step"
                      className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm font-semibold transition focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                      <span>Video Description (Optional)</span>
                      <span className="text-[10px] text-slate-400 font-medium">Improves contextual accuracy</span>
                    </label>
                    <textarea
                      value={descInput}
                      onChange={(e) => setDescInput(e.target.value)}
                      rows={3}
                      placeholder="Paste your script hook or planned video outline details here..."
                      className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm font-medium transition focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Improve Existing */}
              {activeTab === 'improve' && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video Title</label>
                    <input
                      type="text"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      placeholder="Enter the title for baseline theme context matching"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paste Current Tag Set</label>
                    <textarea
                      value={existingTagsInput}
                      onChange={(e) => setExistingTagsInput(e.target.value)}
                      rows={3}
                      placeholder="Pasted comma-separated tags e.g. tutorial, plant, organic grow hacks"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium whitespace-pre-line"
                    />
                  </div>
                </div>
              )}

              {errorText && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs font-medium flex gap-2 items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorText}</span>
                </div>
              )}

              {/* Generate Tags Action CTA */}
              <button
                onClick={() => handleGenerate(false)}
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl border border-slate-900 shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-300" />
                    <span>Processing Tags Strategy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>Analyze YouTube Discoverability</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Panel: Output Workspace Visualizations */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Loading Cover Spinner Overlay */}
            {loading ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-lg text-center flex flex-col items-center justify-center space-y-6 min-h-[550px]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-5 left-5 w-6 h-6 text-amber-400 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold font-serif text-slate-800">Analyzing Discoverability Algorithms</h3>
                  <p className="text-xs font-semibold font-roboto text-slate-500 mt-2 max-w-sm mx-auto">
                    {loadingMessage || "Re-indexing search intent hierarchies..."}
                  </p>
                </div>
              </div>
            ) : results ? (
              
              <div className="space-y-6">
                
                {/* Visual SEO score metrics card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg font-bold font-serif text-slate-900">Discoverability Diagnostics</h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase py-1 px-2.5 bg-indigo-50 text-indigo-700 rounded-full tracking-wider font-sans">
                      Live Selected Strategy Metrics
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Ring score widget */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="relative flex items-center justify-center">
                        {/* Radial Gauge Ring */}
                        <svg className="w-28 h-28 transform -rotate-90">
                          <circle cx="56" cy="56" r="48" className="text-slate-200" strokeWidth="6" fill="transparent" />
                          <circle
                            cx="56"
                            cy="56"
                            r="48"
                            className="text-indigo-600 transition-all duration-700"
                            strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 48}
                            strokeDashoffset={2 * Math.PI * 48 * (1 - runtimeStats.healthScore / 100)}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center text-slate-800">
                          <span className="text-3xl font-black tracking-tighter">{runtimeStats.healthScore}</span>
                          <span className="text-[9px] uppercase font-bold text-slate-400">SEO SCORE</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-extrabold ${
                          runtimeStats.healthLabel === 'Excellent' ? 'bg-emerald-100 text-emerald-800' :
                          runtimeStats.healthLabel === 'Good' ? 'bg-blue-100 text-blue-800' :
                          runtimeStats.healthLabel === 'Needs Work' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          🏅 {runtimeStats.healthLabel}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown metrics checklist */}
                    <div className="md:col-span-8 space-y-4">
                      <h4 className="text-xs font-bold font-serif text-slate-400 uppercase tracking-widest">Diagnostic components</h4>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Optimal Tag Diversity</div>
                          <div className="text-base font-bold text-slate-800 mt-0.5">
                            {Object.values({
                              broad: activeSelectedTags.some(t => t.wordCount === 1),
                              medium: activeSelectedTags.some(t => t.wordCount === 2),
                              targeted: activeSelectedTags.some(t => t.wordCount === 3),
                              longtail: activeSelectedTags.some(t => t.wordCount >= 4)
                            }).filter(Boolean).length}/4 Types
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Average Relevance</div>
                          <div className="text-base font-bold text-slate-800 mt-0.5">
                            {runtimeStats.totalTagsGenerated > 0 
                              ? `${Math.round(activeSelectedTags.reduce((s,t) => s + t.relevanceScore, 0) / runtimeStats.totalTagsGenerated)}/100`
                              : '0/100'}
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Intent Allocation</div>
                          <div className="text-xs font-semibold text-slate-700 mt-1 space-y-0.5">
                            <div>ℹ️ Info: {runtimeStats.intentDistribution.informational}</div>
                            <div>🎯 Commercial: {runtimeStats.intentDistribution.commercial}</div>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] text-slate-400 font-bold uppercase font-bold text-emerald-600">Audience Rating</div>
                          <div className="text-xs font-semibold text-slate-800 mt-1">
                            {contentType === 'shorts' ? 'Optimized for Reel feed' : 'Optimized for search'}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Filterable Tag Explorer */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="text-base font-bold font-serif text-slate-800">Tag Discovery Explorer</h4>
                      <p className="text-[10px] text-slate-500 font-roboto font-medium mt-0.5">Click any keyword to add or remove from real-time budget formulation.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveSelectedTags([])}
                        className="p-1 px-3 text-[10px] uppercase font-extrabold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition"
                      >
                        Clear set
                      </button>
                      <button
                        onClick={() => setActiveSelectedTags(results.tagSets.recommendedSet.tags)}
                        className="p-1 px-3 text-[10px] uppercase font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition"
                      >
                        Reset Optimum
                      </button>
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex flex-wrap gap-1 border-b border-slate-100 pb-2">
                    {[
                      { id: 'all', label: 'All suggestions' },
                      { id: 'broad', label: 'Broad (1-word)' },
                      { id: 'medium', label: 'Medium (2-word)' },
                      { id: 'targeted', label: 'Targeted (3-word)' },
                      { id: 'longtail', label: 'Long-Tail (4+)' },
                      { id: 'misspelling', label: 'Misspellings 🎯' },
                      { id: 'seasonal', label: 'Seasonal 🌱' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveExplorerTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          activeExplorerTab === tab.id
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-800'
                        } border`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tags grid layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[350px] overflow-y-auto p-1 pr-2 border border-slate-100 rounded-xl scrollbar-thin">
                    {currentFilteredTags.length === 0 ? (
                      <div className="col-span-2 text-center py-12 text-slate-400 text-xs font-semibold">
                        No keywords in this filter type. Try selecting another tab.
                      </div>
                    ) : (
                      currentFilteredTags.map((tagObj, idx) => {
                        const isSelected = activeSelectedTags.some(t => t.text === tagObj.text);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleTagSelection(tagObj)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 text-left relative overflow-hidden group hover:shadow-xs ${
                              isSelected
                                ? 'bg-indigo-50 hover:bg-indigo-100/75 border-indigo-300'
                                : 'bg-slate-50 hover:bg-slate-100/50 border-slate-200'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              {/* tag label text */}
                              <span className="font-bold text-xs text-slate-800 tracking-tight flex-1">
                                {tagObj.text}
                              </span>
                              
                              {/* Toggle Check indicator */}
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center border text-[8px] font-black ${
                                isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 text-transparent'
                              }`}>
                                ✓
                              </div>
                            </div>

                            {/* visual metadatas */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm ${
                                tagObj.competitionLabel === 'Very High' || tagObj.competitionLabel === 'High' ? 'bg-rose-100 text-rose-800' :
                                tagObj.competitionLabel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                Comp: {tagObj.competitionLabel}
                              </span>
                              <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded-sm">
                                {tagObj.intentType}
                              </span>
                            </div>

                            {tagObj.channelSizeWarning && isSelected && (
                              <div className="mt-1.5 p-1 px-2 bg-rose-50 rounded text-[9px] text-rose-700 font-semibold leading-relaxed">
                                {tagObj.channelSizeWarning}
                              </div>
                            )}

                          </div>
                        );
                      })
                    )}
                  </div>

                </div>



                {/* Main Action suite for quick copy/pasting */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4 shadow-md">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-400" />
                      <h4 className="text-sm font-bold font-serif">Fast Copy Ready sets</h4>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 bg-amber-400/10 text-amber-400 font-bold rounded-lg tracking-wider">
                      YouTube Creator Suite
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 max-h-20 overflow-y-auto font-mono text-xs text-slate-300 break-all select-all scrollbar-thin">
                      {activeSelectedTags.length > 0 
                        ? activeSelectedTags.map(t => t.text).join(',') 
                        : "Click tags in explorer above to formulate sets"}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <button
                        onClick={() => handleCopyText(activeSelectedTags.map(t => t.text).join(','), "All Tags")}
                        disabled={activeSelectedTags.length === 0}
                        className="py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold cursor-pointer transition text-slate-200 border border-slate-800 disabled:opacity-50"
                      >
                        Copy All Selected
                      </button>
                      <button
                        onClick={() => handleCopyText(activeSelectedTags.filter(t => t.strengthScore >= 70).map(t => t.text).join(','), "Strong Tags")}
                        disabled={activeSelectedTags.length === 0}
                        className="py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold cursor-pointer transition text-slate-200 border border-slate-800 disabled:opacity-50"
                      >
                        Copy Strong (S &gt; 70)
                      </button>
                      <button
                        onClick={() => handleCopyText(activeSelectedTags.filter(t => t.wordCount >= 4).map(t => t.text).join(','), "Long-Tail Tags")}
                        disabled={activeSelectedTags.length === 0}
                        className="py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold cursor-pointer transition text-slate-200 border border-slate-800 disabled:opacity-50"
                      >
                        Copy Long-Tail
                      </button>
                      <button
                        onClick={handleDownloadCSV}
                        disabled={activeSelectedTags.length === 0}
                        className="py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold cursor-pointer transition text-amber-400 border border-slate-800 flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Harm Audit block */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                      <h4 className="text-sm font-bold font-serif text-slate-800">SEO Negative Algorithm Block (Audit)</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg font-sans ${
                      results.harmAudit.overallRisk === 'HIGH' ? 'bg-red-100 text-red-800' :
                      results.harmAudit.overallRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Risk level: {results.harmAudit.overallRisk}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-roboto font-medium">
                    The YouTube algorithm actively audits your tag list for misleading clickbait and spam triggers. Flagged items can cause algorithmic suppression or age indexing.
                  </p>

                  {results.harmAudit.flaggedTags.length === 0 ? (
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 font-bold flex gap-2 items-center">
                      ✓ Complete Compliance: No misleading, spam-associated, or overused keywords detected in selected set.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {results.harmAudit.flaggedTags.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 text-xs leading-relaxed space-y-1.5 text-slate-700">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-rose-800 text-sm">⚠️ "{item.tag}"</span>
                            <span className="text-[10px] bg-rose-200 text-rose-800 font-black px-2 py-0.5 rounded-sm">
                              {item.harmLevel} HARM
                            </span>
                          </div>
                          <p className="font-roboto text-slate-600">{item.reason}</p>
                          <div className="text-[11px] font-bold text-indigo-700">
                            👉 Recommendation: {item.recommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>





              </div>

            ) : (

              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs min-h-[550px]">
                <div className="bg-slate-100 p-4 rounded-full text-slate-400">
                  <Youtube className="w-12 h-12 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-slate-800">No active reports processed</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-roboto font-medium">
                    Configure your settings, input details, or insert competitor YouTube URLs, then trigger the SEO analysis search metrics.
                  </p>
                </div>
              </div>

            )}

          </div>

        </div>

      </main>

      <footer className="bg-white border-t border-slate-200 mt-20 py-8 text-center text-xs text-slate-400 font-roboto font-semibold space-y-2">
        <div>YouTube Tag Generator Tool for SEO Optimizations. All algorithms configured strictly.</div>
        <div className="text-[10px] text-slate-400 text-center font-roboto">
          &copy; 2026 Developer SEO Tools suite. All rights indexable.
        </div>
      </footer>

    </div>
  );
}
