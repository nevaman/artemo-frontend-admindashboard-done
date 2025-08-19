
import React, { useState } from 'react';
import type { DynamicTool } from '../types';
import * as Icons from './Icons';

interface ToolActivationModalProps {
    tool: DynamicTool | null;
    onClose: () => void;
    onStart: (tool: DynamicTool) => void;
    onSetDontShowAgain: (toolId: string, shouldAdd: boolean) => void;
}

const categoryIcons: { [key in DynamicTool['category']]: React.FC<{ className?: string }> } = {
    AD_COPY: Icons.MessageSquareIcon,
    CLIENT_MANAGEMENT: Icons.UsersIcon,
    COPY_IMPROVEMENT: Icons.EditIcon,
    EMAIL_COPY: Icons.MailIcon,
    LONG_FORM: Icons.FileTextIcon,
    OTHER_FLOWS: Icons.BellIcon,
    PODCAST_TOOLS: Icons.MicIcon,
    SALES_FUNNEL_COPY: Icons.ActivityIcon,
};

export const ToolActivationModal: React.FC<ToolActivationModalProps> = ({ tool, onClose, onStart, onSetDontShowAgain }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    if (!tool) return null;

    const Icon = categoryIcons[tool.category] || Icons.BoxIcon;

    const handleStartClick = () => {
        if (dontShowAgain) {
            onSetDontShowAgain(tool.id, true);
        }
        onStart(tool);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4 transition-opacity animate-[fadeIn_0.2s_ease-out]"
            onClick={onClose}
        >
            <div
                className="bg-light-bg-component dark:bg-dark-bg-component rounded-lg shadow-2xl w-full max-w-2xl transition-transform transform scale-100 animate-[scaleUp_0.2s_ease-out] text-center"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-8 lg:p-12">
                    <Icon className="w-16 h-16 text-primary-accent mx-auto mb-5" />
                    <h3 className="font-serif text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3">{tool.title}</h3>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6 text-lg leading-relaxed">{tool.description}</p>
                    <div className="mb-6">
                        <div className="flex items-center justify-center gap-4 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                            <span>Powered by {tool.primaryModel}</span>
                            {tool.questions.length > 0 && (
                                <span>• {tool.questions.length} questions</span>
                            )}
                            {tool.featured && (
                                <span className="text-yellow-600 dark:text-yellow-400">• Featured</span>
                            )}
                        </div>
                    </div>
                    <a href="#" className="text-primary-accent font-medium text-base hover:underline mb-8 inline-block">Watch tutorial</a>
                    
                    <button 
                        onClick={handleStartClick} 
                        className="w-full px-5 py-3 rounded-md text-lg font-medium bg-primary-accent text-text-on-accent hover:opacity-85 transition-opacity"
                    >
                        Start {tool.title}
                    </button>

                     <div className="mt-6 text-left">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                            <input 
                                type="checkbox" 
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-dark-bg-component text-primary-accent focus:ring-primary-accent"
                            />
                            Don't show this again for this tool
                        </label>
                    </div>
                </div>
                 <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-black/10 dark:hover:bg-white/10">
                    <Icons.XIcon className="w-6 h-6" />
                </button>
            </div>
             <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
};
