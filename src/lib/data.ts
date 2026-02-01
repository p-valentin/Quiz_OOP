import rawQuestions from '../../question.json';
import type { Question } from './types';

// Cast and export the dataset
export const dataset: Question[] = rawQuestions as unknown as Question[];

// Helper to get unique sources
export function getUniqueSources(questions: Question[]): number[] {
    const sources = new Set(questions.map(q => q.source));
    return Array.from(sources).sort((a, b) => a - b);
}
