


import React, { useState } from 'react';
import type { ToolCategory } from '../types';
import { XIcon } from './Icons';

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (projectName: string, tags: ToolCategory[]) => void;
    categories: ToolCategory[];
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onCreate, categories }) => {
    const [projectName, setProjectName] = useState('');
    const [selectedTags, setSelectedTags] = useState<ToolCategory[]>([]);

    const handleTagToggle = (tag: ToolCategory) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleCreate = () => {
        onCreate(projectName || `Untitled Project`, selectedTags);
        setProjectName('');
        setSelectedTags([]);
    };

    const handleClose = () => {
        setProjectName('');
        setSelectedTags([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 dark:bg-black/50 z-[1000] flex items-center justify-center p-4 transition-opacity"
            onClick={handleClose}
        >
            <div
                className="bg-light-bg-component dark:bg-dark-bg-component rounded-lg shadow-lg w-full max-w-lg transition-transform transform scale-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 lg:p-6 border-b border-light-border dark:border-dark-border flex justify-between items-center">
                    <h3 className="font-serif text-xl font-bold text-light-text-primary dark:text-dark-text-primary">Create New Project</h3>
                    <button onClick={handleClose} className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <label htmlFor="project-name-input" className="block font-medium text-light-text-primary dark:text-dark-text-primary mb-2 text-base">Project Name</label>
                        <input
                            type="text"
                            id="project-name-input"
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                            className="w-full p-2.5 bg-light-bg-component dark:bg-dark-bg-component border border-light-border dark:border-dark-border rounded-sm text-light-text-primary dark:text-dark-text-primary text-base focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 outline-none"
                            placeholder="e.g., Q4 Email Campaign"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-light-text-primary dark:text-dark-text-primary mb-2 text-base">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => handleTagToggle(category)}
                                    className={`px-3 py-1.5 border rounded-sm text-sm font-medium cursor-pointer transition-colors ${selectedTags.includes(category) ? 'bg-primary-accent text-text-on-accent border-primary-accent' : 'border-light-border dark:border-dark-border hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-page'}`}
                                >
                                    {category.replace(/_/g, ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-4 lg:p-6 border-t border-light-border dark:border-dark-border flex justify-end gap-3">
                    <button onClick={handleClose} className="px-5 py-2 rounded-sm text-base font-medium bg-light-bg-sidebar dark:bg-dark-bg-component border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary hover:opacity-85">Cancel</button>
                    <button onClick={handleCreate} className="px-5 py-2 rounded-sm text-base font-medium bg-primary-accent text-text-on-accent hover:opacity-85">Create Project</button>
                </div>
            </div>
        </div>
    );
};