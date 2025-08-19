import { useCategories } from './useCategories';
import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import type { DynamicTool, ToolsApiResponse } from '../types';

export const useTools = () => {
  const [tools, setTools] = useState<DynamicTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = ApiService.getInstance();

  const fetchTools = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: ToolsApiResponse = await api.getTools();
      if (response.success && response.data) {
        setTools(response.data);
      } else {
        setError(response.error || 'Failed to fetch tools');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const createTool = async (toolData: Omit<DynamicTool, 'id'>) => {
    const response = await api.createTool(toolData);
    if (response.success && response.data) {
      setTools(prev => [...prev, response.data!]);
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to create tool');
    }
  };

  const updateTool = async (id: string, updates: Partial<DynamicTool>) => {
    const response = await api.updateTool(id, updates);
    if (response.success && response.data) {
      setTools(prev => prev.map(tool => tool.id === id ? response.data! : tool));
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to update tool');
    }
  };

  const deleteTool = async (id: string) => {
    const response = await api.deleteTool(id);
    if (response.success) {
      setTools(prev => prev.filter(tool => tool.id !== id));
    } else {
      throw new Error(response.error || 'Failed to delete tool');
    }
  };

  // Computed values
  const activeTools = tools.filter(tool => tool.active);
  const featuredTools = tools.filter(tool => tool.active && tool.featured);
  const toolsByCategory = (category: string) => 
    activeTools.filter(tool => tool.category === category);

  return {
    tools: activeTools,
    allTools: tools, // Include inactive tools for admin
    featuredTools,
    toolsByCategory,
    loading,
    error,
    refetch: fetchTools,
    createTool,
    updateTool,
    deleteTool
  };
};