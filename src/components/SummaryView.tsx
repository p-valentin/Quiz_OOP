import type { Question, UserAnswer } from '../lib/types';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface SummaryViewProps {
    questions: Question[];
    userAnswers: UserAnswer[];
    onRestart: () => void;
    onRetryMistakes: () => void;
}

export function SummaryView({ questions, userAnswers, onRestart, onRetryMistakes }: SummaryViewProps) {
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    const wrongAnswers = userAnswers.filter(a => !a.isCorrect);

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300 overflow-y-auto">
            <div className="p-8 text-center bg-indigo-600 text-white rounded-b-[2.5rem] shadow-xl shrink-0">
                <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                <div className="relative w-32 h-32 mx-auto my-6 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                            className="text-indigo-400"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            className="text-white drop-shadow-md transition-all duration-1000 ease-out"
                            strokeDasharray={`${percentage}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                    </svg>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold">{percentage}%</span>
                    </div>
                </div>
                <p className="text-indigo-100 text-lg">You scored {correctCount} out of {total}</p>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <AlertCircle size={20} className="text-amber-500" />
                    Mistakes Review
                </h3>

                {wrongAnswers.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                        <p>Perfect score! No mistakes to review.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {wrongAnswers.map((ans, idx) => {
                            // Note: The questionIndex in userAnswers refers to the index in the 'questions' array passed prop
                            const question = questions[ans.questionIndex];
                            const userAnswerText = question.answers[ans.selectedAnswerIndex].answerText;
                            const correctAnswerText = question.answers.find(a => a.correctAnswer)?.answerText;

                            return (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                                    <p className="font-medium text-slate-900 mb-3">{question.question}</p>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2 text-red-600 bg-red-50 p-2 rounded-lg">
                                            <XCircle size={16} className="mt-0.5 shrink-0" />
                                            <span><span className="font-semibold">Your Answer:</span> {userAnswerText}</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-green-700 bg-green-50 p-2 rounded-lg">
                                            <CheckCircle size={16} className="mt-0.5 shrink-0" />
                                            <span><span className="font-semibold">Correct:</span> {correctAnswerText}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="p-6 shrink-0 bg-white border-t border-slate-100 space-y-3">
                {wrongAnswers.length > 0 && (
                    <button
                        onClick={onRetryMistakes}
                        className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-lg font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors"
                    >
                        <RefreshCw size={20} />
                        <span>Retry Mistakes Only</span>
                    </button>
                )}
                <button
                    onClick={onRestart}
                    className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-lg font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    <RefreshCw size={20} />
                    <span>Start New Quiz</span>
                </button>
            </div>
        </div>
    );
}
