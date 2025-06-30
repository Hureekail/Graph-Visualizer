import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Функція для обчислення факторіалу числа n (n!)
const factorial = (n) => {
  // Якщо n менше 0, факторіал не визначений, повертаємо 0
  if (n < 0) return 0;
  // Факторіал 0 і 1 дорівнює 1
  if (n <= 1) return 1;
  // Рекурсивний виклик: n! = n * (n-1)!
  return n * factorial(n - 1);
};

// Функція для обчислення біноміального коефіцієнта C(n, k)
const binomialCoefficient = (n, k) => {
  // Якщо k не входить в допустимий діапазон, повертаємо 0
  if (k < 0 || k > n) return 0;
  // Формула: C(n, k) = n! / (k! * (n-k)!)
  return factorial(n) / (factorial(k) * factorial(n - k));
};

// Генеруємо трикутник Паскаля до заданого рядка
const generatePascalTriangle = (rows) => {
  const triangle = [];
  // Для кожного n від 0 до rows
  for (let n = 0; n <= rows; n++) {
    const row = [];
    // Для кожного k від 0 до n
    for (let k = 0; k <= n; k++) {
      // Додаємо об'єкт з n, k та значенням C(n, k)
      row.push({
        n,
        k,
        value: binomialCoefficient(n, k)
      });
    }
    triangle.push(row);
  }
  return triangle;
};

const BinomialCalculator = () => {
  const [n, setN] = useState(5);
  const [k, setK] = useState(2);

  // Використовуємо useMemo для оптимізації обчислення коефіцієнта
  const coefficient = useMemo(() => binomialCoefficient(n, k), [n, k]);
  // Генеруємо трикутник Паскаля лише при зміні n
  const pascalTriangle = useMemo(() => generatePascalTriangle(n), [n]);
  
  // Готуємо дані для гістограми (BarChart)
  const chartData = useMemo(() => {
    // Для поточного n будуємо масив з усіма C(n, k)
    return pascalTriangle[n].map(({ k, value }) => ({
      k: `C(${n},${k})`,
      value,
      label: `C(${n},${k}) = ${value}`
    }));
  }, [n, pascalTriangle]);

  // Обробник зміни n
  const handleNChange = (e) => {
    const newN = parseInt(e.target.value);
    // Перевіряємо, що n не від'ємне
    if (!isNaN(newN) && newN >= 0) {
      setN(newN);
      // Якщо k стало більше нового n, зменшуємо k
      if (k > newN) setK(newN);
    }
  };

  // Обробник зміни k
  const handleKChange = (e) => {
    const newK = parseInt(e.target.value);
    // Перевіряємо, що k в допустимих межах
    if (!isNaN(newK) && newK >= 0 && newK <= n) {
      setK(newK);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans text-[#b3d9ff]">
      <h2 className="text-3xl font-bold mb-6 text-center">Binomial Coefficient Calculator</h2>
      <div className="calculator-inputs flex flex-wrap gap-6 justify-center mb-8">
        <div className="input-group flex items-center gap-2">
          <label className="text-lg font-medium">n = </label>
          <input
            type="number"
            value={n}
            onChange={handleNChange}
            min="0"
            className="w-20 p-2 text-base border border-[#b3d9ff] rounded bg-transparent text-[#b3d9ff] focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="input-group flex items-center gap-2">
          <label className="text-lg font-medium">k = </label>
          <input
            type="number"
            value={k}
            onChange={handleKChange}
            min="0"
            max={n}
            className="w-20 p-2 text-base border border-[#b3d9ff] rounded bg-transparent text-[#b3d9ff] focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
      <div className="result text-center my-8 p-6 bg-[#1b3440]/60 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-2">Result:</h3>
        <p className="text-3xl font-bold">C({n},{k}) = {coefficient}</p>
      </div>
      <div className="visualization my-10">
        <h3 className="text-xl font-semibold mb-4 text-center">Binomial Coefficients for n = {n}</h3>
        <div className="border border-gray-300 rounded-lg p-6 bg-[#1b3440]/40">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="k" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="value" 
                fill="#b3d9ff" 
                name="Binomial Coefficient"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="pascal-triangle my-10">
        <h3 className="text-xl font-semibold mb-4 text-center">Pascal's Triangle (up to n = {n})</h3>
        <div className="triangle-container flex flex-col items-center gap-2 mt-4">
          {pascalTriangle.map((row, rowIndex) => (
            <div key={rowIndex} className="triangle-row flex gap-2 justify-center">
              {row.map(({ value }, colIndex) => (
                <span 
                  key={colIndex} 
                  className={`triangle-cell w-10 h-10 flex items-center justify-center rounded text-base border border-[#b3d9ff] text-[#b3d9ff] bg-transparent ${rowIndex === n && colIndex === k ? 'highlighted bg-[#b3d9ff] text-[#222b3a]' : ''}`}
                >
                  {value}
                </span>
              )).reduce((prev, curr, idx) => idx === 0 ? [curr] : [...prev, ' ', curr], [])}
            </div>
          ))}
        </div>
      </div>
      <div className="explanation my-10 p-6 bg-[#1b3440]/60 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Explanation</h3>
        <p className="mb-2">
          The binomial coefficient C(n,k) represents the number of ways to choose k items from a set of n items.
          It is calculated using the formula:
        </p>
        <p className="formula font-mono text-lg text-center my-4 p-3 bg-transparent rounded border border-[#b3d9ff]">
          C(n,k) = n! / (k! * (n-k)!)
        </p>
        <p>
          Where n! (n factorial) is the product of all positive integers less than or equal to n.
        </p>
      </div>
    </div>
  );
};

export default BinomialCalculator; 