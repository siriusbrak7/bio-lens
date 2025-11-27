import React, { useState } from 'react';
import { Flashcard } from '../types';
import { RefreshCw, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Props {
  cards: Flashcard[];
}

const FlashcardDeck: React.FC<Props> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  const currentCard = cards[currentIndex];
  const isFinished = completed.length === cards.length;

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = (known: boolean) => {
    if (known) {
      setCompleted([...completed, currentCard.id]);
    }
    
    setIsFlipped(false);
    
    // Simple logic: find next uncompleted card
    const remainingIndices = cards.map((_, i) => i).filter(i => !completed.includes(cards[i].id) && cards[i].id !== currentCard.id);
    
    if (remainingIndices.length > 0) {
      setCurrentIndex(remainingIndices[0]);
    } else if (!known) {
       // If we didn't know it, and it's the last one, stay here
       // Or if we finished all others
    }
  };

  const reset = () => {
    setCompleted([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (isFinished) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center min-h-[300px]">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Session Complete!</h3>
        <p className="text-gray-600 mb-6">You've reviewed all flashcards for this topic.</p>
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-2 bg-notebook-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RotateCcw size={18} /> Review Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4 text-sm text-gray-500 font-mono">
        <span>TYPE: {currentCard.type}</span>
        <span>{completed.length} / {cards.length} MASTERED</span>
      </div>

      <div 
        className="group perspective-1000 w-full h-80 cursor-pointer"
        onClick={handleFlip}
      >
        <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Front</h4>
            <p className="text-xl font-serif text-gray-800 text-center leading-relaxed">
              {currentCard.front}
            </p>
            <div className="absolute bottom-4 text-gray-400 text-xs flex items-center gap-1">
              <RefreshCw size={12} /> Tap to flip
            </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-800 text-white rounded-xl p-8 flex flex-col items-center justify-center shadow-md">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Back</h4>
            <p className="text-lg font-medium text-center leading-relaxed">
              {currentCard.back}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`flex justify-center gap-4 mt-6 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(false); }}
          className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
        >
          <XCircle size={20} /> Still Learning
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium"
        >
          <CheckCircle size={20} /> Got It
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;
