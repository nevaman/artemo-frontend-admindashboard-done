
import React, { useState, useMemo } from 'react';
import type { DynamicTool, ToolCategory } from '../types';
import { useTools } from '../hooks/useTools';
import { ToolCard } from './ToolCard';
import { ChevronDownIcon, UsersIcon, EditIcon, MessageSquareIcon, MailIcon, FileTextIcon, MicIcon, ActivityIcon, BellIcon, SearchIcon } from './Icons';

interface AllToolsViewProps {
    onInitiateToolActivation: (tool: DynamicTool) => void;
    favoriteTools: string[];
    onToggleFavorite: (toolId: string) => void;
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
}

const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
    AD_COPY: MessageSquareIcon,
    CLIENT_MANAGEMENT: UsersIcon,
    COPY_IMPROVEMENT: EditIcon,
    EMAIL_COPY: MailIcon,
    LONG_FORM: FileTextIcon,
    OTHER_FLOWS: BellIcon,
    PODCAST_TOOLS: MicIcon,
    SALES_FUNNEL_COPY: ActivityIcon,
};

const categoryLabels: Record<string, string> = {
    AD_COPY: 'Ad Copy',
    CLIENT_MANAGEMENT: 'Client Management',
    COPY_IMPROVEMENT: 'Copy Improvement',
    EMAIL_COPY: 'Email Copy',
    LONG_FORM: 'Long Form Content',
    OTHER_FLOWS: 'Other',
    PODCAST_TOOLS: 'Podcast Tools',
    SALES_FUNNEL_COPY: 'Sales & Funnel Copy',
};

const CollapsibleCategory: React.FC<{
    category: string;
    tools: DynamicTool[];
    onInitiateToolActivation: (tool: DynamicTool) => void;
    favoriteTools: string[];
    onToggleFavorite: (toolId: string) => void;
}> = ({ category, tools, onInitiateToolActivation, favoriteTools, onToggleFavorite }) => {
    const [isOpen, setIsOpen] = useState(true);
    const categoryName = categoryLabels[category];
    const CategoryIcon = categoryIcons[category];

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-3 px-4 bg-light-bg-sidebar dark:bg-dark-bg-component rounded-md transition-colors hover:bg-light-border dark:hover:bg-dark-border/20"
            >
                <div className="flex items-center gap-3">
                    <CategoryIcon className="w-5 h-5 text-primary-accent" />
                    <h3 className="font-serif text-xl font-bold text-light-text-primary dark:text-dark-text-primary">{categoryName}</h3>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tools.map(tool => (
                        <ToolCard
                            key={tool.id}
                            tool={tool}
                            onInitiateToolActivation={onInitiateToolActivation}
                            isFavorite={favoriteTools.includes(tool.id)}
                            onToggleFavorite={onToggleFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


export const AllToolsView: React.FC<AllToolsViewProps> = ({ onInitiateToolActivation, favoriteTools, onToggleFavorite, searchTerm = '', onSearchChange }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    const { tools, loading, error } = useTools();

    const handleSearchChange = (value: string) => {
        setLocalSearchTerm(value);
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    const filteredTools = useMemo(() => {
        if (!localSearchTerm.trim()) return tools;
        const searchLower = localSearchTerm.toLowerCase();
        return tools.filter(tool => 
            tool.title.toLowerCase().includes(searchLower) ||
            tool.description.toLowerCase().includes(searchLower) ||
            tool.category.toLowerCase().includes(searchLower)
        );
    }, [tools, localSearchTerm]);

    const groupedTools = useMemo(() => {
        const groups: Record<string, DynamicTool[]> = {};
        for (const tool of filteredTools) {
            if (!groups[tool.category]) {
                groups[tool.category] = [];
            }
            groups[tool.category]!.push(tool);
        }
        return groups;
    }, [filteredTools]);
    
    const orderedCategories = Object.keys(groupedTools).filter(cat => groupedTools[cat] && groupedTools[cat]!.length > 0);

    if (loading) {
        return (
            <div className="p-4 lg:p-6 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent mx-auto mb-4"></div>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">Loading tools...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 lg:p-6 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <p className="text-red-600 dark:text-red-400 mb-4">Error loading tools: {error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-primary-accent text-text-on-accent rounded-md hover:opacity-85"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6 max-w-5xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">All Tools</h2>
                <div className="relative w-80">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Search tools..."
                        value={localSearchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-sm border border-light-border dark:border-dark-border bg-light-bg-component dark:bg-dark-bg-component text-light-text-secondary dark:text-dark-text-secondary focus:ring-2 focus:ring-primary-accent focus:outline-none"
                    />
                </div>
            </div>
            {localSearchTerm.trim() && filteredTools.length === 0 ? (
                 <div className="text-center py-12 text-light-text-tertiary dark:text-dark-text-tertiary">
                    <h3 className="text-lg font-semibold">No results found</h3>
                    <p>Try a different search term or check back later for new tools.</p>
                </div>
            ) : (
                <div>
                    {orderedCategories.map(category => (
                        <CollapsibleCategory
                            key={category}
                            category={category}
                            tools={groupedTools[category]!}
                            onInitiateToolActivation={onInitiateToolActivation}
                            favoriteTools={favoriteTools}
                            onToggleFavorite={onToggleFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};