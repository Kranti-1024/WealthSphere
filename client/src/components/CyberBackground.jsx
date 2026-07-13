import React from 'react';

const CyberBackground = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen bg-[#050508] text-white overflow-x-hidden flex flex-col font-sans">
      {/* Glowing blurred background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      
      {/* Grid overlay for tech look */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40"></div>
      
      {/* Cybernetic Particle overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050508_80%)] pointer-events-none"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default CyberBackground;
