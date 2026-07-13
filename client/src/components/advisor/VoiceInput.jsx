import React, { useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';

const VoiceInput = ({ onTranscript, isDarkMode }) => {
  const { isListening, isSupported, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  // When transcript updates and we stop listening, pass it up
  useEffect(() => {
    if (!isListening && transcript && onTranscript) {
      onTranscript(transcript + ' ');
      resetTranscript();
    }
  }, [isListening, transcript]);

  if (!isSupported) return null;

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <button
      onClick={handleToggle}
      title={isListening ? 'Stop listening' : 'Click to speak'}
      style={{
        padding: '10px 12px',
        background: isListening
          ? (isDarkMode ? 'rgba(0,191,165,0.15)' : 'rgba(0,121,107,0.1)')
          : (isDarkMode ? '#0D1B2A' : '#FFFFFF'),
        border: '1px solid',
        borderColor: isListening
          ? (isDarkMode ? '#00BFA5' : '#00796B')
          : (isDarkMode ? '#1E3A5F' : '#94A3B8'),
        borderRadius: '8px',
        color: isListening
          ? (isDarkMode ? '#00BFA5' : '#00796B')
          : (isDarkMode ? '#94A3B8' : '#6B7280'),
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 200ms',
      }}
    >
      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
    </button>
  );
};

export default VoiceInput;
