import React, { useState } from 'react';
import { NotebookContent } from '../types';
import { Book, Microscope, BrainCircuit, Lightbulb, ChevronDown, Check, Info } from 'lucide-react';
import FlashcardDeck from './FlashcardDeck';
import { explainTerm } from '../services/geminiService';

interface Props {
  content: NotebookContent;
  unitTitle: string;
}

const NotebookPage: React.FC<Props> = ({ content, unitTitle }) => {
  const [activeTab, setActiveTab] = useState<'narrative' | 'checkpoints' | 'flashcards' | 'lab'>('narrative');
  const [revealedAnswers, setRevealedAnswers] = useState<number[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<{term: string, definition: string} | null>(null);
  const [loadingTerm, setLoadingTerm] = useState(false);

  const toggleAnswer = (id: number) => {
    setRevealedAnswers(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleTermClick = async (term: string) => {
    setLoadingTerm(true);
    setSelectedTerm({ term, definition: 'Loading definition...' });
    try {
      const def = await explainTerm(term, content.sectionA.narrativeMarkdown.substring(0, 200));
      setSelectedTerm({ term, definition: def });
    } catch {
      setSelectedTerm(null);
    } finally {
      setLoadingTerm(false);
    }
  };

  // Helper to highlight terms in markdown text
  const renderMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const term = part.slice(2, -2);
        return (
          <span 
            key={index} 
            onClick={() => handleTermClick(term)}
            className="font-bold text-notebook-blue cursor-pointer hover:bg-blue-100 hover:underline px-0.5 rounded transition-colors relative group"
            title="Click for AI definition"
          >
            {term}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-paper relative">
      {/* Header */}
      <header className="px-10 py-8 border-b border-paper-line bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">{unitTitle}</h2>
            <h1 className="text-4xl font-serif font-bold text-gray-800">{content.topicTitle}</h1>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'narrative', icon: Book, label: 'Notes' },
              { id: 'checkpoints', icon: BrainCircuit, label: 'Checkpoints' },
              { id: 'flashcards', icon: Lightbulb, label: 'Review' },
              { id: 'lab', icon: Microscope, label: 'Lab' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl transition-all border-2 ${
                  activeTab === tab.id
                    ? 'bg-notebook-blue text-white border-notebook-blue shadow-lg scale-105'
                    : 'bg-white text-gray-400 border-transparent hover:bg-blue-50 hover:text-notebook-blue'
                }`}
              >
                <tab.icon size={24} className="mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-10 max-w-5xl mx-auto w-full pb-32">
        
        {/* TAB: NARRATIVE */}
        {activeTab === 'narrative' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hook */}
            <div className="bg-amber-50 p-6 rounded-l-xl border-l-4 border-amber-400 italic font-serif text-lg text-amber-900 shadow-sm">
              "{content.sectionA.hook}"
            </div>

            {/* Key Concept */}
            <div className="text-center py-8 px-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-notebook-blue uppercase tracking-widest mb-3">Core Principle</h3>
              <p className="text-2xl font-serif font-bold text-gray-800 leading-snug">
                {content.sectionA.keyConcept}
              </p>
            </div>

            {/* Main Text */}
            <div className="prose prose-lg prose-slate max-w-none">
              <div className="whitespace-pre-line leading-loose text-gray-700 font-sans">
                {renderMarkdown(content.sectionA.narrativeMarkdown)}
              </div>
            </div>

            {/* Connections & Relevance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h4 className="flex items-center gap-2 font-bold text-blue-800 mb-4">
                  <AtomIcon className="w-5 h-5" /> Real World Relevance
                </h4>
                <p className="text-blue-900 leading-relaxed text-sm">
                  {content.sectionA.realWorldRelevance}
                </p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                <h4 className="flex items-center gap-2 font-bold text-emerald-800 mb-4">
                  <NetworkIcon className="w-5 h-5" /> Cross-Unit Links
                </h4>
                <ul className="space-y-2">
                  {content.sectionA.crossUnitConnections.map((conn, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-emerald-900">
                      <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      {conn}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CHECKPOINTS */}
        {activeTab === 'checkpoints' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
             <div className="mb-8">
               <h3 className="text-2xl font-bold text-gray-800 mb-2">Progressive Mastery</h3>
               <p className="text-gray-500">Test your understanding from basic recall to critical analysis.</p>
             </div>

             {content.sectionB.checkpoints.map((cp, idx) => (
               <div key={cp.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                 <div className="p-6">
                   <div className="flex justify-between items-center mb-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                       ${cp.type === 'Recall' ? 'bg-blue-100 text-blue-700' : 
                         cp.type === 'Application' ? 'bg-green-100 text-green-700' :
                         cp.type === 'Analysis' ? 'bg-amber-100 text-amber-700' :
                         'bg-purple-100 text-purple-700'
                       }
                     `}>
                       Level {idx + 1}: {cp.type}
                     </span>
                   </div>
                   <h4 className="text-lg font-medium text-gray-800 mb-4">{cp.question}</h4>
                   
                   <button
                     onClick={() => toggleAnswer(cp.id)}
                     className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-notebook-blue transition-colors"
                   >
                     {revealedAnswers.includes(cp.id) ? 'Hide Answer' : 'Reveal Answer'}
                     <ChevronDown className={`w-4 h-4 transition-transform ${revealedAnswers.includes(cp.id) ? 'rotate-180' : ''}`} />
                   </button>
                 </div>
                 
                 {revealedAnswers.includes(cp.id) && (
                   <div className="bg-slate-50 p-6 border-t border-gray-100 animate-in slide-in-from-top-2">
                     <div className="mb-4">
                       <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Answer</span>
                       <p className="text-gray-800">{cp.answer}</p>
                     </div>
                     <div>
                       <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Explanation</span>
                       <p className="text-gray-600 text-sm italic">{cp.explanation}</p>
                     </div>
                   </div>
                 )}
               </div>
             ))}
          </div>
        )}

        {/* TAB: FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-10">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Spaced Repetition System</h3>
              <p className="text-gray-500">Review core concepts and terminology.</p>
            </div>
            <FlashcardDeck cards={content.sectionC.flashcards} />
          </div>
        )}

        {/* TAB: LAB */}
        {activeTab === 'lab' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-slate-800 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Microscope className="w-6 h-6 text-notebook-blue" />
                  <h3 className="text-xl font-bold">Virtual Lab Integration</h3>
                </div>
                <p className="text-slate-400 text-sm">Experimental Design & Analysis</p>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">1</span>
                    Research Question
                  </h4>
                  <p className="text-lg text-gray-700 italic border-l-2 border-notebook-blue pl-4">
                    {content.sectionD.researchQuestion}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">2</span>
                     Methodology
                  </h4>
                  <p className="text-gray-600 bg-slate-50 p-4 rounded-lg text-sm leading-relaxed">
                    {content.sectionD.methodOverview}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-dashed border-gray-300 rounded-lg p-6">
                    <h5 className="text-sm font-bold text-gray-500 uppercase mb-2">Hypothesis</h5>
                    <p className="text-gray-800 font-medium">{content.sectionD.hypothesisPrompt}</p>
                    <textarea 
                      placeholder="Write your prediction here..." 
                      className="w-full mt-3 p-2 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-notebook-blue outline-none"
                      rows={3}
                    />
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-lg p-6">
                    <h5 className="text-sm font-bold text-gray-500 uppercase mb-2">Analysis</h5>
                    <p className="text-gray-800 font-medium">{content.sectionD.dataInterpretationQuestion}</p>
                    <textarea 
                      placeholder="Interpret the potential data..." 
                      className="w-full mt-3 p-2 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-notebook-blue outline-none"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="bg-notebook-blue/10 p-6 rounded-lg">
                  <h4 className="font-bold text-notebook-blue mb-2">Conclusion Framework</h4>
                  <p className="text-sm text-gray-700">{content.sectionD.conclusionFramework}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Definition Popup */}
      {selectedTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4" onClick={() => setSelectedTerm(null)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 capitalize">{selectedTerm.term}</h3>
              <button onClick={() => setSelectedTerm(null)} className="text-gray-400 hover:text-gray-600">
                <Check className="w-5 h-5" />
              </button>
            </div>
            <div className="prose prose-sm">
              <p className="text-gray-700 leading-relaxed">
                {selectedTerm.definition}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <BrainCircuit size={12} /> AI Generated Explanation
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AtomIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/></svg>
);

const NetworkIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
);

export default NotebookPage;
