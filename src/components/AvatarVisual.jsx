import React from 'react';

const AvatarVisual = ({ state = 'idle', size = 'md' }) => {
  // size: 'sm' (for FAB), 'md' (for drawer)
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
  };

  const ringBase = 'absolute rounded-full pointer-events-none transition-all duration-500';
  
  let animationClass = '';
  let ringColors = '';
  let statusText = '';
  let statusColor = '';

  switch (state) {
    case 'listening':
      animationClass = '[animation:avatar-listen-wave_0.8s_ease-in-out_infinite]';
      ringColors = 'border-(--color-accent) bg-(--color-accent)/10';
      statusText = 'Listening...';
      statusColor = 'text-(--color-accent)';
      break;
    case 'thinking':
      animationClass = '[animation:avatar-think-spin_1.5s_linear_infinite]';
      ringColors = 'border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent border-[3px] bg-indigo-550/5';
      statusText = 'Analyzing...';
      statusColor = 'text-indigo-500';
      break;
    case 'speaking':
      animationClass = '[animation:avatar-speak-ripple_1.2s_ease-out_infinite]';
      ringColors = 'border-(--color-accent) bg-(--color-accent)/10';
      statusText = 'Speaking';
      statusColor = 'text-(--color-accent)';
      break;
    case 'idle':
    default:
      animationClass = '[animation:avatar-idle-pulse_2.5s_ease-in-out_infinite]';
      ringColors = 'border-(--color-accent)/30 bg-(--color-accent)/5';
      statusText = 'Online';
      statusColor = 'text-(--color-accent)';
      break;
  }

  return (
    <div className={`relative flex flex-col items-center justify-center ${size === 'md' ? 'mb-4' : ''}`}>
      {/* Container for Hologram */}
      <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${state === 'idle' ? '[animation:avatar-float_4s_ease-in-out_infinite]' : ''}`}>
        
        {/* Outer Ring 1 (Animated) */}
        <div className={`${ringBase} w-full h-full border-2 ${ringColors} ${animationClass}`} />
        
        {/* Inner Glassmorphism Disc */}
        <div className="absolute inset-1.5 rounded-full backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 overflow-hidden shadow-inner z-10 flex items-center justify-center">
          <img src="/avatar.png" alt="Aria" className="w-full h-full object-cover opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" />
        </div>
      </div>

      {/* Status Label (Only in drawer mode) */}
      {size === 'md' && (
        <div className={`mt-6 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-black/20 flex items-center gap-2 ${statusColor}`}>
          {(state === 'listening' || state === 'speaking') && (
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 bg-current`}></span>
            </span>
          )}
          {state === 'idle' && (
             <span className={`relative inline-flex rounded-full h-2 w-2 bg-current`}></span>
          )}
          {state === 'thinking' && (
            <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {statusText}
        </div>
      )}
    </div>
  );
};

export default AvatarVisual;
