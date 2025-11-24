import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UploadPackData } from "../types";

// Helper to ensure we have a client. 
// Note: We re-instantiate specifically for Veo/Check as per instructions, 
// but for general use we can keep a static instance if key is static.
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * FEATURE 1: Master YouTube Upload Pack Generator
 * Uses Gemini 2.5 Flash for speed and JSON structure.
 */
export const generateUploadPack = async (
  keywords: string,
  script?: string
): Promise<UploadPackData> => {
  const ai = getClient();
  
  const prompt = `
    You are a world-class YouTube Strategist optimized for 2025 SEO.
    
    Context:
    Keywords: ${keywords}
    ${script ? `Script/Context: ${script}` : ''}
    
    Task: Generate a complete metadata upload package.
    1. Create 3 highly viral, click-driven titles.
    2. Write an SEO-optimized description (200-300 words).
    3. Generate a list of comma-separated tags (500 chars limit logic).
    4. Generate relevant hashtags.
    5. Write a high-CTR pinned comment to engage viewers.
    6. Describe 4 visual concepts for high CTR thumbnails.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          pinnedComment: { type: Type.STRING },
          thumbnailConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["titles", "description", "tags", "hashtags", "pinnedComment", "thumbnailConcepts"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as UploadPackData;
};

/**
 * FEATURE 2: Viral Thumbnail Generator & Analyzer
 * Uses Gemini 3 Pro Image Preview for high quality generation.
 * Uses Gemini 2.5 Flash for analysis if an image is uploaded.
 */
export const analyzeAndGenerateThumbnail = async (
  promptText: string,
  referenceImageBase64?: string,
  referenceMimeType?: string
): Promise<{ imageUrl: string; analysis?: string }> => {
  const ai = getClient();
  let finalPrompt = promptText;
  let analysisText = "";

  // Step 1: If reference image exists, analyze it first to extract style
  if (referenceImageBase64 && referenceMimeType) {
    const analysisResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: referenceImageBase64,
              mimeType: referenceMimeType,
            },
          },
          {
            text: "Analyze this YouTube thumbnail. Describe its color palette, emotion, composition, typography style, and why it is click-worthy. Keep it concise.",
          },
        ],
      },
    });
    
    analysisText = analysisResponse.text || "Analysis failed";
    finalPrompt = `Create a YouTube thumbnail based on this style description: ${analysisText}. \n\nAdditional user requirement: ${promptText}. \n\nEnsure high contrast, vibrant colors, and 2025 trending aesthetics.`;
  }

  // Step 2: Generate the image
  // Note: Using generateContent for image generation as per 'nano banana' instructions if we wanted speed, 
  // but for "High-Quality" we use gemini-3-pro-image-preview.
  // The user guide says: "Upgrade to gemini-3-pro-image-preview if the user requests high-quality images"
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: {
        parts: [{ text: finalPrompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K" // Or 2K/4K if needed
      }
    }
  });

  let imageUrl = "";
  
  // Iterate parts to find image
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
        }
    }
  }

  if (!imageUrl) {
    throw new Error("Failed to generate image.");
  }

  return { imageUrl, analysis: analysisText };
};

/**
 * FEATURE 3: AI Voice Narrator
 */
export const generateSpeech = async (text: string, voiceName: string = 'Kore'): Promise<ArrayBuffer> => {
  const ai = getClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio generated");
  }

  // Decode base64 to ArrayBuffer
  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * FEATURE 4: Veo Video Creator
 */
export const generateVideo = async (
  prompt: string, 
  aspectRatio: '16:9' | '9:16' = '16:9',
  resolution: '720p' | '1080p' = '1080p'
): Promise<string> => {
  // CRITICAL: Re-instantiate with fresh key from environment (which is injected after selection)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: resolution,
      aspectRatio: aspectRatio
    }
  });

  // Polling loop
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) {
    throw new Error("Video generation failed or no URI returned.");
  }
  
  return videoUri;
};
