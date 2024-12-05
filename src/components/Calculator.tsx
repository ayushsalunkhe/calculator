import { useState, useEffect } from 'react';
import { Moon, Sun, History, Calculator as CalcIcon, Undo2 } from 'lucide-react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { CalculatorKeypad } from './CalculatorKeypad';
import { CalculatorHistory } from './CalculatorHistory';
import { EquationSolver } from './EquationSolver';
import { PolynomialSolver } from './PolynomialSolver';
import { calculate } from '../utils/calculate';

type CalculatorMode = 'standard' | 'equations-2var' | 'equations-3var' | 'equations-4var' | 'polynomial-2' | 'polynomial-3' | 'polynomial-4' | 'polynomial-5';

interface CalculatorState {
  display: string;
  result: string;
  history: { expression: string; result: string }[];
  showHistory: boolean;
  isDark: boolean;
  mode: CalculatorMode;
  showModeMenu: boolean;
}

export const Calculator = () => {
  const [state, setState] = useState<CalculatorState>({
    display: '',
    result: '',
    history: [],
    showHistory: false,
    isDark: false,
    mode: 'standard',
    showModeMenu: false,
  });

  const { display, result, history, showHistory, isDark, mode, showModeMenu } = state;

  const updateState = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    const saved = localStorage.getItem('calculator-theme');
    updateState({ isDark: saved ? JSON.parse(saved) : false });
  }, []);

  useEffect(() => {
    localStorage.setItem('calculator-theme', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (display !== 'Error' && display !== '0') {
      const calculatedResult = calculate(display);
      if (calculatedResult !== 'Error') {
        updateState({ result: calculatedResult });
      } else {
        updateState({ result: '' });
      }
    } else {
      updateState({ result: '' });
    }
  }, [display]);

  const handleKeyPress = (key: string) => {
    if (key === 'C') {
      updateState({ display: '', result: '' });
    } else if (key === '=') {
      try {
        const calculatedResult = calculate(display);
        updateState({
          result: calculatedResult,
          history: [...history, { expression: display, result: calculatedResult }],
        });
      } catch (error) {
        updateState({ result: 'Error' });
      }
    } else {
      updateState({ display: display + key });
    }
  };

  const clearHistory = () => {
    updateState({ history: [] });
  };

  const selectFromHistory = (expression: string) => {
    updateState({ display: expression });
  };

  const toggleMode = () => {
    updateState({ showModeMenu: true });
  };

  const handleModeSelect = (selectedMode: CalculatorMode) => {
    updateState({ mode: selectedMode, showModeMenu: false, display: '', result: '' });
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastHistory = history[history.length - 1];
      updateState({ display: lastHistory.expression, result: lastHistory.result });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black transition-colors duration-200">
      <div className="w-full h-full max-w-md mx-auto flex flex-col p-2 sm:p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg sm:rounded-3xl shadow-2xl dark:shadow-calculator-dark transition-all duration-300">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            <button
              onClick={() => updateState({ isDark: !isDark })}
              className="p-1.5 sm:p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 dark:shadow-neon-yellow-sm hover:scale-105 transition-all duration-300"
            >
              {isDark ? 
                <Sun className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-300" /> : 
                <Moon className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
              }
            </button>
            <button
              onClick={toggleMode}
              className="p-1.5 sm:p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 dark:shadow-neon-yellow-sm hover:scale-105 transition-all duration-300 flex items-center gap-1"
            >
              <CalcIcon className={`w-4 h-4 sm:w-6 sm:h-6 ${isDark ? 'text-yellow-300' : 'text-gray-600'}`} />
              <span className={`text-xs ${isDark ? 'text-yellow-300' : 'text-gray-600'}`}>
                {mode === 'standard' ? 'STD' : 
                 mode === 'equations-2var' ? '2VAR' : 
                 mode === 'equations-3var' ? '3VAR' : 
                 mode === 'equations-4var' ? '4VAR' :
                 mode === 'polynomial-2' ? 'POLY2' :
                 mode === 'polynomial-3' ? 'POLY3' :
                 mode === 'polynomial-4' ? 'POLY4' : 'POLY5'}
              </span>
            </button>
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className={`p-1.5 sm:p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 dark:shadow-neon-yellow-sm hover:scale-105 transition-all duration-300 ${
                history.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Undo2 className={`w-4 h-4 sm:w-6 sm:h-6 ${isDark ? 'text-yellow-300' : 'text-gray-600'}`} />
            </button>
          </div>
          <button
            onClick={() => updateState({ showHistory: !showHistory })}
            className="p-1.5 sm:p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 dark:shadow-neon-yellow-sm hover:scale-105 transition-all duration-300"
          >
            <History className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600 dark:text-yellow-300" />
          </button>
        </div>
        
        {showModeMenu && (
          <div className="absolute top-16 left-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-neon-yellow-lg p-2 border dark:border-yellow-400/30">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleModeSelect('standard')}
                className="p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-yellow-300"
              >
                Standard Calculator
              </button>
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
              <button
                onClick={() => handleModeSelect('equations-2var')}
                className="p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-yellow-300"
              >
                2-Variable System
              </button>
              <button
                onClick={() => handleModeSelect('equations-3var')}
                className="p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-yellow-300"
              >
                3-Variable System
              </button>
              <button
                onClick={() => handleModeSelect('equations-4var')}
                className="p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-yellow-300"
              >
                4-Variable System
              </button>
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
              <button
                onClick={() => handleModeSelect('polynomial-2')}
                className="p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-yellow-300"
              >
                Quadratic Equation
              </button>
              <button
                onClick={() => handleModeSelect('polynomial-3')}
                className="p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-yellow-300"
              >
                Cubic Equation
              </button>
              <button
                onClick={() => handleModeSelect('polynomial-4')}
                className="p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-yellow-300"
              >
                Quartic Equation
              </button>
              <button
                onClick={() => handleModeSelect('polynomial-5')}
                className="p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-yellow-300"
              >
                Quintic Equation
              </button>
            </div>
          </div>
        )}
        
        <div className="flex-grow flex flex-col min-h-0">
          {mode === 'standard' ? (
            <>
              <div className="flex-none">
                <CalculatorDisplay expression={display} result={result} />
              </div>
              {showHistory && (
                <CalculatorHistory 
                  history={history} 
                  onClear={clearHistory}
                  onSelect={selectFromHistory}
                />
              )}
              <div className="flex-grow flex items-end">
                <CalculatorKeypad onKeyPress={handleKeyPress} />
              </div>
            </>
          ) : mode.startsWith('equations-') ? (
            <EquationSolver mode={mode as 'equations-2var' | 'equations-3var' | 'equations-4var'} />
          ) : (
            <PolynomialSolver degree={parseInt(mode.split('-')[1]) as 2 | 3 | 4 | 5} />
          )}
        </div>
      </div>
    </div>
  );
};