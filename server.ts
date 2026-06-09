/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import { assembleProcessedResults } from './src/engine.js';
// Load env variables
dotenv.config();

// Create Express app
const app = express();
app.use(express.json());

// Initialize Gemini Client safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
  apiKey,
});
    console.log("Gemini API Client successfully initialized on backend server.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client with provided key:", err);
  }
} else {
  console.log("No GEMINI_API_KEY environment variable found. Server will run in high-quality programmatic fallback mode.");
}

// REST API endpoint: YouTube video metadata fetch (public oEmbed fallback)
app.post('/api/fetch-youtube', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "YouTube URL is required." });
  }

  // extract video ID from url
  const idReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(idReg);
  const videoId = (match && match[2].length === 11) ? match[2] : null;

  if (!videoId) {
    return res.status(400).json({ error: "Invalid YouTube URL format. Please paste a standard watch or share link." });
  }

  try {
    // Call Youtube oembed public api to get title, author, and thumbnail info
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      // Return metadata we can parse directly
      return res.json({
        videoId,
        title: `YouTube Video (${videoId})`,
        authorName: "Unknown Channel",
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        rawUrl: url
      });
    }

    const oembedData = await response.json();
    return res.json({
      videoId,
      title: oembedData.title || `YouTube Video (${videoId})`,
      authorName: oembedData.author_name || "Unknown Channel",
      thumbnailUrl: oembedData.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      rawUrl: url
    });
  } catch (e: any) {
    return res.json({
      videoId,
      title: `YouTube Video (${videoId})`,
      authorName: "Unable to retrieve channel details",
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      rawUrl: url,
      warning: "Could not establish oEmbed API handshake, fallbacked to standard ID indexing."
    });
  }
});

app.get('/api/debug', async (req, res) => {
  try {
    if (!ai) return res.json({ error: "AI not initialized" });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: 'Say hello'
    });
    res.json({ success: true, text: response.text });
  } catch (err: any) {
    res.json({ error: err.message, code: err.status });
  }
});app.post('/api/generate-tags', async (req, res) => {
  const { title, description, mode, contentType, channelSize, language } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title or core topic input is required to start tag generations." });
  }

  const selectMode = mode || 'fresh_generate';
  const selectType = contentType || 'long_form';
  const selectSize = channelSize || 'micro';
  const selectLang = language || 'English';
  const descString = description || '';

  let aiKeywords: string[] = [];
  let geminiActive = false;

  if (ai) {
    try {
      // Build a highly-targeted intelligence prompt prioritizing sub-niche and customer intent mapping
      const prompt = `Analyze this YouTube video concept with structural precision:
Title: "${title}"
Description: "${descString}"
Format Type: ${selectType === 'shorts' ? 'Short-Form Video (Shorts under 60s)' : 'Long-Form Video'}
Target Language: ${selectLang}

Task:
1. Identify the precise micro-niche, sub-topic, and specific audience search intent (e.g., educational tutorial, practical troubleshooting, detailed product comparison, reviews, direct how-to guide, or specific entertainment/niche hobby).
2. Generate a JSON array of 35-45 highly professional, high search-volume tags and keyphrases that are 100% topically relevant and mapped strictly to that specific niche and intent.
3. Every single tag MUST directly align with queries real viewers type on YouTube to answer this specific intent. Do NOT generate generic or broad filler tags (e.g. do not outputs basic terms like "tutorial" or "video" or unrelated keywords).
4. Include:
   - High-intent search sequences (e.g., "how to do [Specific Step]...", "[Topic] step by step guide").
   - Semantic synonyms, professional industry terms, or common phrasing for the micro-niche.
   - Long-tail queries optimized for satisfying the exact user objective.
   - Targeted contextual clusters that relate only to this specific title and description.

Format requirements:
Response MUST be an extremely clean JSON array of strings ONLY. No markdown wrappers (except the JSON format itself), no explanation, and no comments.
Example format:

["niche specific tag", "long tail intent keyphrase", "exact sequence variation"]`;

      const response = await ai.models.generateContent({
model: 'gemini-2.0-flash-lite',
        contents: prompt,
        config: {
          systemInstruction: "You are a world-class YouTube SEO strategist, algorithm engineer, and audience intent cataloger. Your absolute priority is to deeply analyze the user's specific niche, topic, and viewer search intent/motivation. Generate tags that are highly relevant, extremely targeted, and completely covered by the video's core content. Do NOT include generic, broad, or off-topic queries. All output must be formatted as a pure JSON array of strings.",
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING
            }
          }
        }
      });

      const text = response.text || '';
      console.log("Raw Gemini API response text retrieved.");
      
      const parsed = JSON.parse(text.trim());
      if (Array.isArray(parsed)) {
        aiKeywords = parsed.map(k => String(k).toLowerCase().trim());
        geminiActive = true;
      }
    } catch (err: any) {
      console.error("GEMINI_ERROR:", err?.message || err?.status || JSON.stringify(err));
    }
  }

  try {
    // Generate results incorporating AI brain or rule-based generators
    const results = assembleProcessedResults(title, descString, selectMode, selectType, selectSize, selectLang, aiKeywords);
    
    // Add information on whether Gemini API actually assisted
    return res.json({
      ...results,
      geminiEngineUsage: geminiActive ? "ACTIVE_AI_GROUNDING" : "FALLBACK_PROGRAMMATIC_ENGINE"
    });
  } catch (error: any) {
    console.error("Failed to construct tags list output:", error);
    return res.status(500).json({ error: "Server failed to compile tag listings. Please check parameters." });
  }
});

const distPath = path.resolve('dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(3000, () => console.log("Local: http://localhost:3000"));
export default app;