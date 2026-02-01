import { useState } from 'react';
import type { Question, UserAnswer } from '../lib/types';
import { cn } from '../lib/utils';
import { ChevronRight, X } from 'lucide-react';

interface QuizViewProps {
    questions: Question[];
    onComplete: (answers: UserAnswer[]) => void;
    onCancel: () => void;
}

export function QuizView({ questions, onComplete, onCancel }: QuizViewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<UserAnswer[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    const currentQuestion = questions[currentIndex];
    // Calculate progress percentage
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleAnswer = (answerIndex: number) => {
        if (selectedAnswer !== null) return; // Prevent double taps
        setSelectedAnswer(answerIndex);

        // Record answer but wait for user to click Next
    };

    const handleNext = () => {
        if (selectedAnswer === null) return;

        const isCorrect = currentQuestion.answers[selectedAnswer].correctAnswer;
        const newAnswer: UserAnswer = {
            questionIndex: currentIndex,
            isCorrect,
            selectedAnswerIndex: selectedAnswer
        };

        const newAnswers = [...answers, newAnswer];
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            onComplete(newAnswers);
        }
    };

    // Helper to determine button style
    const getAnswerStyle = (idx: number) => {
        if (selectedAnswer === null) {
            return "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-slate-50";
        }

        const isSelected = selectedAnswer === idx;
        const isCorrect = currentQuestion.answers[idx].correctAnswer;

        if (isSelected) {
            return isCorrect
                ? "border-green-500 bg-green-50 text-green-900"
                : "border-red-500 bg-red-50 text-red-900";
        }

        if (isCorrect) {
            return "border-green-500 bg-green-50 text-green-900";
        }

        return "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 shrink-0">
                <div
                    className="bg-indigo-600 h-2 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-4xl mx-auto h-full flex flex-col md:grid md:grid-cols-2 md:gap-12 md:items-start">

                    {/* Left Column: Question & Image */}
                    <div className="space-y-6 md:sticky md:top-0">
                        <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                            <button
                                onClick={onCancel}
                                className="p-2 -ml-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2 group"
                                aria-label="Cancel Quiz"
                            >
                                <X size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs uppercase font-bold">Cancel</span>
                            </button>
                            <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded truncate max-w-[120px]">
                                Curs: {currentQuestion.source}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                            <span>Question {currentIndex + 1} of {questions.length}</span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                            {currentQuestion.question}
                        </h2>

                        {currentQuestion.image && (
                            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm max-w-full md:max-w-sm">
                                <img
                                    src={currentQuestion.image}
                                    alt="Question Reference"
                                    className="w-full h-auto object-cover max-h-60"
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column: Answers & Actions */}
                    <div className="flex flex-col gap-4 mt-8 md:mt-12">
                        <div className="space-y-3">
                            {currentQuestion.answers.map((answer, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={selectedAnswer !== null}
                                    className={cn(
                                        "w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 text-lg group relative overflow-hidden font-medium",
                                        getAnswerStyle(idx),
                                        selectedAnswer === null && "active:scale-[0.98]"
                                    )}
                                >
                                    <div className="flex items-center justify-between relative z-10 w-full">
                                        <span>{answer.answerText}</span>
                                        {selectedAnswer === idx && (
                                            currentQuestion.answers[idx].correctAnswer
                                                ? <ChevronRight size={24} className="ml-2 text-green-600" />
                                                : <ChevronRight size={24} className="ml-2 text-red-600 rotate-90" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Next Button */}
                        <div className={cn(
                            "mt-6 transition-all duration-300 transform",
                            selectedAnswer !== null
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-4 pointer-events-none"
                        )}>
                            <button
                                onClick={handleNext}
                                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                            >
                                <span>{currentIndex < questions.length - 1 ? "Next Question" : "See Results"}</span>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
