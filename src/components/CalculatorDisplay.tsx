interface CalculatorDisplayProps {
  expression: string;
  result: string;
}

export const CalculatorDisplay = ({ expression, result }: CalculatorDisplayProps) => {
  return (
    <div className="w-full p-3 sm:p-6 mb-2 bg-gray-100 dark:bg-gray-900/50 rounded-2xl dark:shadow-neon-yellow-lg transition-all duration-300 border dark:border-yellow-400/30">
      <div className="flex flex-col h-24 justify-between">
        <div className="text-xl sm:text-3xl font-mono tracking-wider text-gray-800/70 dark:text-yellow-300/70 truncate calculator-display">
          {expression}
        </div>
        {result && (
          <div className="text-3xl sm:text-4xl font-mono tracking-wider text-gray-800 dark:text-yellow-300 truncate text-right font-bold calculator-display">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};