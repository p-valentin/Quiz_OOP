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

  const handleRetryMistakes = () => {
    // 1. Identify wrong answers
    const wrongAnswers = userAnswers.filter(a => !a.isCorrect);

    // 2. Map back to original questions using questionIndex
    const wrongQuestions = wrongAnswers.map(a => activeQuestions[a.questionIndex]);

    // 3. Shuffle them
    const shuffled = shuffleArray(wrongQuestions);

    // 4. Start new quiz
    setActiveQuestions(shuffled);
    setUserAnswers([]);
    setView('quiz');
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel the quiz?")) {
      setView('settings');
      setActiveQuestions([]);
      setUserAnswers([]);
    }
  };

  return (
    <div className="min-h-dvh md:min-h-screen bg-white md:bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-800 flex flex-col md:items-center md:justify-center md:p-4">
      <main className="flex-1 w-full md:h-[850px] md:max-h-[90vh] md:max-w-4xl bg-white md:shadow-2xl overflow-hidden md:rounded-3xl relative transition-all duration-500 ease-out flex flex-col">
        {view === 'settings' && (
          <SettingsView allQuestions={dataset} onStart={handleStart} />
        )}

        {view === 'quiz' && (
          <QuizView
            questions={activeQuestions}
            onComplete={handleQuizComplete}
            onCancel={handleCancel}
          />
        )}

        {view === 'summary' && (
          <SummaryView
            questions={activeQuestions}
            userAnswers={userAnswers}
            onRestart={handleRestart}
            onRetryMistakes={handleRetryMistakes}
          />
        )}
      </main>
    </div>
  );
}

export default App;
