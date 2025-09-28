import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. AI features will not work.');
}

// Create a fallback service when API key is missing
class FallbackGeminiService {
  async testConnection(): Promise<boolean> {
    return false;
  }

  async generateLogoDescription(request: LogoDescriptionRequest): Promise<string[]> {
    throw new Error('Gemini API key is not configured. Please check your environment variables in production.');
  }

  async enhanceDescription(currentDescription: string, logoInfo: LogoDescriptionRequest): Promise<string> {
    throw new Error('Gemini API key is not configured. Please check your environment variables in production.');
  }
}

// Only create the real service if we have an API key
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const realService = genAI ? new GoogleGenerativeAI(API_KEY) : null;

export interface LogoDescriptionRequest {
  logoName: string;
  currentDescription?: string;
  customQuery?: string;
}

export class GeminiService {
  private model = realService ? realService.getGenerativeModel({ model: 'gemini-2.5-flash-lite' }) : null;

  // Simple test method to verify API connectivity
  async testConnection(): Promise<boolean> {
    if (!API_KEY || !this.model) {
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
    if (!API_KEY || !this.model) {
      throw new Error('Gemini API key is not configured. Please check your environment variables in production.');
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
      
      // Convert plain text suggestions to HTML for rich text editor
      const htmlSuggestions = suggestions.map(suggestion => 
        suggestion
          .split('\n\n')
          .map(paragraph => `<p>${paragraph}</p>`)
          .join('')
      );
      
      return htmlSuggestions;
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
    if (!API_KEY || !this.model) {
      throw new Error('Gemini API key is not configured. Please check your environment variables in production.');
    }

    const prompt = `
You are a professional brand analyst and logo expert. Please enhance and expand the following logo description with comprehensive company information and logo history.

Current Description:
"${currentDescription}"

Company Name: ${logoInfo.logoName}

Instructions:
1. Research and add brief company background information
2. Include logo history and evolution details when available
3. Provide detailed visual description of logo elements
4. Highlight the logo's strongest design points and strategic advantages
5. Explain what makes this logo effective and memorable
6. Keep language simple and easy to understand
7. Aim for 4-5 sentences with comprehensive information

Enhanced Analysis:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      if (!text || text.length < 10) {
        throw new Error('Received empty or very short response from Gemini');
      }
      
      // Convert plain text to HTML formatting for rich text editor
      const htmlText = text
        .split('\n\n')
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');
      
      return htmlText;
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
    // If there's a custom query, use it for more targeted research
    if (request.customQuery) {
      return `
You are a professional brand analyst and logo expert. For the company "${request.logoName}", please research and provide information based on this specific request: "${request.customQuery}"

Company Name: ${request.logoName}
${request.currentDescription ? `Current Description: ${request.currentDescription}` : ''}

Custom Research Request: ${request.customQuery}

Please provide 3 different detailed responses that address the specific query above:

RESPONSE 1: [Address the custom query with focus on company background and context]
RESPONSE 2: [Address the custom query with focus on logo design and visual analysis]
RESPONSE 3: [Address the custom query with focus on strategic/business perspective]

For each response:
1. Directly address the specific research question/request
2. Provide detailed, factual information when available
3. Include relevant context about the company and logo
4. Keep language simple and easy to understand
5. Each response should be 3-4 sentences long
6. If the existing description is provided, build upon it rather than replacing it
`;
    }

    // Default comprehensive analysis prompt
    return `
You are a professional brand analyst and logo expert. For the company "${request.logoName}", provide comprehensive information including company background, logo history, and design analysis.

Company Name: ${request.logoName}
${request.currentDescription ? `Current Description: ${request.currentDescription}` : ''}

Please provide 3 different comprehensive analyses with the following structure:

ANALYSIS 1: Company Background
[Provide company information, founding details, key milestones, and business overview in simple language]

ANALYSIS 2: Logo History, Logo Design Analysis & Visual Elements
[Detailed description of the logo design, visual elements, color choices, typography, and overall composition in simple language]

ANALYSIS 3: Website and Wiki URL, if any
[Provide official website URL and Wikipedia page URL if available, along with brief description of what users can find there]

For each analysis:
1. Start with brief company information and context
2. Include logo history and evolution when available
3. Provide detailed visual description of the logo
4. Keep language simple and easy to understand
5. Each analysis should be 3-4 sentences long
${request.currentDescription ? '6. Build upon the existing description rather than replacing it completely' : ''}

If the company is not widely known, provide general analysis based on available information.

Format your response exactly as:
ANALYSIS 1:
[content]

ANALYSIS 2:
[content]

ANALYSIS 3:
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

    return descriptions.slice(0, 3); // Return max 3 descriptions
  }
}

export const geminiService = new GeminiService();

// Utility function to check if Gemini API is properly configured
export const isGeminiConfigured = (): boolean => {
  return !!API_KEY;
};

// Get configuration status for debugging
export const getGeminiConfigStatus = () => {
  return {
    hasApiKey: !!API_KEY,
    apiKeyLength: API_KEY ? API_KEY.length : 0,
    isConfigured: !!genAI,
    environment: import.meta.env.MODE,
    nodeEnv: import.meta.env.NODE_ENV
  };
};