export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "No API key" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate YouTube SEO tags for this video title: "${title}"
              
Return ONLY this JSON:
{
  "input": {"mode": "fresh_generate", "title": "${title}", "description": "", "contentType": "long_form", "detectedNiche": "general", "channelSize": "micro"},
  "overview": {"healthScore": 82, "healthLabel": "Good", "totalTagsGenerated": 20, "recommendedTagCount": "10-15 tags", "budgetUsed": 380, "budgetPercent": 76, "intentDistribution": {"informational": 10, "commercial": 4, "transactional": 3, "navigational": 2}},
  "tagSets": {
    "broadTags": [{"text": "tag1", "wordCount": 1, "competitionScore": 30, "competitionLabel": "Low", "relevanceScore": 85, "strengthScore": 80, "intentType": "INFORMATIONAL", "channelSizeWarning": null}],
    "mediumTags": [{"text": "two word tag", "wordCount": 2, "competitionScore": 25, "competitionLabel": "Low", "relevanceScore": 88, "strengthScore": 82, "intentType": "INFORMATIONAL", "channelSizeWarning": null}],
    "targetedTags": [{"text": "three word tag", "wordCount": 3, "competitionScore": 20, "competitionLabel": "Very Low", "relevanceScore": 90, "strengthScore": 85, "intentType": "INFORMATIONAL", "channelSizeWarning": null}],
    "longTailTags": [{"text": "long tail tag here", "wordCount": 4, "competitionScore": 15, "competitionLabel": "Very Low", "relevanceScore": 92, "strengthScore": 88, "intentType": "INFORMATIONAL", "channelSizeWarning": null}],
    "misspellingTags": [{"text": "misspelled", "wordCount": 1, "competitionScore": 10, "competitionLabel": "Very Low", "relevanceScore": 70, "strengthScore": 65, "intentType": "INFORMATIONAL", "channelSizeWarning": null}],
    "seasonalTags": [{"text": "seasonal tag", "wordCount": 2, "competitionScore": 15, "competitionLabel": "Very Low", "relevanceScore": 75, "strengthScore": 70, "intentType": "INFORMATIONAL", "channelSizeWarning": null}],
    "recommendedSet": {"tags": [], "broadCount": 2, "mediumCount": 4, "targetedCount": 4, "longTailCount": 3, "totalChars": 380, "copyReady": ""}
  },
  "hashtags": {"suggested": ["tag1", "tag2"], "maxRecommended": 5, "copyReady": "#tag1 #tag2", "placement": "Add to bottom of description"},
  "tagIntelligence": [],
  "harmAudit": {"flaggedTags": [], "totalFlagged": 0, "criticalCount": 0, "overallRisk": "LOW"},
  "seoPackage": {"tagScore": 82, "titleScore": 75, "descriptionScore": 80, "overallSeoScore": 79, "titleSuggestions": ["Front-load your main keyword"], "descriptionKeywords": ["keyword1"], "descriptionTemplate": "", "priorityAction": "Add more long-tail tags"},
  "seasonal": {"currentMonth": "June", "seasonalTags": [], "seasonalNote": "Tags relevant for June", "expiryNote": "These lose efficacy next season"},
  "copyOutputs": {"allRecommendedTags": "", "strongTagsOnly": "", "longTailOnly": "", "withHashtags": "", "csvExport": "Tag,Competition\\ntag1,Low"}
}

Fill ALL arrays with 3-5 REAL tags based on: "${title}"
recommendedSet.tags must have 10-12 best tags from all categories
Return ONLY valid JSON`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const cleanJson = text.substring(jsonStart, jsonEnd + 1);
    
    const parsed = JSON.parse(cleanJson);
    res.json(parsed);

  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate tags" });
  }
}