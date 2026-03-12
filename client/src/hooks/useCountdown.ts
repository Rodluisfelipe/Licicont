import { useState, useEffect, useCallback } from 'react';

interface CountdownResult {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
}

/**
 * Countdown hook para mostrar tiempo restante.
 */
export function useCountdown(targetDate: Date | string | null): CountdownResult {
  const getTimeLeft = useCallback(() => {
    if (!targetDate) return 0;
    const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    return Math.max(0, target.getTime() - Date.now());
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [getTimeLeft]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return {
    hours,
    minutes,
    seconds,
    isExpired: timeLeft <= 0,
    formatted: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
  };
}
