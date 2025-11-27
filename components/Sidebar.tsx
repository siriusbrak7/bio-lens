import React from 'react';
import { BIOLOGY_CURRICULUM } from '../constants';
import { Unit, Topic } from '../types';
import { ChevronRight, ChevronDown, BookOpen, Atom } from 'lucide-react';

interface Props {
  onSelectTopic: (unit: Unit, topic: Topic) => void;
  selectedTopicId?: string;
}

const Sidebar: React.FC<Props> = ({ onSelectTopic, selectedTopicId }) => {
  const [expandedUnit, setExpandedUnit] = React.useState<string | null>(BIOLOGY_CURRICULUM[0].id);

  const toggleUnit = (unitId: string) => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };

  return (
    <div className="h-full bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 w-80 flex-shrink-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-notebook-blue rounded-lg text-white">
          <Atom size={24} />
        </div>
        <div>
          <h1 className="text-white font-bold text-xl tracking-tight">BioLens</h1>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Curriculum Map</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {BIOLOGY_CURRICULUM.map((unit) => (
          <div key={unit.id} className="mb-2">
            <button
              onClick={() => toggleUnit(unit.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                expandedUnit === unit.id ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider flex-1 truncate pr-2">{unit.title}</span>
              {expandedUnit === unit.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {expandedUnit === unit.id && (
              <div className="ml-2 mt-1 pl-2 border-l border-slate-700 space-y-1">
                {unit.topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => onSelectTopic(unit, topic)}
                    className={`w-full text-left p-2 rounded text-sm flex items-center gap-2 transition-all ${
                      selectedTopicId === topic.id 
                        ? 'bg-notebook-blue/20 text-notebook-blue border-r-2 border-notebook-blue' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <BookOpen size={14} className={selectedTopicId === topic.id ? 'opacity-100' : 'opacity-40'} />
                    <span className="truncate">{topic.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        v1.0.0 • AI-Powered Biology
      </div>
    </div>
  );
};

export default Sidebar;
