import { useRef, useEffect } from 'react';
import { ClockIcon, TrashIcon } from 'lucide-react';

interface CalculatorHistoryProps {
  history: { expression: string; result: string }[];
  onClear?: () => void;
  onSelect?: (expression: string) => void;
}

export const CalculatorHistory = ({ history, onClear, onSelect }: CalculatorHistoryProps) => {
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="flex-none h-24 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-sm bg-gray-50/50 dark:bg-gray-900/50 rounded-lg m-2">
        <ClockIcon className="w-5 h-5 mb-1 opacity-50" />
        <p>No calculation history</p>
      </div>
    );
  }

  return (
    <div className="relative flex-none">
      <div className="absolute top-0 right-2 z-10">
        <button
          onClick={onClear}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          title="Clear History"
        >
          <TrashIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      <div className="h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 m-2 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg">
        <div className="p-2 space-y-1">
          {history.map(({ expression, result }, index) => (
            <button
              key={index}
              onClick={() => onSelect?.(expression)}
              className="w-full text-left p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200 group"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 truncate">
                  {expression}
                </span>
                <span className="text-gray-900 dark:text-yellow-300 font-medium ml-2">
                  = {result}
                </span>
              </div>
            </button>
          ))}
          <div ref={historyEndRef} />
        </div>
      </div>
    </div>
  );
};