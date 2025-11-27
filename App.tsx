import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import NotebookPage from './components/NotebookPage';
import { Unit, Topic, NotebookContent, AppState } from './types';
import { generateTopicContent } from './services/geminiService';
import { Loader2, Dna } from 'lucide-react';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.SELECTING);
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [content, setContent] = useState<NotebookContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectTopic = async (unit: Unit, topic: Topic) => {
    // Prevent re-fetching same topic
    if (currentTopic?.id === topic.id && content) return;

    setCurrentUnit(unit);
    setCurrentTopic(topic);
    setAppState(AppState.LOADING);
    setError(null);

    try {
      const generatedContent = await generateTopicContent(unit.title, topic.title);
      setContent(generatedContent);
      setAppState(AppState.VIEWING);
    } catch (e) {
      console.error(e);
      setError("Failed to generate content. Please check your API key or try again.");
      setAppState(AppState.ERROR);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden font-sans">
      <Sidebar 
        onSelectTopic={handleSelectTopic} 
        selectedTopicId={currentTopic?.id} 
      />
      
      <main className="flex-1 h-full bg-gray-50 relative overflow-hidden flex flex-col">
        {appState === AppState.SELECTING && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6 text-slate-400">
              <Dna size={48} />
            </div>
            <h2 className="text-2xl font-serif text-slate-700 mb-2">Welcome to BioLens</h2>
            <p className="max-w-md">Select a topic from the curriculum map on the left to generate your interactive biology notebook.</p>
          </div>
        )}

        {appState === AppState.LOADING && (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-12 h-12 text-notebook-blue animate-spin mb-4" />
            <p className="text-slate-600 font-medium animate-pulse">Designing Curriculum Content...</p>
            <p className="text-slate-400 text-sm mt-2">Consulting the AI Biology Specialist</p>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center h-full text-red-500">
            <div className="bg-red-50 p-6 rounded-xl border border-red-100 max-w-md text-center">
              <h3 className="font-bold mb-2">Generation Error</h3>
              <p>{error}</p>
              <button 
                onClick={() => handleSelectTopic(currentUnit!, currentTopic!)}
                className="mt-4 px-4 py-2 bg-white border border-red-200 rounded text-red-600 hover:bg-red-50 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {appState === AppState.VIEWING && content && currentUnit && (
          <NotebookPage content={content} unitTitle={currentUnit.title} />
        )}
      </main>
    </div>
  );
}

export default App;
