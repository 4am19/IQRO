import { useRef, useCallback } from 'react';

interface TracingResult {
    isComplete: boolean;
    coverage: number; // 0–100
}

export function useTracingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);
    const coveredPixelsRef = useRef<Set<string>>(new Set());
    const totalPathPixelsRef = useRef<number>(0);

    const getPos = (e: React.TouchEvent | React.MouseEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if ('touches' in e) {
            const touch = e.touches[0];
            return {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY,
            };
        }
        return {
            x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
            y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
        };
    };

    const initCanvas = useCallback((pathPixelCount: number) => {
        totalPathPixelsRef.current = pathPixelCount;
        coveredPixelsRef.current = new Set();
    }, []);

    const startDraw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        isDrawingRef.current = true;
        const pos = getPos(e, canvas);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }, []);

    const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (!isDrawingRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pos = getPos(e, canvas);
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#10b981';
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);

        // Track covered pixels
        const key = `${Math.round(pos.x / 5)},${Math.round(pos.y / 5)}`;
        coveredPixelsRef.current.add(key);
    }, []);

    const stopDraw = useCallback(() => {
        isDrawingRef.current = false;
    }, []);

    const clearCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        coveredPixelsRef.current = new Set();
    }, []);

    const getCoverage = useCallback((): number => {
        if (totalPathPixelsRef.current === 0) return 0;
        const covered = coveredPixelsRef.current.size;
        return Math.min(100, Math.round((covered / totalPathPixelsRef.current) * 100));
    }, []);

    return { canvasRef, startDraw, draw, stopDraw, clearCanvas, getCoverage, initCanvas };
}
