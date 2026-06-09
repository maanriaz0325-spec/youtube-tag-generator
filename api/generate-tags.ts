import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, description, mode, contentType, channelSize, language } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
  }

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } }
    });

    const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
    const currentMonthNum = new Date().getMonth() + 1;

    const prompt = `You are a YouTube SEO Tag Intelligence Engine. Generate a comprehensive tag strategy for the following video.

VIDEO DETAILS:
Title: "${title}"
Description: "${description || 'Not provided'}"
Mode: ${mode}
Content Type: ${contentType}
Channel Size: ${channelSize}
Language: ${language}
Current Month: ${currentMonth} (Month ${currentMonthNum})

INSTRUCTIONS:
Generate a complete YouTube tag set with the following structure. Return ONLY valid JSON, no markdown.

Rules:
- Broad tags (1 word): 3-4 tags, generic category keywords
- Medium tags (2 words): 5-6 tags, topic combinations  
- Targeted tags (3 words): 5-6 tags, specific phrases
- Long-tail tags (4+ words): 5-7 tags, very specific search queries
- Misspelling tags: 2-3 common misspellings of main keywords
- Seasonal tags: 2-3 tags relevant to ${currentMonth}
- All tags must be relevant to the title/description
- Channel size "${channelSize}": micro=very low competition only, small=low competition, mid=medium ok, large/mega=any competition
- Language: Generate tags in ${language}
- For "improve_existing" mode, improve and expand the existing tags
- competitionScore: 1-100 (lower = less competition)
- relevanceScore: 1-100 (higher = more relevant)
- strengthScore: 1-100 (overall tag strength)
- intentType: "INFORMATIONAL" | "COMMERCIAL" | "TRANSACTIONAL" | "NAVIGATIONAL"
- competitionLabel: "Very Low" | "Low" | "Medium" | "High" | "Very High"
- wordCount: number of words in tag

Return this EXACT JSON structure:
{
  "input": {
    "mode": "${mode}",
    "title": "${title}",
    "description": "${description || ''}",
    "contentType": "${contentType}",
    "detectedNiche": "detected niche here",
    "channelSize": "${channelSize}"
  },
  "overview": {
    "healthScore": 82,
    "healthLabel": "Good",
    "totalTagsGenerated": 25,
    "recommendedTagCount": "${contentType === 'shorts' ? '3-5 tags' : '10-15 tags'}",
    "budgetUsed": 380,
    "budgetPercent": 76,
    "intentDistribution": {
      "informational": 10,
      "commercial": 5,
      "transactional": 3,
      "navigational": 2
    }
  },
  "tagSets": {
    "broadTags": [
      {
        "text": "example tag",
        "wordCount": 1,
        "competitionScore": 20,
        "competitionLabel": "Low",
        "relevanceScore": 85,
        "strengthScore": 75,
        "intentType": "INFORMATIONAL",
        "channelSizeWarning": null
      }
    ],
    "mediumTags": [],
    "targetedTags": [],
    "longTailTags": [],
    "misspellingTags": [],
    "seasonalTags": [],
    "recommendedSet": {
      "tags": [],
      "broadCount": 2,
      "mediumCount": 4,
      "targetedCount": 4,
      "longTailCount": 3,
      "totalChars": 380,
      "copyReady": "tag1,tag2,tag3"
    }
  },
  "hashtags": {
    "suggested": ["hashtag1", "hashtag2", "hashtag3"],
    "maxRecommended": 5,
    "copyReady": "#hashtag1 #hashtag2 #hashtag3",
    "placement": "Add to the bottom of your description — not inside metadata tags"
  },
  "tagIntelligence": [],
  "harmAudit": {
    "flaggedTags": [],
    "totalFlagged": 0,
    "criticalCount": 0,
    "overallRisk": "LOW"
  },
  "seoPackage": {
    "tagScore": 82,
    "titleScore": 75,
    "descriptionScore": 80,
    "overallSeoScore": 79,
    "titleSuggestions": ["Front-load your main keyword in the title"],
    "descriptionKeywords": ["keyword1", "keyword2"],
    "descriptionTemplate": "",
    "priorityAction": "Focus on adding more long-tail tags for better discoverability"
  },
  "seasonal": {
    "currentMonth": "${currentMonth}",
    "seasonalTags": [],
    "seasonalNote": "These tags are relevant for ${currentMonth}",
    "expiryNote": "These lose efficacy next season"
  },
  "copyOutputs": {
    "allRecommendedTags": "tag1,tag2,tag3",
    "strongTagsOnly": "tag1,tag2",
    "longTailOnly": "long tail tag 1,long tail tag 2",
    "withHashtags": "tag1,tag2,tag3 #hashtag1 #hashtag2",
    "csvExport": "Tag,Competition,Relevance,Intent\\ntag1,Low,85,INFORMATIONAL"
  }
}

IMPORTANT: 
- Fill ALL arrays with REAL tags based on the title: "${title}"
- recommendedSet.tags should contain the best 10-15 tags from all categories combined
- Make tags highly specific and relevant to the actual topic
- Long-tail tags should be complete search phrases people actually type
- Do NOT return placeholder text like "example tag" - generate REAL tags`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    let text = aiResponse.text || "{}";

    // Clean JSON
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.substring(jsonStart, jsonEnd + 1);
    }

    const parsed = JSON.parse(text);
    res.json(parsed);

  } catch (error: any) {
    console.error("Tag generation error:", error);
    res.status(500).json({ error: "Failed to generate tags. Please try again." });
  }
}