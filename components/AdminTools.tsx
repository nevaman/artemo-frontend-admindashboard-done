import React, { useState } from 'react';
import type { AdminTool, AdminCategory, AdminToolQuestion } from '../types';
import { PlusIcon, EditIcon, TrashIcon, BoxIcon, StarIcon, EyeIcon, EyeOffIcon } from './Icons';

export const AdminTools: React.FC = () => {
  const [tools, setTools] = useState<AdminTool[]>([
    {
      id: '1',
      title: 'Ad Writer (HAO)',
      description: 'Uses Hook, Angle, Outcome framework for compelling ads',
      categoryId: '1',
      active: true,
      featured: true,
      primaryModel: 'ChatGPT',
      fallbackModels: ['Claude', 'Grok'],
      promptInstructions: 'You are an expert ad copywriter...',
      questions: [
        { id: '1', label: 'What product are you advertising?', type: 'input', required: true, order: 1 },
        { id: '2', label: 'Who is your target audience?', type: 'textarea', required: true, order: 2 },
      ],
    },
  ]);

  const [categories] = useState<AdminCategory[]>([
    { id: '1', name: 'Ad Copy', displayOrder: 1, active: true },
    { id: '2', name: 'Email Copy', displayOrder: 2, active: true },
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AdminTool | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isMaximized, setIsMaximized] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    active: true,
    featured: false,
    primaryModel: 'ChatGPT',
    fallbackModels: [] as string[],
    promptInstructions: '',
    questions: [] as AdminToolQuestion[],
  });

  const models = ['ChatGPT', 'Claude', 'Grok', 'Gemini'];

  const handleCreate = () => {
    setEditingTool(null);
    setFormData({
      title: '',
      description: '',
      categoryId: categories[0]?.id || '',
      active: true,
      featured: false,
      primaryModel: 'ChatGPT',
      fallbackModels: [],
      promptInstructions: '',
      questions: [],
    });
    setCurrentStep(1);
    setModalOpen(true);
  };

  const handleEdit = (tool: AdminTool) => {
    setEditingTool(tool);
    setFormData({
      title: tool.title,
      description: tool.description,
      categoryId: tool.categoryId,
      active: tool.active,
      featured: tool.featured,
      primaryModel: tool.primaryModel,
      fallbackModels: tool.fallbackModels,
      promptInstructions: tool.promptInstructions,
      questions: tool.questions,
    });
    setCurrentStep(1);
    setModalOpen(true);
  };

  const addQuestion = () => {
    const newQuestion: AdminToolQuestion = {
      id: Date.now().toString(),
      label: '',
      type: 'input',
      required: true,
      order: formData.questions.length + 1,
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (id: string, updates: Partial<AdminToolQuestion>) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, ...updates } : q),
    }));
  };

  const removeQuestion = (id: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id),
    }));
  };

  const handleSave = () => {
    if (editingTool) {
      setTools(prev => prev.map(tool => 
        tool.id === editingTool.id 
          ? { ...tool, ...formData }
          : tool
      ));
    } else {
      const newTool: AdminTool = {
        id: Date.now().toString(),
        ...formData,
      };
      setTools(prev => [...prev, newTool]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      setTools(prev => prev.filter(tool => tool.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            Tools
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Manage AI tools and their configurations
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-accent text-text-on-accent rounded-md hover:opacity-85 transition-opacity"
        >
          <PlusIcon className="w-4 h-4" />
          Add Tool
        </button>
      </div>

      <div className="bg-light-bg-component dark:bg-dark-bg-component border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light-bg-sidebar dark:bg-dark-bg-sidebar">
              <tr>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Tool</th>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Category</th>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Model</th>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Status</th>
                <th className="text-left p-4 font-medium text-light-text-primary dark:text-dark-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.id} className="border-t border-light-border dark:border-dark-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <BoxIcon className="w-5 h-5 text-primary-accent" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                            {tool.title}
                          </span>
                          {tool.featured && <StarIcon className="w-4 h-4 text-yellow-500" isFilled />}
                        </div>
                        <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">
                      {categories.find(cat => cat.id === tool.categoryId)?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <span className="text-light-text-primary dark:text-dark-text-primary font-medium">
                        {tool.primaryModel}
                      </span>
                      {tool.fallbackModels.length > 0 && (
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          Fallback: {tool.fallbackModels.join(', ')}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tool.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {tool.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(tool)}
                        className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-primary-accent hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-page rounded-md"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tool.id)}
                        className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-red-500 hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-page rounded-md"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-step Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`bg-light-bg-component dark:bg-dark-bg-component rounded-lg shadow-lg transition-all duration-300 ${
            isMaximized 
              ? 'w-[98vw] h-[98vh] max-w-none max-h-none' 
              : 'w-full max-w-2xl max-h-[90vh]'
          } flex flex-col overflow-hidden`}>
            <div className="p-6 border-b border-light-border dark:border-dark-border">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {editingTool ? 'Edit Tool' : 'Create Tool'} - Step {currentStep} of 3
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-page rounded-md transition-colors"
                    title={isMaximized ? 'Minimize' : 'Maximize'}
                  >
                    {isMaximized ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 15v4.5M15 15h4.5M15 15l5.5 5.5" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      setIsMaximized(false);
                    }}
                    className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-page rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`p-6 flex-1 overflow-y-auto ${isMaximized ? 'min-h-0 flex-grow' : ''}`}>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full p-3 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full p-3 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                        className="h-4 w-4 text-primary-accent focus:ring-primary-accent border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">Active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="h-4 w-4 text-primary-accent focus:ring-primary-accent border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">Featured</span>
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                      Primary Model
                    </label>
                    <select
                      value={formData.primaryModel}
                      onChange={(e) => setFormData(prev => ({ ...prev, primaryModel: e.target.value }))}
                      className="w-full p-3 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none"
                    >
                      {models.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                      Fallback Models
                    </label>
                    <div className="space-y-2">
                      {models.filter(m => m !== formData.primaryModel).map(model => (
                        <label key={model} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.fallbackModels.includes(model)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({ ...prev, fallbackModels: [...prev.fallbackModels, model] }));
                              } else {
                                setFormData(prev => ({ ...prev, fallbackModels: prev.fallbackModels.filter(m => m !== model) }));
                              }
                            }}
                            className="h-4 w-4 text-primary-accent focus:ring-primary-accent border-gray-300 rounded"
                          />
                          <span className="text-sm text-light-text-primary dark:text-dark-text-primary">{model}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                      Prompt Instructions
                    </label>
                    <textarea
                      value={formData.promptInstructions}
                      onChange={(e) => setFormData(prev => ({ ...prev, promptInstructions: e.target.value }))}
                      rows={isMaximized ? 20 : 6}
                      placeholder="You are an expert copywriter..."
                     className="w-full p-3 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary">Questions</h4>
                    <button
                      onClick={addQuestion}
                      className="flex items-center gap-2 px-3 py-1 bg-primary-accent text-text-on-accent rounded-md hover:opacity-85 transition-opacity text-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>
                  <div className={`space-y-3 ${isMaximized ? 'max-h-[calc(98vh-300px)]' : 'max-h-96'} overflow-y-auto`}>
                    {formData.questions.map((question, index) => (
                      <div key={question.id} className="border border-light-border dark:border-dark-border rounded-md p-4">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                            Question {index + 1}
                          </span>
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <textarea
                            type="text"
                            value={question.label}
                            onChange={(e) => updateQuestion(question.id, { label: e.target.value })}
                            placeholder="Question text"
                            className="w-full p-2 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none text-sm resize-none overflow-hidden min-h-[40px]"
                            rows={1}
                            style={{ height: 'auto' }}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = target.scrollHeight + 'px';
                            }}
                          />
                          <div className="flex gap-4">
                            <select
                              value={question.type}
                              onChange={(e) => updateQuestion(question.id, { type: e.target.value as 'input' | 'textarea' | 'select' })}
                              className="p-2 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none text-sm"
                            >
                              <option value="input">Input</option>
                              <option value="textarea">Textarea</option>
                              <option value="select">Select</option>
                            </select>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                                className="h-4 w-4 text-primary-accent focus:ring-primary-accent border-gray-300 rounded"
                              />
                              <span className="text-sm text-light-text-primary dark:text-dark-text-primary">Required</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-light-border dark:border-dark-border flex justify-between flex-shrink-0">
              <div>
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-4 py-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                >
                  Cancel
                </button>
                {currentStep < 3 ? (
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="px-4 py-2 bg-primary-accent text-text-on-accent rounded-md hover:opacity-85 transition-opacity"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary-accent text-text-on-accent rounded-md hover:opacity-85 transition-opacity"
                  >
                    {editingTool ? 'Update' : 'Create'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};