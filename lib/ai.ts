import axios from "axios";
import { AIAnalysisResult } from "@/types/alert";

export async function analyzeAnimalImage(
  base64Image: string
): Promise<AIAnalysisResult> {
  try {
    // Use Perplexity API with vision model
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image of an injured animal. Provide ONLY a JSON response with these fields: animal_type (e.g., Dog, Cat, Bird), injury_location (e.g., Front leg, Head, Back), severity (number 1-5 where 1=minor, 5=critical), description (brief summary). Be specific and accurate."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 200,
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        animal_type: parsed.animal_type || "Animal",
        injury_location: parsed.injury_location || "Body",
        severity: String(parsed.severity || 3),
        description: parsed.description || "AI analysis completed"
      };
    }
    
    throw new Error("Failed to parse AI response");
  } catch (error: any) {
    console.error("Error analyzing image with Perplexity:", error.response?.data || error.message);
    
    // Fallback to mock data if API fails
    console.log("🤖 Using fallback analysis");
    return {
      animal_type: "Dog",
      injury_location: "Front leg",
      severity: "3",
      description: "Fallback analysis: Unable to analyze image with AI. Using default assessment."
    };
  }
}
