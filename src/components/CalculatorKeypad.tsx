interface CalculatorKeypadProps {
  onKeyPress: (key: string) => void;
}

export const CalculatorKeypad = ({ onKeyPress }: CalculatorKeypadProps) => {
  const keys = [
    ['sin(', 'cos(', 'tan(', 'C', '←'],
    ['π', 'e', '^', '√(', '/'],
    ['log(', '7', '8', '9', '*'],
    ['ln(', '4', '5', '6', '-'],
    ['(', '1', '2', '3', '+'],
    [')', '0', '.', '='],
    ['MC', 'MR', 'M+', 'M-']
  ];

  const getButtonClasses = (key: string) => {
    let classes = 'py-3 sm:p-4 text-center rounded-xl transition-all duration-300 transform active:scale-95 hover:scale-105 text-sm sm:text-base ';
    
    classes += 'dark:border dark:border-yellow-400/20 dark:shadow-neon-yellow-sm dark:hover:shadow-neon-yellow-lg dark:hover:border-yellow-400/40 ';
    
    if (/[0-9]/.test(key)) {
      classes += 'dark:bg-gray-800/80 dark:text-yellow-300 dark:hover:text-yellow-200 font-semibold ';
    }
    
    if (key === '=') {
      classes += 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black col-span-2 font-bold dark:shadow-neon-yellow-lg';
    } else if (['sin(', 'cos(', 'tan(', 'log(', 'ln('].includes(key)) {
      classes += 'bg-gray-200 dark:bg-gray-800/80 hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-yellow-200';
    } else if (['MC', 'MR', 'M+', 'M-'].includes(key)) {
      classes += 'bg-gray-300 dark:bg-gray-700/80 hover:bg-gray-400 dark:hover:bg-gray-600 dark:text-yellow-200 font-medium';
    } else if (['+', '-', '*', '/', '^'].includes(key)) {
      classes += 'bg-gray-200 dark:bg-gray-700/80 hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-yellow-300 font-bold';
    } else {
      classes += 'bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-yellow-200';
    }

    return classes;
  };

  return (
    <div className="w-full grid grid-cols-5 gap-1.5 sm:gap-3 p-1 sm:p-2">
      {keys.map((row, i) => (
        <div key={i} className="contents">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={getButtonClasses(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};