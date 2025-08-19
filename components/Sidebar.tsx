
import React, { useState, useEffect, useRef } from 'react';
import type { View, Project, DynamicTool, ChatHistoryItem } from '../types';
import { useTools } from '../hooks/useTools';
import {
    ArtemoFullLogo, PlusIcon, SearchIcon, DashboardIcon, BoxIcon, HistoryIcon,
    UsersIcon, EditIcon, MessageSquareIcon, MailIcon, FileTextIcon,
    MicIcon, ActivityIcon, BellIcon, SettingsIcon, HelpCircleIcon, LogOutIcon, FolderIcon,
    StarIcon, ChevronDownIcon, TrashIcon, UserPlusIcon, MoreHorizontalIcon
} from './Icons';

interface SidebarProps {
    currentView: View;
    isSidebarOpen: boolean;
    onNavigate: (view: View) => void;
    onNewProject: () => void;
    projects: Project[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    favoriteTools: string[];
    recentTools: string[];
    chatHistory: ChatHistoryItem[];
    onInitiateToolActivation: (tool: DynamicTool) => void;
    onClearHistory: () => void;
    onOpenRenameModal: (item: { id: string; name: string; type: 'project' | 'chat' }) => void;
    onDeleteProject: (projectId: string) => void;
    onDeleteChat: (chatId: string) => void;
}

const NavLink: React.FC<{
    view: View;
    currentView: View;
    onNavigate: (view: View) => void;
    icon: React.ReactNode;
    label: string;
}> = ({ view, currentView, onNavigate, icon, label }) => (
    <a
        href="#"
        onClick={(e) => { e.preventDefault(); onNavigate(view); }}
        className={`flex items-center gap-3 px-2.5 py-2 rounded-sm text-sm font-medium transition-colors ${
            currentView === view
                ? 'bg-light-bg-page dark:bg-dark-bg-page text-light-text-primary dark:text-dark-text-primary'
                : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-page dark:hover:bg-dark-bg-page hover:text-light-text-primary dark:hover:text-dark-text-primary'
        }`}
    >
        {icon}
        <span>{label}</span>
    </a>
);

const UserMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <div
                className={`absolute bottom-full left-0 w-full mb-2 p-2 bg-light-bg-component dark:bg-dark-bg-component border border-light-border dark:border-dark-border rounded-md shadow-lg transition-all duration-200 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}
            >
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm rounded-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-sidebar hover:text-light-text-primary dark:hover:text-dark-text-primary"><SettingsIcon className="w-4 h-4" />Settings</a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm rounded-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-sidebar hover:text-light-text-primary dark:hover:text-dark-text-primary"><HelpCircleIcon className="w-4 h-4" />Get Help</a>
                <div className="h-px bg-light-border dark:bg-dark-border my-2"></div>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm rounded-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-sidebar dark:hover:bg-dark-bg-sidebar hover:text-light-text-primary dark:hover:text-dark-text-primary"><LogOutIcon className="w-4 h-4" />Log Out</a>
            </div>
            <div
                className="flex items-center gap-3 cursor-pointer border-t border-light-border dark:border-dark-border -mx-4 px-4 pt-4"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-semibold text-white">AS</div>
                <div className="flex-grow">
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">Arminorum's Workspace</p>
                </div>
            </div>
        </div>
    );
};

const CollapsibleSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
}> = ({ title, icon, children, headerAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left px-2.5 py-2 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-page dark:hover:bg-dark-bg-page hover:text-light-text-primary dark:hover:text-dark-text-primary rounded-sm"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span>{title}</span>
                </div>
                <div className="flex items-center">
                    {headerAction && <div onClick={e => e.stopPropagation()}>{headerAction}</div>}
                    <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && <div className="pl-4 pt-2 pb-1 space-y-1">{children}</div>}
        </div>
    );
};

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
            <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsOpen(!isOpen); }} className="p-1 rounded-full text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-bg-page dark:hover:bg-dark-bg-page">
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


export const Sidebar: React.FC<SidebarProps> = ({
    currentView, isSidebarOpen, onNavigate, onNewProject, projects,
    searchTerm, onSearchChange, favoriteTools, recentTools, chatHistory,
    onInitiateToolActivation, onClearHistory, onOpenRenameModal, onDeleteProject, onDeleteChat
}) => {
    const { tools } = useTools();
    
    const navItems: { view: View; icon: React.ReactNode; label: string }[] = [
        { view: 'dashboard-view', icon: <DashboardIcon className="w-4 h-4" />, label: 'Dashboard' },
        { view: 'all-tools-view', icon: <BoxIcon className="w-4 h-4" />, label: 'All Tools' },
        { view: 'all-projects-view', icon: <FolderIcon className="w-4 h-4" />, label: 'All Projects' },
        { view: 'history-view', icon: <HistoryIcon className="w-4 h-4" />, label: 'History' },
    ];
    const categoryNavItems: { view: View; icon: React.ReactNode; label: string }[] = [
        { view: 'client-management-view', icon: <UsersIcon className="w-4 h-4" />, label: 'Client Management' },
        { view: 'copy-improvement-view', icon: <EditIcon className="w-4 h-4" />, label: 'Copy Improvement' },
        { view: 'ad-copy-view', icon: <MessageSquareIcon className="w-4 h-4" />, label: 'Ad Copy' },
        { view: 'email-copy-view', icon: <MailIcon className="w-4 h-4" />, label: 'Email Copy' },
        { view: 'long-form-view', icon: <FileTextIcon className="w-4 h-4" />, label: 'Long Form Content' },
        { view: 'podcast-tools-view', icon: <MicIcon className="w-4 h-4" />, label: 'Podcast Tools' },
        { view: 'sales-funnel-copy-view', icon: <ActivityIcon className="w-4 h-4" />, label: 'Sales & Funnel Copy' },
        { view: 'other-flows-view', icon: <BellIcon className="w-4 h-4" />, label: 'Other' },
    ];

    const favToolsData = favoriteTools.map(id => tools.find(t => t.id === id)).filter(Boolean) as DynamicTool[];
    const recentToolsData = recentTools.map(id => tools.find(t => t.id === id)).filter(Boolean) as DynamicTool[];

    return (
        <aside className={`fixed lg:relative top-0 left-0 h-full w-[280px] bg-light-bg-sidebar dark:bg-dark-bg-sidebar border-r border-light-border dark:border-dark-border flex flex-col p-4 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="flex-grow overflow-y-auto pr-1">
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('dashboard-view'); }} className="flex items-center p-2 mb-6">
                    <ArtemoFullLogo className="h-8" />
                </a>

                <button onClick={onNewProject} className="flex items-center justify-center gap-2 w-full p-2.5 mb-4 rounded-sm border-none text-sm font-medium cursor-pointer bg-primary-accent text-text-on-accent hover:opacity-85 transition-opacity">
                    <PlusIcon className="w-4 h-4" />
                    <span>New Project</span>
                </button>

                 <div className="relative my-4">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Find a tool..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-sm border border-light-border dark:border-dark-border bg-light-bg-component dark:bg-dark-bg-component text-light-text-secondary dark:text-dark-text-secondary focus:ring-2 focus:ring-primary-accent focus:outline-none"
                    />
                </div>

                <nav className="flex flex-col gap-1">
                    {navItems.map(item => <NavLink key={item.view} {...item} currentView={currentView} onNavigate={onNavigate} />)}
                </nav>

                <div className="my-2 space-y-1">
                    <CollapsibleSection title="Favorite Tools" icon={<StarIcon className="w-4 h-4 text-yellow-500" isFilled />}>
                        {favToolsData.length > 0 ? favToolsData.map(tool => (
                             <a href="#" key={tool.id} onClick={e => { e.preventDefault(); onInitiateToolActivation(tool); }} className="block truncate text-sm text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary p-1 rounded-sm">{tool.title}</a>
                        )) : <span className="block text-sm text-light-text-tertiary dark:text-dark-text-tertiary p-1">No favorite tools yet.</span>}
                    </CollapsibleSection>
                    <CollapsibleSection title="Recent Tools" icon={<HistoryIcon className="w-4 h-4" />}>
                         {recentToolsData.length > 0 ? recentToolsData.map(tool => (
                             <a href="#" key={tool.id} onClick={e => { e.preventDefault(); onInitiateToolActivation(tool); }} className="block truncate text-sm text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary p-1 rounded-sm">{tool.title}</a>
                        )) : <span className="block text-sm text-light-text-tertiary dark:text-dark-text-tertiary p-1">No recent tools.</span>}
                    </CollapsibleSection>
                    <CollapsibleSection
                        title="Recent History"
                        icon={<FolderIcon className="w-4 h-4" />}
                        headerAction={chatHistory.length > 0 ? <button onClick={onClearHistory} title="Clear All History"><TrashIcon className="w-4 h-4 text-light-text-tertiary hover:text-red-500" /></button> : null}
                    >
                         {chatHistory.length > 0 ? chatHistory.slice(0, 10).map(item => (
                             <div key={item.id} className="group relative text-sm text-light-text-tertiary dark:text-dark-text-tertiary p-1.5 rounded-sm hover:bg-light-bg-page dark:hover:bg-dark-bg-page">
                                <p className="font-medium text-light-text-secondary dark:text-dark-text-secondary truncate pr-6">{item.toolTitle}</p>
                                <p className="truncate italic">"{item.messages.find(m => m.sender === 'user')?.text || '...'}"</p>
                                <p className="opacity-70">{new Date(item.timestamp).toLocaleDateString()}</p>
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ActionMenu
                                        onRename={() => onOpenRenameModal({ id: item.id, name: item.toolTitle, type: 'chat' })}
                                        onDelete={() => onDeleteChat(item.id)}
                                    />
                                </div>
                             </div>
                        )) : <span className="block text-sm text-light-text-tertiary dark:text-dark-text-tertiary p-1">No chat history.</span>}
                    </CollapsibleSection>
                </div>


                <div className="h-px bg-light-border dark:bg-dark-border my-2"></div>
                

                <div className="mt-4 flex flex-col gap-1">
                    {projects.map((project) => (
                        <div key={project.id} className="group flex items-center justify-between text-sm font-medium rounded-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-page dark:hover:bg-dark-bg-page hover:text-light-text-primary dark:hover:text-dark-text-primary">
                            <a href="#" onClick={e => e.preventDefault()} className="flex-grow flex items-center gap-3 px-2.5 py-2">
                                <FolderIcon className="w-4 h-4" />
                                <span className="truncate">{project.name}</span>
                            </a>
                            <div className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <ActionMenu 
                                    onRename={() => onOpenRenameModal({ id: project.id, name: project.name, type: 'project' })}
                                    onDelete={() => onDeleteProject(project.id)}
                               />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            <footer className="flex-shrink-0">
                 <div className="flex flex-col gap-1 mb-4">
                    <a href="#" className="flex items-center gap-3 px-2.5 py-2 rounded-sm text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-page dark:hover:bg-dark-bg-page hover:text-light-text-primary dark:hover:text-dark-text-primary">
                        <UsersIcon className="w-4 h-4" />
                        <span>Join our community</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-2.5 py-2 rounded-sm text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-page dark:hover:bg-dark-bg-page hover:text-light-text-primary dark:hover:text-dark-text-primary">
                        <UserPlusIcon className="w-4 h-4" />
                        <span>Invite members</span>
                    </a>
                </div>
                <UserMenu />
            </footer>
        </aside>
    );
};