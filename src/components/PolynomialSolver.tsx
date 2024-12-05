import { useState, useEffect } from 'react';

interface PolynomialSolverProps {
  degree: 2 | 3 | 4 | 5;
}

export const PolynomialSolver = ({ degree }: PolynomialSolverProps) => {
  const [coefficients, setCoefficients] = useState<string[]>([]);
  const [solution, setSolution] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper function to find roots of quadratic equation (ax² + bx + c = 0)
  const solveQuadratic = (a: number, b: number, c: number): string => {
    const discriminant = b * b - 4 * a * c;
    if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return `x₁ = ${x1.toFixed(4)}\nx₂ = ${x2.toFixed(4)}`;
    } else if (discriminant === 0) {
      const x = -b / (2 * a);
      return `x = ${x.toFixed(4)} (double root)`;
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(Math.abs(discriminant)) / (2 * a);
      return `x₁ = ${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i\nx₂ = ${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`;
    }
  };

  // Helper function to find roots of cubic equation (ax³ + bx² + cx + d = 0)
  const solveCubic = (a: number, b: number, c: number, d: number): string => {
    // Convert to depressed cubic t³ + pt + q = 0 (substitute x = t - b/(3a))
    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    
    // Use Cardano's formula
    const D = q * q / 4 + p * p * p / 27;
    
    if (Math.abs(D) < 1e-10) { // D ≈ 0
      if (Math.abs(p) < 1e-10) { // p ≈ 0
        const x = -b / (3 * a);
        return `x = ${x.toFixed(4)} (triple root)`;
      }
      const u = Math.cbrt(-q/2);
      const x1 = 2 * u - b/(3*a);
      const x2 = -u - b/(3*a);
      return `x₁ = ${x1.toFixed(4)}\nx₂ = x₃ = ${x2.toFixed(4)}`;
    } else if (D > 0) {
      // One real root and two complex conjugate roots
      const u = Math.cbrt(-q/2 + Math.sqrt(D));
      const v = Math.cbrt(-q/2 - Math.sqrt(D));
      
      const x1 = u + v - b/(3*a);
      const x2Real = -(u + v)/2 - b/(3*a);
      const x2Imag = Math.sqrt(3)/2 * (u - v);
      
      return `x₁ = ${x1.toFixed(4)}\nx₂ = ${x2Real.toFixed(4)} + ${x2Imag.toFixed(4)}i\nx₃ = ${x2Real.toFixed(4)} - ${x2Imag.toFixed(4)}i`;
    } else {
      // Three real roots
      const phi = Math.acos(-q/(2*Math.sqrt(-Math.pow(p/3, 3))));
      const x1 = 2 * Math.sqrt(-p/3) * Math.cos(phi/3) - b/(3*a);
      const x2 = 2 * Math.sqrt(-p/3) * Math.cos((phi + 2*Math.PI)/3) - b/(3*a);
      const x3 = 2 * Math.sqrt(-p/3) * Math.cos((phi + 4*Math.PI)/3) - b/(3*a);
      
      return `x₁ = ${x1.toFixed(4)}\nx₂ = ${x2.toFixed(4)}\nx₃ = ${x3.toFixed(4)}`;
    }
  };

  // Helper function to find roots using numerical methods for degree 4 and 5
  const solveNumerically = (coeffs: number[]): string => {
    // Normalize coefficients by dividing by leading coefficient
    const normalizedCoeffs = coeffs.map(c => c / coeffs[0]);
    
    const findValue = (x: number): number => {
      return normalizedCoeffs.reduce((sum, coeff, i) => sum + coeff * Math.pow(x, normalizedCoeffs.length - 1 - i), 0);
    };

    const findDerivative = (x: number): number => {
      return normalizedCoeffs.reduce((sum, coeff, i) => {
        if (i === normalizedCoeffs.length - 1) return sum;
        return sum + coeff * (normalizedCoeffs.length - 1 - i) * Math.pow(x, normalizedCoeffs.length - 2 - i);
      }, 0);
    };

    const roots: number[] = [];
    
    // Use Newton's method with different initial guesses
    const initialGuesses = [-10, -5, -2, -1, -0.5, 0, 0.5, 1, 2, 5, 10];
    const tolerance = 1e-10;
    const maxIterations = 100;

    for (const guess of initialGuesses) {
      let x = guess;
      let iterations = 0;
      let converged = false;
      
      while (iterations < maxIterations) {
        const fx = findValue(x);
        const fPrime = findDerivative(x);
        
        if (Math.abs(fPrime) < tolerance) break;
        
        const nextX = x - fx / fPrime;
        if (Math.abs(nextX - x) < tolerance) {
          // Check if this root is already found
          if (!roots.some(r => Math.abs(r - nextX) < tolerance)) {
            roots.push(nextX);
            converged = true;
          }
          break;
        }
        
        x = nextX;
        iterations++;
      }

      if (!converged && iterations === maxIterations) {
        // If no convergence, might be near a complex root
        // We could implement complex root finding here if needed
      }
    }

    // Sort roots by real part
    roots.sort((a, b) => a - b);

    // Format output
    if (roots.length === 0) {
      return "No real roots found. The equation may have only complex roots.";
    }

    return roots
      .map((root, i) => `x${getSubscript(i + 1)} = ${root.toFixed(4)}`)
      .join('\n');
  };

  const getPolynomialDisplay = (degree: number): string => {
    switch (degree) {
      case 2:
        return 'ax² + bx + c = 0';
      case 3:
        return 'ax³ + bx² + cx + d = 0';
      case 4:
        return 'ax⁴ + bx³ + cx² + dx + e = 0';
      case 5:
        return 'ax⁵ + bx⁴ + cx³ + dx² + ex + f = 0';
      default:
        return '';
    }
  };

  const getCoeffLabel = (index: number, degree: number): string => {
    switch (degree) {
      case 2:
        return ['a', 'b', 'c'][index];
      case 3:
        return ['a', 'b', 'c', 'd'][index];
      case 4:
        return ['a', 'b', 'c', 'd', 'e'][index];
      case 5:
        return ['a', 'b', 'c', 'd', 'e', 'f'][index];
      default:
        return '';
    }
  };

  const getCurrentEquation = (coeffs: string[]): string => {
    const terms: string[] = [];
    
    coeffs.forEach((coeff, i) => {
      const value = coeff === '' ? '0' : coeff;
      const power = coeffs.length - 1 - i;
      
      if (power === 0) {
        terms.push(value);
      } else if (power === 1) {
        terms.push(`(${value})x`);
      } else {
        terms.push(`(${value})x${power}`);
      }
    });
    
    return terms.join(' + ') + ' = 0';
  };

  const getSubscript = (num: number): string => {
    const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅'];
    return subscripts[num] || num.toString();
  };

  // Initialize coefficients when degree changes
  useEffect(() => {
    setCoefficients(Array(degree + 1).fill(''));
    setSolution(null);
    setError(null);
  }, [degree]);

  const handleSolve = () => {
    try {
      // Convert coefficients to numbers and validate
      const coeffs = coefficients.map(c => c === '' ? 0 : parseFloat(c));
      
      // Check if leading coefficient is 0
      if (coeffs[0] === 0) {
        setError('Leading coefficient cannot be zero');
        setSolution(null);
        return;
      }

      // Check if all coefficients are valid numbers
      if (coeffs.some(c => isNaN(c))) {
        setError('All coefficients must be valid numbers');
        setSolution(null);
        return;
      }

      let result: string;
      switch (degree) {
        case 2:
          result = solveQuadratic(coeffs[0], coeffs[1], coeffs[2]);
          break;
        case 3:
          result = solveCubic(coeffs[0], coeffs[1], coeffs[2], coeffs[3]);
          break;
        case 4:
        case 5:
          result = solveNumerically(coeffs);
          break;
        default:
          throw new Error('Unsupported polynomial degree');
      }

      setSolution(result);
      setError(null);
    } catch (err) {
      setError('Error solving polynomial. Please check your coefficients.');
      setSolution(null);
    }
  };

  return (
    <div className="flex flex-col h-full p-2 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-2">
          <h2 className="text-base font-semibold mb-1 dark:text-yellow-300">
            {degree === 2 ? 'Quadratic' : 
             degree === 3 ? 'Cubic' : 
             degree === 4 ? 'Quartic' : 'Quintic'} Equation Solver
          </h2>
          <p className="text-xs text-gray-600 dark:text-yellow-200/70">
            Enter coefficients for: {getPolynomialDisplay(degree)}
          </p>
        </div>

        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <div className="grid grid-cols-2 gap-2">
            {coefficients.map((coeff, i) => (
              <div key={i} className="flex items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                <label className="text-sm dark:text-yellow-300 min-w-[20px] mr-2">
                  {getCoeffLabel(i, degree)}:
                </label>
                <input
                  type="number"
                  value={coeff}
                  onChange={(e) => {
                    const newCoeffs = [...coefficients];
                    newCoeffs[i] = e.target.value;
                    setCoefficients(newCoeffs);
                  }}
                  className="w-full p-1.5 rounded-lg bg-white dark:bg-gray-900 dark:text-yellow-300 dark:border-yellow-400/30 border text-center text-sm"
                  placeholder="0"
                />
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
            <p className="text-xs font-medium mb-1 dark:text-yellow-300">Current Equation:</p>
            <p className="text-xs dark:text-yellow-200/70 break-words">
              {getCurrentEquation(coefficients)}
            </p>
          </div>

          <button
            onClick={handleSolve}
            className="w-full p-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black rounded-lg font-semibold transition-all duration-300 dark:shadow-neon-yellow-lg text-sm"
          >
            Solve Polynomial
          </button>

          {error && (
            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-xs">
              {error}
            </div>
          )}

          {solution && (
            <div className="flex-1 p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-mono whitespace-pre-wrap">
              {solution}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
