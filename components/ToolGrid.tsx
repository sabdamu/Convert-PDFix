
import React from 'react';
import { TOOLS } from '../constants';
import { ArrowRight } from 'lucide-react';

interface ToolGridProps {
  onSelectTool: (id: string) => void;
}

const ToolGrid: React.FC<ToolGridProps> = ({ onSelectTool }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onSelectTool(tool.id)}
          className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-indigo-100 text-left flex flex-col h-full"
        >
          <div className={`p-4 rounded-xl inline-block mb-4 transition-transform group-hover:scale-110 duration-300 bg-gray-50`}>
             {tool.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            {tool.name}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
            {tool.description}
          </p>
          <div className="flex items-center text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>GET STARTED</span>
            <ArrowRight className="w-3 h-3 ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default ToolGrid;
