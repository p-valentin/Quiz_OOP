import rawQuestions from '../../question.json';
import type { Question } from './types';

import { uniqBy } from 'lodash';

// Cast and export the dataset, removing duplicates based on question text
export const dataset: Question[] = uniqBy(rawQuestions as unknown as Question[], 'question');

// Helper to get unique sources
export function getUniqueSources(questions: Question[]): number[] {
    const sources = new Set(questions.map(q => q.source));
    return Array.from(sources).sort((a, b) => a - b);
}
