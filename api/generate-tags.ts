const { GoogleGenAI } = require("@google/genai");

module.exports = async function handler(req, res) {
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
      apiKey: process.env.GEMINI_API_KEY
    });

    const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

    const prompt = `You are a YouTube SEO Tag Intelligence Engine. Generate tags for this video.

VIDEO: "${title}"
DESCRIPTION: "${description || ''}"
CONTENT TYPE: ${contentType}
CHANNEL SIZE: ${channelSize}
LANGUAGE: ${language}
MONTH: ${currentMonth}

Return ONLY this JSON structure with REAL tags based on the title above:
{
  "input": {
    "mode": "${mode}",
    "title": "${title}",
    "description": "${description || ''}",
    "contentType": "${contentType}",
    "detectedNiche": "detect from title",
    "channelSize": "${channelSize}"
  },
  "overview": {
    "healthScore": 82,
    "healthLabel": "Good",
    "totalTagsGenerated": 20,
    "recommendedTagCount": "10-15 tags",
    "budgetUsed": 380,
    "budgetPercent": 76,
    "intentDistribution": {
      "informational": 10,
      "commercial": 4,
      "transactional": 3,
      "navigational": 2
    }
  },
  "tagSets": {
    "broadTags": [
      {"text": "real tag here", "wordCount": 1, "competitionScore": 30, "competitionLabel": "Low", "relevanceScore": 85, "strengthScore": 80, "intentType": "INFORMATIONAL", "channelSizeWarning": null}
    ],
    "mediumTags": [
      {"text": "real two word tag", "wordCount": 2, "competitionScore": 25, "competitionLabel": "Low", "relevanceScore": 88, "strengthScore": 82, "intentType": "INFORMATIONAL", "channelSizeWarning": null}
    ],
    "targetedTags": [
      {"text": "real three word tag", "wordCount": 3, "competitionScore": 20, "competitionLabel": "Very Low", "relevanceScore": 90, "strengthScore": 85, "intentType": "INFORMATIONAL", "channelSizeWarning": null}
    ],
    "longTailTags": [
      {"text": "real long tail tag here", "wordCount": 4, "competitionScore": 15, "competitionLabel": "Very Low", "relevanceScore": 92, "strengthScore": 88, "intentType": "INFORMATIONAL", "channelSizeWarning": null}
    ],
    "misspellingTags": [
      {"text": "misspelled tag", "wordCount": 1, "competitionScore": 10, "competitionLabel": "Very Low", "relevanceScore": 70, "strengthScore": 65, "intentType": "INFORMATIONAL", "channelSizeWarning": null}
    ],
    "seasonalTags": [
      {"text": "seasonal tag", "wordCount": 2, "competitionScore": 15, "competitionLabel": "Very Low", "relevanceScore": 75, "strengthScore": 70, "intentType": "INFORMATIONAL", "channelSizeWarning": null}
    ],
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
    "suggested": ["hashtag1", "hashtag2"],
    "maxRecommended": 5,
    "copyReady": "#hashtag1 #hashtag2",
    "placement": "Add to bottom of description"
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
    "titleSuggestions": ["Front-load your main keyword"],
    "descriptionKeywords": ["keyword1", "keyword2"],
    "descriptionTemplate": "",
    "priorityAction": "Add more long-tail tags"
  },
  "seasonal": {
    "currentMonth": "${currentMonth}",
    "seasonalTags": [],
    "seasonalNote": "Tags relevant for ${currentMonth}",
    "expiryNote": "These lose efficacy next season"
  },
  "copyOutputs": {
    "allRecommendedTags": "tag1,tag2,tag3",
    "strongTagsOnly": "tag1,tag2",
    "longTailOnly": "long tail tag",
    "withHashtags": "tag1,tag2 #hashtag1",
    "csvExport": "Tag,Competition,Relevance\\ntag1,Low,85"
  }
}

IMPORTANT RULES:
1. Generate 3-4 broadTags, 4-5 mediumTags, 4-5 targetedTags, 4-5 longTailTags
2. recommendedSet.tags = best 10-12 tags from ALL categories combined
3. ALL tags must be REAL and relevant to: "${title}"
4. Return ONLY valid JSON, nothing else`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    let text = response.text || "{}";
    
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.substring(jsonStart, jsonEnd + 1);
    }

    const parsed = JSON.parse(text);
    res.json(parsed);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate tags. Please try again." });
  }
};