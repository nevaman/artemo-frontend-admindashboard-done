
import React from 'react';
import type { DynamicTool } from '../types';
import * as Icons from './Icons';

interface ToolCardProps {
    tool: DynamicTool;
    onInitiateToolActivation: (tool: DynamicTool) => void;
    isFavorite: boolean;
    onToggleFavorite: (toolId: string) => void;
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

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onInitiateToolActivation, isFavorite, onToggleFavorite }) => {
    const Icon = categoryIcons[tool.category] || Icons.BoxIcon;

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onToggleFavorite(tool.id);
    };

    return (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); onInitiateToolActivation(tool); }}
            className="group relative bg-light-bg-component dark:bg-dark-bg-component border border-light-border dark:border-dark-border p-5 rounded-md no-underline flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-2xl"
            title={tool.description}
        >
            <button
                onClick={handleFavoriteClick}
                className="absolute top-2 right-2 p-1 text-light-text-tertiary dark:text-dark-text-tertiary rounded-full hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-page opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <Icons.StarIcon className={`w-5 h-5 ${isFavorite ? 'text-yellow-500' : ''}`} isFilled={isFavorite} />
            </button>
            <Icon className="w-6 h-6 text-primary-accent" />
            <span className="font-serif flex-grow font-bold text-light-text-primary dark:text-dark-text-primary text-lg pr-4">{tool.title}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary bg-light-bg-sidebar dark:bg-dark-bg-component py-1 px-2 rounded-sm self-start">{tool.category.replace(/_/g, ' ')}</span>
                {tool.featured && (
                    <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 py-1 px-2 rounded-sm">Featured</span>
                )}
            </div>
        </a>
    );
};