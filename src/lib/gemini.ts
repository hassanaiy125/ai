import { GoogleGenAI } from "@google/genai";

export async function generateScript(topic: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Please configure it in your secrets.");
  }
  const freeAi = new GoogleGenAI({ apiKey });

  try {
    const result = await freeAi.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `Write a short, engaging video script about: ${topic}. Keep it under 30 seconds of speech. Format it as a list of scenes with visual descriptions and voiceover text.` }]
        }
      ]
    });
    return result.text;
  } catch (error) {
    console.error("Script generation error:", error);
    throw error;
  }
}

export async function checkApiKey() {
  if (window.aistudio) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return true; // Fallback for dev if not in AI Studio iframe
}

export async function promptApiKey() {
  if (window.aistudio) {
    await window.aistudio.openSelectKey();
  }
}

export async function generateVideo(prompt: string) {
  // Ensure key is selected
  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      throw new Error("API_KEY_MISSING");
    }
  }

  // Use the paid key for Veo
  // Note: process.env.API_KEY is injected by the platform after selection
  const apiKey = process.env.API_KEY;
  
  // If the key is missing even after selection (or if not in iframe but env var missing), throw specific error
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const paidAi = new GoogleGenAI({ apiKey });

  try {
    let operation = await paidAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await paidAi.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
      throw new Error(String(operation.error.message || "Unknown error"));
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("No video URI returned");

    // Fetch the actual video blob
    const response = await fetch(videoUri, {
      method: 'GET',
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (!response.ok) throw new Error("Failed to download video");
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Video generation error:", error);
    throw error;
  }
}

export async function generateImage(prompt: string, imageBase64?: string) {
  // Ensure key is selected
  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      throw new Error("API_KEY_MISSING");
    }
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const paidAi = new GoogleGenAI({ apiKey });

  try {
    const parts: any[] = [{ text: prompt }];

    if (imageBase64) {
      // Extract base64 data and mime type
      const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        parts.unshift({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    }

    const response = await paidAi.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      },
    });

    // Check for image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }

    // Check for text refusal/error
    const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
    if (textPart?.text) {
      throw new Error(textPart.text);
    }

    console.log("Full Response:", JSON.stringify(response, null, 2));
    throw new Error("No image generated (Unknown response format)");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
}
