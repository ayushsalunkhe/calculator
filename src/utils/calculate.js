"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculate = void 0;
const mathjs_1 = require("mathjs");
const calculate = (expression) => {
    try {
        // Replace all instances of π with Math.PI
        expression = expression.replace(/π/g, 'pi');
        // Evaluate the expression using mathjs
        const result = (0, mathjs_1.evaluate)(expression);
        // Convert the result to a string with a maximum of 8 decimal places
        return typeof result === 'number'
            ? Number(result.toFixed(8)).toString()
            : result.toString();
    }
    catch (error) {
        return 'Error';
    }
};
exports.calculate = calculate;
