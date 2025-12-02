import React from 'react';

interface WaveformProps {
  active: boolean;
  isSpeaking: boolean; // Is AI speaking?
  volume: number; // Mic volume
}

const Waveform: React.FC<WaveformProps> = ({ active, isSpeaking, volume }) => {
  if (!active) return <div className="h-16 flex items-center justify-center text-gray-400 text-sm">Waiting to start...</div>;

  return (
    <div className="flex items-center justify-center h-24 gap-1">
      {/* 
        Visual Logic:
        If AI is speaking, we show a consistent smooth wave.
        If User is speaking (volume > 0.01), we show choppy bars based on volume.
        Otherwise, flat line.
      */}
      {[...Array(8)].map((_, i) => {
        let height = 'h-2';
        let animation = '';
        
        if (isSpeaking) {
           height = 'h-12';
           animation = 'animate-pulse';
        } else if (volume > 0.01) {
           // Simple visualizer simulation
           const randomScale = Math.max(0.2, Math.min(1, volume * 5 * Math.random()));
           height = `h-[${Math.floor(randomScale * 60)}px]`;
           animation = 'duration-75'; 
        }

        // Inline style for dynamic height since Tailwind doesn't support dynamic arbitrary values well in class strings without JIT full interpolation
        const style = isSpeaking 
          ? { animationDelay: `${i * 0.1}s` } 
          : { height: volume > 0.01 ? `${Math.max(10, volume * 200 * (Math.random() + 0.5))}px` : '4px' };
        
        return (
          <div
            key={i}
            className={`w-3 bg-blue-600 rounded-full transition-all ${animation} ${isSpeaking ? 'royal-gradient' : 'bg-blue-500'}`}
            style={style}
          />
        );
      })}
    </div>
  );
};

export default Waveform;