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
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Simple test method to verify API connectivity
  async testConnection(): Promise<boolean> {
    if (!API_KEY) {
      return false;
    }

    try {
      const result = await this.model.generateContent('Hello, please respond with "API working"');
      const response = await result.response;
      const text = response.text();
      return text.toLowerCase().includes('api working') || text.length > 0;
    } catch (error) {
      console.error('Gemini API test failed:', error);
      return false;
    }
  }

  async generateLogoDescription(request: LogoDescriptionRequest): Promise<string[]> {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const prompt = this.buildDescriptionPrompt(request);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text || text.length < 20) {
        throw new Error('Received empty or very short response from Gemini');
      }
      
      // Parse the response to extract multiple suggestions
      const suggestions = this.parseDescriptionResponse(text);
      
      if (suggestions.length === 0) {
        throw new Error('Failed to parse AI response into usable suggestions');
      }
      
      return suggestions;
    } catch (error) {
      console.error('Error generating description with Gemini:', error);
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('API key issue. Please check configuration.');
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          throw new Error('API rate limit reached. Please try again in a moment.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('Network error. Please check your connection.');
        } else if (error.message.includes('parse') || error.message.includes('empty')) {
          throw new Error(error.message);
        }
      }
      
      throw new Error('Failed to generate description. Please try again.');
    }
  }

  async enhanceDescription(currentDescription: string, logoInfo: LogoDescriptionRequest): Promise<string> {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const prompt = `
You are a professional brand analyst and logo expert. Please enhance and expand the following logo description with comprehensive company information, logo history, and detailed analysis.

Current Description:
"${currentDescription}"

Company/Logo Details:
- Company Name: ${logoInfo.logoName}
- Logo Type: ${logoInfo.logoType}
- Industry: ${logoInfo.industry}
- Shape: ${logoInfo.shape}

Instructions:
1. Research and add brief company background information
2. Include logo history and evolution details when available
3. Provide detailed visual description of logo elements
4. Highlight the logo's strongest design points and strategic advantages
5. Explain what makes this logo effective and memorable
6. Keep professional tone suitable for brand documentation
7. Aim for 4-5 sentences with comprehensive information

If the company is not widely known, provide analysis based on the logo type, industry, and shape.

Enhanced Analysis:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      if (!text || text.length < 10) {
        throw new Error('Received empty or very short response from Gemini');
      }
      
      return text;
    } catch (error) {
      console.error('Error enhancing description with Gemini:', error);
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('API key issue. Please check configuration.');
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          throw new Error('API rate limit reached. Please try again in a moment.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('Network error. Please check your connection.');
        }
      }
      
      throw new Error('Failed to enhance description. Please try again.');
    }
  }

  private buildDescriptionPrompt(request: LogoDescriptionRequest): string {
    return `
You are a professional brand analyst and logo expert. For the company "${request.logoName}", provide comprehensive information including company background, logo history, and detailed logo analysis.

Logo Information:
- Company/Logo Name: ${request.logoName}
- Logo Type: ${request.logoType}
- Industry: ${request.industry}
- Shape: ${request.shape}

Please provide 4 different comprehensive analyses with the following structure for each:

ANALYSIS 1: Company Background & Logo History
[Provide company information, founding details, logo evolution history, and key milestones]

ANALYSIS 2: Logo Design Analysis & Visual Elements
[Detailed description of the logo design, visual elements, color choices, typography, and overall composition]

ANALYSIS 3: Logo Strengths & Strategic Advantages
[Analyze what makes this logo effective, its strong points, psychological impact, and competitive advantages]

ANALYSIS 4: Brand Recognition & Market Impact
[Discuss brand recognition, memorability, market positioning, and how the logo supports business objectives]

For each analysis:
1. Start with brief company information and context
2. Include logo history and evolution when available
3. Provide detailed visual description of the logo
4. Highlight the logo's strongest design elements and strategic advantages
5. Keep professional tone suitable for brand documentation
6. Each analysis should be 3-4 sentences long

If the company is not widely known, provide general analysis based on the logo type, industry, and shape provided.

Format your response exactly as:
ANALYSIS 1:
[content]

ANALYSIS 2:
[content]

ANALYSIS 3:
[content]

ANALYSIS 4:
[content]`;
  }

  private parseDescriptionResponse(text: string): string[] {
    // Split by "ANALYSIS" markers and clean up
    const sections = text.split(/ANALYSIS \d+:/i);
    
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
        .filter(line => line.length > 50 && !line.match(/^(analysis|focus|format)/i));
      
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