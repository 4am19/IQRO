import { useState, useCallback, useEffect, useRef } from 'react';

export interface HarakatEntry {
    latin: string;
    arabic: string;
}

export interface LetterWithHarakat {
    id: number;
    char_arabic: string;
    name: string;
    read_latin: string;
    fathah?: HarakatEntry;
    kasrah?: HarakatEntry;
    dhammah?: HarakatEntry;
}

interface GameOption {
    id: number;
    char_arabic: string;
    name: string;
    displayChar: string;
    readAs: string;
    isCorrect: boolean;
}

export interface Question {
    target: {
        id: number;
        char_arabic: string;
        name: string;
        displayChar: string;
        askText: string;  // e.g. "Ba" or "بَ"
        harakatName: string; // e.g. "Fathah"
    };
    options: GameOption[];
}

const HARAKAT_TYPES = [
    { key: 'fathah',  name: 'Fathah',  sign: '\u064E' }, // َ
    { key: 'kasrah',  name: 'Kasrah',  sign: '\u0650' }, // ِ
    { key: 'dhammah', name: 'Dhammah', sign: '\u064F' }, // ُ
] as const;

type HarakatKey = 'fathah' | 'kasrah' | 'dhammah';

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

export function useGameEngine(
    letters: LetterWithHarakat[],
    gameType: 'multiple_choice' | 'tracing' | 'drag_drop',
    totalQuestions = 10
) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [wrongAnswersList, setWrongAnswersList] = useState<string[]>([]);
    const startTimeRef = useRef<number>(Date.now());

    const generateQuestions = useCallback(() => {
        if (!letters || letters.length < 4) return;

        const newQuestions: Question[] = [];

        for (let i = 0; i < totalQuestions; i++) {
            const correctLetter = pickRandom(letters);
            const harakatType = pickRandom([...HARAKAT_TYPES]);
            const harakatKey = harakatType.key as HarakatKey;

            // Get base letter data (No harakat)
            const displayChar = correctLetter.char_arabic;
            const askText = correctLetter.name;

            // Generate 3 wrong options
            const wrongOptions: LetterWithHarakat[] = [];
            while (wrongOptions.length < 3) {
                const wrong = pickRandom(letters);
                if (wrong.id !== correctLetter.id && !wrongOptions.find(w => w.id === wrong.id)) {
                    wrongOptions.push(wrong);
                }
            }

            const allOptions: GameOption[] = shuffle([
                {
                    id: correctLetter.id,
                    char_arabic: correctLetter.char_arabic,
                    name: correctLetter.name,
                    displayChar,
                    readAs: askText,
                    isCorrect: true,
                },
                ...wrongOptions.map(w => {
                    return {
                        id: w.id,
                        char_arabic: w.char_arabic,
                        name: w.name,
                        displayChar: w.char_arabic,
                        readAs: w.name,
                        isCorrect: false,
                    };
                }),
            ]);

            newQuestions.push({
                target: {
                    id: correctLetter.id,
                    char_arabic: correctLetter.char_arabic,
                    name: correctLetter.name,
                    displayChar,
                    askText,
                    harakatName: 'Tanpa Harakat',
                },
                options: allOptions,
            });
        }

        setQuestions(newQuestions);
        setCurrentIdx(0);
        setScore(0);
        setCorrectAnswers(0);
        setWrongAnswersList([]);
        setIsFinished(false);
        setFeedback(null);
        startTimeRef.current = Date.now();
    }, [letters, gameType, totalQuestions]);

    useEffect(() => {
        generateQuestions();
    }, [generateQuestions]);

    const handleAnswer = useCallback((isCorrect: boolean) => {
        if (feedback !== null) return;

        setFeedback(isCorrect ? 'correct' : 'wrong');
        const pointsPerQ = 100 / totalQuestions;

        if (isCorrect) {
            setScore(prev => Math.min(100, Math.round(prev + pointsPerQ)));
            setCorrectAnswers(prev => prev + 1);
        } else {
            const currentQuestion = questions[currentIdx];
            if (currentQuestion) {
                setWrongAnswersList(prev => [...prev, currentQuestion.target.askText]);
            }
        }

        setTimeout(() => {
            if (currentIdx + 1 >= totalQuestions) {
                setIsFinished(true);
            } else {
                setCurrentIdx(prev => prev + 1);
                setFeedback(null);
            }
        }, 2500);
    }, [feedback, currentIdx, totalQuestions]);

    const getDurationSeconds = useCallback(() => {
        return Math.round((Date.now() - startTimeRef.current) / 1000);
    }, []);

    return {
        questions,
        currentIdx,
        score,
        correctAnswers,
        isFinished,
        feedback,
        wrongAnswersList,
        generateQuestions,
        handleAnswer,
        getDurationSeconds,
        currentQuestion: questions[currentIdx] ?? null,
    };
}
