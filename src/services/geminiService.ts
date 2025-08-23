import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. AI features will not work.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface LogoDescriptionRequest {
  logoName: string;
  logoType: string;
  industry: string;
  shape: string;
  currentDescription?: string;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generateLogoDescription(request: LogoDescriptionRequest): Promise<string[]> {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const prompt = this.buildDescriptionPrompt(request);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response to extract multiple suggestions
      const suggestions = this.parseDescriptionResponse(text);
      return suggestions;
    } catch (error) {
      console.error('Error generating description with Gemini:', error);
      throw new Error('Failed to generate description. Please try again.');
    }
  }

  async enhanceDescription(currentDescription: string, logoInfo: LogoDescriptionRequest): Promise<string> {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const prompt = `
You are a professional brand consultant and copywriter. Please enhance and improve the following logo description to make it more compelling, professional, and informative.

Current Description:
"${currentDescription}"

Logo Details:
- Logo Name: ${logoInfo.logoName}
- Logo Type: ${logoInfo.logoType}
- Industry: ${logoInfo.industry}
- Shape: ${logoInfo.shape}

Instructions:
1. Keep the core message but make it more engaging and professional
2. Add relevant details about the logo type and industry context
3. Make it sound more polished and marketing-ready
4. Keep it concise but informative (2-3 sentences max)
5. Focus on brand value and visual impact

Enhanced Description:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error enhancing description with Gemini:', error);
      throw new Error('Failed to enhance description. Please try again.');
    }
  }

  private buildDescriptionPrompt(request: LogoDescriptionRequest): string {
    return `
You are a professional brand strategist and copywriter specializing in logo descriptions. Generate 4 different professional logo descriptions for the following logo details:

Logo Information:
- Name: ${request.logoName}
- Logo Type: ${request.logoType}
- Industry: ${request.industry}
- Shape: ${request.shape}

Requirements for each description:
1. Professional tone suitable for marketing materials
2. 2-3 sentences each
3. Focus on brand value, visual impact, and industry relevance
4. Mention the logo type and shape naturally
5. Each description should have a different focus/angle

Please provide 4 distinct descriptions with the following focuses:
1. Brand Identity & Recognition
2. Design Elements & Visual Impact  
3. Industry-Specific Value
4. Professional & Versatile Application

Format your response as:
DESCRIPTION 1:
[content]

DESCRIPTION 2:
[content]

DESCRIPTION 3:
[content]

DESCRIPTION 4:
[content]

Generate compelling, unique descriptions that would appeal to business professionals and marketing teams.`;
  }

  private parseDescriptionResponse(text: string): string[] {
    // Split by "DESCRIPTION" markers and clean up
    const sections = text.split(/DESCRIPTION \d+:/i);
    
    const descriptions = sections
      .slice(1) // Remove first empty section
      .map(section => section.trim())
      .filter(section => section.length > 0)
      .map(section => {
        // Remove any extra formatting or numbering
        return section
          .replace(/^\d+\.?\s*/, '') // Remove leading numbers
          .replace(/^[-*]\s*/, '')   // Remove leading bullets
          .trim();
      })
      .filter(desc => desc.length > 20); // Filter out very short responses

    // If parsing fails, try to split by line breaks and find meaningful content
    if (descriptions.length < 2) {
      const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 50 && !line.match(/^(description|focus|format)/i));
      
      if (lines.length >= 2) {
        return lines.slice(0, 4);
      }
    }

    // Ensure we have at least one description
    if (descriptions.length === 0) {
      return [text.trim()];
    }

    return descriptions.slice(0, 4); // Return max 4 descriptions
  }
}

export const geminiService = new GeminiService();