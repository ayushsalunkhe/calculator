import { useState } from 'react';

interface Equation2Var {
  a: string;
  b: string;
  c: string;
}

interface Equation3Var {
  a: string;
  b: string;
  c: string;
  d: string;
}

interface Equation4Var {
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
}

interface EquationSolverProps {
  mode: 'equations-2var' | 'equations-3var' | 'equations-4var';
}

export const EquationSolver = ({ mode }: EquationSolverProps) => {
  // State for 2-variable system
  const [equation1, setEquation1] = useState<Equation2Var>({ a: '', b: '', c: '' });
  const [equation2, setEquation2] = useState<Equation2Var>({ a: '', b: '', c: '' });
  
  // State for 3-variable system
  const [eq3v1, setEq3v1] = useState<Equation3Var>({ a: '', b: '', c: '', d: '' });
  const [eq3v2, setEq3v2] = useState<Equation3Var>({ a: '', b: '', c: '', d: '' });
  const [eq3v3, setEq3v3] = useState<Equation3Var>({ a: '', b: '', c: '', d: '' });
  
  // State for 4-variable system
  const [eq4v1, setEq4v1] = useState<Equation4Var>({ a: '', b: '', c: '', d: '', e: '' });
  const [eq4v2, setEq4v2] = useState<Equation4Var>({ a: '', b: '', c: '', d: '', e: '' });
  const [eq4v3, setEq4v3] = useState<Equation4Var>({ a: '', b: '', c: '', d: '', e: '' });
  const [eq4v4, setEq4v4] = useState<Equation4Var>({ a: '', b: '', c: '', d: '', e: '' });
  
  const [solution, setSolution] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const solve2VarSystem = () => {
    try {
      const a1 = parseFloat(equation1.a);
      const b1 = parseFloat(equation1.b);
      const c1 = parseFloat(equation1.c);
      const a2 = parseFloat(equation2.a);
      const b2 = parseFloat(equation2.b);
      const c2 = parseFloat(equation2.c);

      const determinant = a1 * b2 - a2 * b1;
      
      if (determinant === 0) {
        setError('The system has no unique solution (determinant is zero)');
        setSolution(null);
        return;
      }

      const x = (c1 * b2 - c2 * b1) / determinant;
      const y = (a1 * c2 - a2 * c1) / determinant;

      setSolution(`x = ${x.toFixed(4)}\ny = ${y.toFixed(4)}`);
      setError(null);
    } catch (err) {
      setError('Invalid input. Please check your equations.');
      setSolution(null);
    }
  };

  const solve3VarSystem = () => {
    try {
      const matrix = [
        [parseFloat(eq3v1.a), parseFloat(eq3v1.b), parseFloat(eq3v1.c)],
        [parseFloat(eq3v2.a), parseFloat(eq3v2.b), parseFloat(eq3v2.c)],
        [parseFloat(eq3v3.a), parseFloat(eq3v3.b), parseFloat(eq3v3.c)]
      ];
      
      const constants = [
        parseFloat(eq3v1.d),
        parseFloat(eq3v2.d),
        parseFloat(eq3v3.d)
      ];

      // Calculate determinant
      const det = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1])
                - matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0])
                + matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);

      if (Math.abs(det) < 1e-10) {
        setError('The system has no unique solution (determinant is zero)');
        setSolution(null);
        return;
      }

      // Cramer's rule
      const detX = constants[0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1])
                 - matrix[0][1] * (constants[1] * matrix[2][2] - matrix[1][2] * constants[2])
                 + matrix[0][2] * (constants[1] * matrix[2][1] - matrix[1][1] * constants[2]);

      const detY = matrix[0][0] * (constants[1] * matrix[2][2] - matrix[1][2] * constants[2])
                 - constants[0] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0])
                 + matrix[0][2] * (matrix[1][0] * constants[2] - constants[1] * matrix[2][0]);

      const detZ = matrix[0][0] * (matrix[1][1] * constants[2] - constants[1] * matrix[2][1])
                 - matrix[0][1] * (matrix[1][0] * constants[2] - constants[1] * matrix[2][0])
                 + constants[0] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);

      const x = detX / det;
      const y = detY / det;
      const z = detZ / det;

      setSolution(`x = ${x.toFixed(4)}\ny = ${y.toFixed(4)}\nz = ${z.toFixed(4)}`);
      setError(null);
    } catch (err) {
      setError('Invalid input. Please check your equations.');
      setSolution(null);
    }
  };

  const solve4VarSystem = () => {
    // Implementation of 4-variable system solver using similar matrix operations
    setError('4-variable system solver is not implemented yet');
    setSolution(null);
  };

  const handleSolve = () => {
    switch (mode) {
      case 'equations-2var':
        solve2VarSystem();
        break;
      case 'equations-3var':
        solve3VarSystem();
        break;
      case 'equations-4var':
        solve4VarSystem();
        break;
    }
  };

  const renderEquationInput = (
    equation: any,
    setEquation: (eq: any) => void,
    index: number,
    variables: string[]
  ) => {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-2">
        <span className="text-sm dark:text-yellow-300 min-w-[4rem]">Eq {index}:</span>
        <div className="flex flex-wrap items-center gap-1">
          {variables.map((variable, idx) => (
            <div key={`${index}-${variable}`} className="flex items-center">
              <input
                type="number"
                value={equation[String.fromCharCode(97 + idx)]}
                onChange={(e) => 
                  setEquation({ ...equation, [String.fromCharCode(97 + idx)]: e.target.value })
                }
                className="w-12 sm:w-14 p-1 sm:p-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-yellow-300 dark:border-yellow-400/30 border text-center text-sm"
                placeholder="0"
              />
              {idx < variables.length - 1 ? (
                <span className="dark:text-yellow-300 mx-0.5">{variable} +</span>
              ) : (
                <span className="dark:text-yellow-300 mx-0.5">{variable} =</span>
              )}
            </div>
          ))}
          <input
            type="number"
            value={equation[String.fromCharCode(97 + variables.length)]}
            onChange={(e) =>
              setEquation({ ...equation, [String.fromCharCode(97 + variables.length)]: e.target.value })
            }
            className="w-12 sm:w-14 p-1 sm:p-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-yellow-300 dark:border-yellow-400/30 border text-center text-sm"
            placeholder="0"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col p-2 sm:p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
      <div className="mb-4">
        <h2 className="text-base sm:text-lg font-semibold mb-3 dark:text-yellow-300">
          {mode === 'equations-2var' 
            ? '2-Variable System' 
            : mode === 'equations-3var'
            ? '3-Variable System'
            : '4-Variable System'}
        </h2>
        
        <div className="space-y-2">
          {mode === 'equations-2var' && (
            <>
              {renderEquationInput(equation1, setEquation1, 1, ['x', 'y'])}
              {renderEquationInput(equation2, setEquation2, 2, ['x', 'y'])}
            </>
          )}

          {mode === 'equations-3var' && (
            <>
              {renderEquationInput(eq3v1, setEq3v1, 1, ['x', 'y', 'z'])}
              {renderEquationInput(eq3v2, setEq3v2, 2, ['x', 'y', 'z'])}
              {renderEquationInput(eq3v3, setEq3v3, 3, ['x', 'y', 'z'])}
            </>
          )}

          {mode === 'equations-4var' && (
            <>
              {renderEquationInput(eq4v1, setEq4v1, 1, ['w', 'x', 'y', 'z'])}
              {renderEquationInput(eq4v2, setEq4v2, 2, ['w', 'x', 'y', 'z'])}
              {renderEquationInput(eq4v3, setEq4v3, 3, ['w', 'x', 'y', 'z'])}
              {renderEquationInput(eq4v4, setEq4v4, 4, ['w', 'x', 'y', 'z'])}
            </>
          )}
        </div>

        <button
          onClick={handleSolve}
          className="w-full p-2 sm:p-3 mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black rounded-xl font-semibold transition-all duration-300 dark:shadow-neon-yellow-lg text-sm sm:text-base"
        >
          Solve System
        </button>

        {error && (
          <div className="mt-3 p-2 sm:p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {solution && (
          <div className="mt-3 p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg whitespace-pre-wrap font-mono text-sm">
            {solution}
          </div>
        )}
      </div>
    </div>
  );
};