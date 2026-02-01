import { useState } from 'react';
import { dataset } from './lib/data';
import type { Question, UserAnswer } from './lib/types';
import { shuffleArray } from './lib/utils';
import { SettingsView } from './components/SettingsView';
import { SummaryView } from './components/SummaryView';
import { QuizView } from './components/QuizView';

type ViewState = 'settings' | 'quiz' | 'summary';

function App() {
  const [view, setView] = useState<ViewState>('settings');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  const handleStart = (sourceIds: number[], count: number) => {
    // 1. Filter
    const filtered = dataset.filter(q => sourceIds.includes(q.source));
    // 2. Shuffle
    const shuffled = shuffleArray(filtered);
    // 3. Slice
    const selected = shuffled.slice(0, count);

    setActiveQuestions(selected);
    setUserAnswers([]);
    setView('quiz');
  };

  const handleQuizComplete = (answers: UserAnswer[]) => {
    setUserAnswers(answers);
    setView('summary');
  };

  const handleRestart = () => {
    setView('settings');
    setActiveQuestions([]);
    setUserAnswers([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-800 flex items-center justify-center p-4">
      <main className="w-full max-w-md md:max-w-4xl bg-white shadow-2xl overflow-hidden rounded-3xl h-[850px] max-h-[90vh] relative transition-all duration-500 ease-out">
        {view === 'settings' && (
          <SettingsView allQuestions={dataset} onStart={handleStart} />
        )}

        {view === 'quiz' && (
          <QuizView questions={activeQuestions} onComplete={handleQuizComplete} />
        )}

        {view === 'summary' && (
          <SummaryView questions={activeQuestions} userAnswers={userAnswers} onRestart={handleRestart} />
        )}
      </main>
    </div>
  );
}

export default App;
