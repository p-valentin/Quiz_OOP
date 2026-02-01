import type { Question } from '../lib/types';
import { getUniqueSources } from '../lib/data';
import { Settings, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import React, { useMemo } from 'react';

interface SettingsViewProps {
    allQuestions: Question[];
    onStart: (sourceIds: number[], count: number) => void;
}

export function SettingsView({ allQuestions, onStart }: SettingsViewProps) {
    const uniqueSources = useMemo(() => getUniqueSources(allQuestions), [allQuestions]);

    const [selectedSources, setSelectedSources] = React.useState<number[]>([]);
    const [questionCount, setQuestionCount] = React.useState<number | ''>(10);

    const availableQuestionsCount = useMemo(() => {
        return allQuestions.filter(q => selectedSources.includes(q.source)).length;
    }, [allQuestions, selectedSources]);

    const handleToggleSource = (id: number) => {
        setSelectedSources(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedSources.length === uniqueSources.length) {
            setSelectedSources([]);
        } else {
            setSelectedSources(uniqueSources);
        }
    };

    const handleStart = () => {
        const count = typeof questionCount === 'number' ? questionCount : availableQuestionsCount;
        onStart(selectedSources, Math.min(count, availableQuestionsCount));
    };

    const isValid = selectedSources.length > 0 && typeof questionCount === 'number' && questionCount > 0 && questionCount <= availableQuestionsCount;

    return (
        <div className="flex flex-col h-full max-w-md mx-auto p-6 space-y-8 animate-fade-in">
            <header className="text-center space-y-2 mt-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mb-4">
                    <Settings size={32} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Review Quiz</h1>
                <p className="text-slate-500">Configure your session</p>
            </header>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Sources</h2>
                    <button
                        onClick={handleSelectAll}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        {selectedSources.length === uniqueSources.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-[30vh] overflow-y-auto pr-1">
                    {uniqueSources.map(source => (
                        <button
                            key={source}
                            onClick={() => handleToggleSource(source)}
                            className={cn(
                                "flex items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium",
                                selectedSources.includes(source)
                                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            Curs {source}
                        </button>
                    ))}
                </div>
                {selectedSources.length > 0 && (
                    <p className="text-center text-xs text-slate-500">
                        {availableQuestionsCount} questions available based on selection
                    </p>
                )}
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Number of Questions</h2>
                <div className="flex gap-2 justify-between">
                    {[5, 10, 20, 50, 100].map(val => (
                        <button
                            key={val}
                            onClick={() => setQuestionCount(val)}
                            className={cn(
                                "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                                questionCount === val
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            {val}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <input
                        type="number"
                        value={questionCount}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setQuestionCount(isNaN(val) ? '' : val);
                        }}
                        placeholder="Custom amount..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-center font-medium text-slate-900 placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Padding to prevent content hiding behind footer */}
            <div className="pb-24"></div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 md:static md:bg-transparent md:border-0 md:p-0 md:backdrop-blur-none transition-all z-20">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleStart}
                        disabled={!isValid}
                        className={cn(
                            "w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0",
                            isValid
                                ? "bg-indigo-600 hover:bg-indigo-700"
                                : "bg-slate-300 cursor-not-allowed shadow-none transform-none"
                        )}
                    >
                        <span>Start Quiz</span>
                        <Play size={20} fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
}
