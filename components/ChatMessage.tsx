import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types';
import * as Icons from './Icons';

interface ChatMessageProps {
    message: Message;
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(message.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (message.sender === 'system') {
        return (
            <div className="w-full text-center text-sm text-light-text-tertiary dark:text-dark-text-tertiary py-2">
                <Icons.PaperclipIcon className="w-3 h-3 inline-block mr-1" /> {message.text}
            </div>
        );
    }
    
    const isUser = message.sender === 'user';
    const isAi = message.sender === 'ai';

    return (
        <div className={`flex items-start gap-3 w-full ${isUser ? 'justify-end' : ''}`}>
            {isAi && <Icons.ArtemoIcon className="w-8 h-8 text-primary-accent flex-shrink-0 mt-1" />}
            
            <div className={`flex flex-col max-w-xl w-full ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-lg text-left w-full ${
                    isUser 
                        ? 'bg-transparent border border-primary-accent text-light-text-primary dark:text-dark-text-primary' 
                        : 'bg-light-bg-component dark:bg-dark-bg-component'
                }`}>
                    {message.file && (
                        <div className="mb-3 p-3 border border-light-border dark:border-dark-border rounded-md flex items-center gap-3 bg-black/5 dark:bg-white/5">
                            <Icons.FileTextIcon className="w-6 h-6 text-light-text-tertiary dark:text-dark-text-tertiary flex-shrink-0" />
                            <div className="flex-grow">
                                <p className="font-medium text-sm text-light-text-primary dark:text-dark-text-primary">{message.file.name}</p>
                                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{formatFileSize(message.file.size)}</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="prose prose-base dark:prose-invert max-w-none text-light-text-secondary dark:text-dark-text-secondary prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0 font-serif leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.text}
                        </ReactMarkdown>
                    </div>
                </div>
                
                {isAi && (
                    <button 
                        onClick={handleCopy}
                        className="mt-2 flex items-center gap-1.5 p-1 rounded-md text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        title="Copy text"
                    >
                        {copied 
                            ? <><Icons.CheckIcon className="w-3.5 h-3.5 text-primary-accent" /> Copied</> 
                            : <><Icons.CopyIcon className="w-3.5 h-3.5" /> Copy</>
                        }
                    </button>
                )}
            </div>
        </div>
    );
};