module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, description, mode, contentType, channelSize, language } = req.body;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "No API key configured" });
    }

    const prompt = `You are a YouTube SEO expert. Generate tags for: "${title}"
              
Return ONLY valid JSON like this:
{
  "input": {"mode": "fresh_generate", "title": "${title}", "description": "", "contentType": "long_form", "detectedNiche": "general", "channelSize": "micro"},
  "overview": {"healthScore": 82, "healthLabel": "Good", "totalTagsGenerated": 20, "recommendedTagCount": "10-15 tags", "budgetUsed": 380, "budgetPercent": 76, "intentDistribution": {"informational": 10, "commercial": 4, "transactional": 3, "navigational": 2}},
  "tagSets": {
    "broadTags": [{"text": "REAL_TAG", "wordCount": 1, "competitionScore": 30, "competitionLabel": "Low", "relevanceScore": 85, "strengthScore": 80, "intentType": "INFORMATIONAL", "channelSizeWarning": null}],
    "mediumTags": [{"text": "REAL TWO WORD", "wordCount": 2, "competitionScore": 25, "competitionLabel": "Low", "relevanceScore": 88, "strengthScore": 82, "intentType": "INFORMATIONAL", "channelSizeWarning": null}],
    "targetedTags": [{"text": "REAL THREE WORD TAG", "wordCount": 3, "competitionScore": 20, "competitionLabel": "Very Low", "relevanceScore": 90, "strengthScore": 85, "intentType": "INFORMATIONAL", "channelSizeWarning": null}],
    "longTailTags": [{"text": "REAL LONG TAIL TAG HERE", "wordCount": 4, "competitionScore": 15, "competitionLabel": "Very Low", "relevanceScore": 92, "strengthScore": 88, "intentType": "INFORMATIONAL", "channelSizeWarning": null}],
    "misspellingTags": [{"text": "misspelled tag", "wordCount": 1, "competitionScore": 10, "competitionLabel": "Very Low", "relevanceScore": 70, "strengthScore": 65, "intentType": "INFORMATIONAL", "channelSizeWarning": null}],
    "seasonalTags": [{"text": "seasonal tag", "wordCount": 2, "competitionScore": 15, "competitionLabel": "Very Low", "relevanceScore": 75, "strengthScore": 70, "intentType": "INFORMATIONAL", "channelSizeWarning": null}],
    "recommendedSet": {"tags": [], "broadCount": 2, "mediumCount": 4, "targetedCount": 4, "longTailCount": 3, "totalChars": 380, "copyReady": ""}
  },
  "hashtags": {"suggested": ["tag1", "tag2"], "maxRecommended": 5, "copyReady": "#tag1 #tag2", "placement": "Add to bottom of description"},
  "tagIntelligence": [],
  "harmAudit": {"flaggedTags": [], "totalFlagged": 0, "criticalCount": 0, "overallRisk": "LOW"},
  "seoPackage": {"tagScore": 82, "titleScore": 75, "descriptionScore": 80, "overallSeoScore": 79, "titleSuggestions": ["Front-load your main keyword"], "descriptionKeywords": ["keyword1"], "descriptionTemplate": "", "priorityAction": "Add more long-tail tags"},
  "seasonal": {"currentMonth": "June", "seasonalTags": [], "seasonalNote": "Tags for June", "expiryNote": "Lose efficacy next season"},
  "copyOutputs": {"allRecommendedTags": "", "strongTagsOnly": "", "longTailOnly": "", "withHashtags": "", "csvExport": "Tag,Competition\nRealTag,Low"}
}

RULES:
- Replace ALL placeholder text with REAL tags for: "${title}"
- broadTags: 3-4 single word tags
- mediumTags: 4-5 two word tags
- targetedTags: 4-5 three word tags
- longTailTags: 4-5 four+ word tags
- recommendedSet.tags: best 12 tags from all categories as full tag objects
- Return ONLY JSON, no markdown, no explanation`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://youtube-tag-generator-swart.vercel.app",
      },
      body: JSON.stringify({
model: "google/gemini-flash-1.5-8b",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "No response from AI: " + JSON.stringify(data) });
    }

    const text = data.choices[0].message.content || "{}";
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const cleanJson = text.substring(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(cleanJson);
    res.json(parsed);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate tags" });
  }
};