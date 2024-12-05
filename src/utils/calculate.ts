import { evaluate } from 'mathjs';

export const calculate = (expression: string): string => {
  try {
    // Replace all instances of π with Math.PI
    expression = expression.replace(/π/g, 'pi');
    
    // Evaluate the expression using mathjs
    const result = evaluate(expression);
    
    // Convert the result to a string with a maximum of 8 decimal places
    return typeof result === 'number' 
      ? Number(result.toFixed(8)).toString()
      : result.toString();
  } catch (error) {
    return 'Error';
  }
};
