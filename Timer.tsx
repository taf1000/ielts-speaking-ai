import React, { useState, useEffect } from 'react';

interface TimerProps {
  isRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ isRunning }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="font-mono text-xl text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
      {formatTime(seconds)}
    </div>
  );
};

export default Timer;