
import React, { useState, useEffect, useRef } from 'react';
import type { Project, ToolCategory } from '../types';
import { PlusIcon, FolderIcon, MoreHorizontalIcon, EditIcon, TrashIcon } from './Icons';

const ActionMenu: React.FC<{ onRename: () => void; onDelete: () => void; }> = ({ onRename, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsOpen(!isOpen); }} className="p-1 rounded-full text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-page">
                <MoreHorizontalIcon className="w-4 h-4" />
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-light-bg-component dark:bg-dark-bg-component border border-light-border dark:border-dark-border rounded-md shadow-lg z-10 py-1">
                    <button onClick={(e) => { e.stopPropagation(); onRename(); setIsOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-page">
                        <EditIcon className="w-3.5 h-3.5" /> Rename
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); setIsOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm text-red-600 dark:text-red-500 hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-page">
                        <TrashIcon className="w-3.5 h-3.5" /> Delete
                    </button>
                </div>
            )}
        </div>
    );
};


const categoryColors: { [key in ToolCategory]: string } = {
    AD_COPY: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    CLIENT_MANAGEMENT: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    COPY_IMPROVEMENT: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    EMAIL_COPY: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    LONG_FORM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    OTHER_FLOWS: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300',
    PODCAST_TOOLS: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    SALES_FUNNEL_COPY: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
};

const ProjectCard: React.FC<{ 
    project: Project,
    onOpenRenameModal: (item: { id: string; name: string; type: 'project' }) => void;
    onDeleteProject: (projectId: string) => void;
}> = ({ project, onOpenRenameModal, onDeleteProject }) => {
    return (
        <a
            href="#"
            onClick={e => e.preventDefault()}
            className="group relative bg-light-bg-component dark:bg-dark-bg-component border border-light-border dark:border-dark-border p-5 rounded-md no-underline flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-2xl cursor-pointer"
        >
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ActionMenu 
                    onRename={() => onOpenRenameModal({ id: project.id, name: project.name, type: 'project' })}
                    onDelete={() => onDeleteProject(project.id)}
                />
            </div>
            <FolderIcon className="w-6 h-6 text-primary-accent" />
            <span className="font-serif flex-grow font-bold text-light-text-primary dark:text-dark-text-primary text-lg pr-4">{project.name}</span>
            {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto pt-3">
                    {project.tags.map(tag => (
                        <span key={tag} className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[tag] || 'bg-gray-200'}`}>
                            {tag.replace(/_/g, ' ')}
                        </span>
                    ))}
                </div>
            )}
        </a>
    );
};

interface AllProjectsViewProps {
    projects: Project[];
    onNewProject: () => void;
    onOpenRenameModal: (item: { id: string; name: string; type: 'project' | 'chat' }) => void;
    onDeleteProject: (projectId: string) => void;
}

export const AllProjectsView: React.FC<AllProjectsViewProps> = ({ projects, onNewProject, onOpenRenameModal, onDeleteProject }) => {
    return (
        <div className="p-4 lg:p-6 max-w-5xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">All Projects</h2>
                <button
                    onClick={onNewProject}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm border-none text-base font-medium cursor-pointer bg-primary-accent text-text-on-accent hover:opacity-85 transition-opacity"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>New Project</span>
                </button>
            </div>
            {projects.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                    {projects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project}
                            onOpenRenameModal={onOpenRenameModal}
                            onDeleteProject={onDeleteProject}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-light-bg-sidebar dark:bg-dark-bg-component rounded-lg border border-light-border dark:border-dark-border">
                    <FolderIcon className="w-12 h-12 text-light-text-tertiary dark:text-dark-text-tertiary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">No projects yet</h3>
                    <p className="text-light-text-tertiary dark:text-dark-text-tertiary mt-1">Click "New Project" to get started.</p>
                </div>
            )}
        </div>
    );
};
