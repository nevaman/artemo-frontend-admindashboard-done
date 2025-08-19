// API service for dynamic tool management
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.artemo.ai' 
  : 'http://localhost:3001';

export class ApiService {
  private static instance: ApiService;
  
  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Mock API responses for development
  private mockTools: import('../types').DynamicTool[] = [
    {
      id: 'hao',
      title: 'Ad Writer (HAO)',
      category: 'AD_COPY',
      description: "The Ad Writer (HAO) tool uses the Hook, Angle, Outcome framework to generate compelling ad copy designed to grab attention and drive conversions.",
      active: true,
      featured: true,
      primaryModel: 'ChatGPT',
      fallbackModels: ['Claude', 'Grok'],
      promptInstructions: 'You are an expert ad copywriter specializing in the Hook-Angle-Outcome framework. Create compelling ads that grab attention, present a unique angle, and promise a clear outcome.',
      questions: [
        { id: '1', label: 'What product or service are you advertising?', type: 'textarea', required: true, order: 1 },
        { id: '2', label: 'Who is your target audience?', type: 'textarea', required: true, order: 2 },
        { id: '3', label: 'What platform will you advertise on?', type: 'select', required: true, order: 3, options: ['Facebook', 'Instagram', 'Google Ads', 'LinkedIn', 'Twitter'] },
        { id: '4', label: 'What is your main goal?', type: 'select', required: true, order: 4, options: ['Brand Awareness', 'Lead Generation', 'Direct Sales', 'App Downloads'] }
      ]
    },
    {
      id: 'money-tales',
      title: 'Money Tales Emails',
      category: 'EMAIL_COPY',
      description: "Turns everyday events or simple stories into engaging emails that nurture your audience and seamlessly lead to a sales pitch.",
      active: true,
      featured: true,
      primaryModel: 'GPT-4',
      fallbackModels: ['Claude'],
      promptInstructions: 'You are an expert email copywriter who specializes in storytelling. Transform simple stories into engaging emails that build connection and naturally lead to sales.',
      questions: [
        { id: '1', label: 'What story or experience do you want to share?', type: 'textarea', required: true, order: 1 },
        { id: '2', label: 'What product or service are you promoting?', type: 'input', required: true, order: 2 },
        { id: '3', label: 'Who is your email audience?', type: 'textarea', required: true, order: 3 },
        { id: '4', label: 'What is your call-to-action?', type: 'input', required: true, order: 4 }
      ]
    },
    {
      id: 'freestyle',
      title: 'Freestyle Long Form',
      category: 'LONG_FORM',
      description: "A flexible, open-ended tool for generating long-form content on any topic. Provide a prompt and let the AI write.",
      active: true,
      featured: true,
      primaryModel: 'Claude',
      fallbackModels: ['GPT-4'],
      promptInstructions: 'You are a versatile content writer capable of creating high-quality long-form content on any topic. Adapt your writing style to match the requested tone and audience.',
      questions: [
        { id: '1', label: 'What topic do you want to write about?', type: 'input', required: true, order: 1 },
        { id: '2', label: 'What type of content? (blog post, article, guide, etc.)', type: 'input', required: true, order: 2 },
        { id: '3', label: 'Who is your target audience?', type: 'textarea', required: true, order: 3 },
        { id: '4', label: 'What tone should the content have?', type: 'select', required: true, order: 4, options: ['Professional', 'Casual', 'Academic', 'Conversational', 'Authoritative'] },
        { id: '5', label: 'Approximate word count?', type: 'select', required: false, order: 5, options: ['500-1000', '1000-2000', '2000-3000', '3000+']}
      ]
    }
  ];

  private mockCategories: import('../types').AdminCategory[] = [
    { id: '1', name: 'Ad Copy', displayOrder: 1, active: true },
    { id: '2', name: 'Email Copy', displayOrder: 2, active: true },
    { id: '3', name: 'Long Form Content', displayOrder: 3, active: true },
    { id: '4', name: 'Client Management', displayOrder: 4, active: true },
    { id: '5', name: 'Copy Improvement', displayOrder: 5, active: true },
    { id: '6', name: 'Sales & Funnel Copy', displayOrder: 6, active: true },
    { id: '7', name: 'Podcast Tools', displayOrder: 7, active: true },
    { id: '8', name: 'Other', displayOrder: 8, active: true },
  ];

  // Tools API
  async getTools(): Promise<import('../types').ToolsApiResponse> {
    try {
      // In production, this would be: const response = await fetch(`${API_BASE_URL}/api/tools`);
      // For now, return mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return {
        success: true,
        data: this.mockTools
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch tools'
      };
    }
  }

  async createTool(tool: Omit<import('../types').DynamicTool, 'id'>): Promise<import('../types').ApiResponse<import('../types').DynamicTool>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newTool = { ...tool, id: Date.now().toString() };
      this.mockTools.push(newTool);
      return {
        success: true,
        data: newTool
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create tool'
      };
    }
  }

  async updateTool(id: string, updates: Partial<import('../types').DynamicTool>): Promise<import('../types').ApiResponse<import('../types').DynamicTool>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = this.mockTools.findIndex(tool => tool.id === id);
      if (index === -1) {
        return { success: false, error: 'Tool not found' };
      }
      this.mockTools[index] = { ...this.mockTools[index], ...updates };
      return {
        success: true,
        data: this.mockTools[index]
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update tool'
      };
    }
  }

  async deleteTool(id: string): Promise<import('../types').ApiResponse<void>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = this.mockTools.findIndex(tool => tool.id === id);
      if (index === -1) {
        return { success: false, error: 'Tool not found' };
      }
      this.mockTools.splice(index, 1);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete tool'
      };
    }
  }

  // Categories API
  async getCategories(): Promise<import('../types').CategoriesApiResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: this.mockCategories
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch categories'
      };
    }
  }

  async createCategory(category: Omit<import('../types').AdminCategory, 'id'>): Promise<import('../types').ApiResponse<import('../types').AdminCategory>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCategory = { ...category, id: Date.now().toString() };
      this.mockCategories.push(newCategory);
      return {
        success: true,
        data: newCategory
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create category'
      };
    }
  }

  async updateCategory(id: string, updates: Partial<import('../types').AdminCategory>): Promise<import('../types').ApiResponse<import('../types').AdminCategory>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = this.mockCategories.findIndex(cat => cat.id === id);
      if (index === -1) {
        return { success: false, error: 'Category not found' };
      }
      this.mockCategories[index] = { ...this.mockCategories[index], ...updates };
      return {
        success: true,
        data: this.mockCategories[index]
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update category'
      };
    }
  }

  async deleteCategory(id: string): Promise<import('../types').ApiResponse<void>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = this.mockCategories.findIndex(cat => cat.id === id);
      if (index === -1) {
        return { success: false, error: 'Category not found' };
      }
      this.mockCategories.splice(index, 1);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete category'
      };
    }
  }

  // AI Chat API
  async sendChatMessage(toolId: string, messages: import('../types').Message[], knowledgeBase?: string): Promise<import('../types').ApiResponse<string>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing time
      
      // Mock AI response based on tool
      const tool = this.mockTools.find(t => t.id === toolId);
      if (!tool) {
        return { success: false, error: 'Tool not found' };
      }

      // Generate mock response based on tool type
      let response = '';
      if (tool.category === 'AD_COPY') {
        response = `Here's your compelling ad copy using the HAO framework:\n\n**Hook:** Stop scrolling! This changes everything...\n\n**Angle:** While others struggle with [problem], smart people use [solution]\n\n**Outcome:** Get [specific result] in [timeframe] or your money back!\n\n*This is a generated response based on your inputs. Feel free to ask for revisions or try a different approach.*`;
      } else if (tool.category === 'EMAIL_COPY') {
        response = `Here's your Money Tales email:\n\n**Subject:** The $10,000 mistake I made (so you don't have to)\n\n**Email Body:**\nYesterday, I was sitting in my favorite coffee shop when I overheard a conversation that made my stomach drop...\n\n[Story continues with emotional connection]\n\n...and that's exactly why I created [your product]. It prevents the exact mistake I made and helps you [achieve desired outcome].\n\n**Call to Action:** Ready to avoid my costly mistake? [Your CTA here]\n\n*This is a generated response. Let me know if you'd like me to adjust the tone or focus on different aspects.*`;
      } else {
        response = `Based on your requirements, here's your customized content:\n\n[Generated content would appear here based on your specific inputs and the tool's configuration]\n\nThis content is optimized for your target audience and follows best practices for ${tool.category.replace(/_/g, ' ').toLowerCase()}.\n\n*Feel free to request revisions or ask for alternative approaches.*`;
      }

      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate AI response'
      };
    }
  }
}