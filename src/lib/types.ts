export interface Answer {
    answerText: string;
    correctAnswer: boolean;
}

export interface Question {
    question: string;
    source: number;
    image?: string;
    answers: Answer[];
}

export interface QuizConfig {
    sourceIds: number[];
    questionCount: number;
}

export interface UserAnswer {
    questionIndex: number;
    isCorrect: boolean;
    selectedAnswerIndex: number;
}
