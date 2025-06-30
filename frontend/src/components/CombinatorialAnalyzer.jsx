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
import '../styles/CombinatorialAnalyzer.css';

// Функція для обчислення факторіалу n (n!)
const factorial = (n) => {
  // Якщо n < 0, факторіал не визначений, повертаємо 0
  if (n < 0) return 0;
  // Факторіал 0 і 1 дорівнює 1
  if (n <= 1) return 1;
  // Рекурсивний виклик: n! = n * (n-1)!
  return n * factorial(n - 1);
};

// Функція для обчислення кількості перестановок P(n) = n!
const permutations = (n) => factorial(n);

// Функція для обчислення кількості розміщень A(n, k) = n! / (n-k)!
const arrangements = (n, k) => {
  // Якщо k > n, розміщень не існує
  if (k > n) return 0;
  return factorial(n) / factorial(n - k);
};

// Функція для обчислення кількості комбінацій C(n, k) = n! / (k! * (n-k)!)
const combinations = (n, k) => {
  // Якщо k не входить в допустимий діапазон, повертаємо 0
  if (k < 0 || k > n) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
};

const CombinatorialAnalyzer = () => {
  const [n, setN] = useState(5);
  const [k, setK] = useState(2);
  const [analysisType, setAnalysisType] = useState('combinations'); // 'permutations', 'arrangements', 'combinations'

  // Використовуємо useMemo для оптимізації обчислень
  const results = useMemo(() => {
    const data = [];
    // Для кожного i від 0 до n обчислюємо значення відповідної формули
    for (let i = 0; i <= n; i++) {
      let value;
      switch (analysisType) {
        case 'permutations':
          // Перестановки: P(i) = i!
          value = permutations(i);
          break;
        case 'arrangements':
          // Розміщення: A(i, k) = i! / (i-k)!
          value = arrangements(i, k);
          break;
        case 'combinations':
          // Комбінації: C(i, k) = i! / (k! * (i-k)!)
          value = combinations(i, k);
          break;
        default:
          value = 0;
      }
      // Додаємо результат у масив для побудови графіка
      data.push({
        n: i,
        value,
        label: `${analysisType === 'permutations' ? 'P' : analysisType === 'arrangements' ? 'A' : 'C'}(${i}${analysisType !== 'permutations' ? `,${k}` : ''}) = ${value}`
      });
    }
    return data;
  }, [n, k, analysisType]);

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
      <h2 className="text-3xl font-bold mb-6 text-center">Combinatorial Analyzer</h2>
      <div className="flex flex-wrap gap-6 justify-center mb-8">
        <div className="flex items-center gap-2">
          <label className="text-lg font-medium">n = </label>
          <input
            type="number"
            value={n}
            onChange={handleNChange}
            min="0"
            className="w-20 p-2 text-base border border-[#b3d9ff] rounded bg-transparent text-[#b3d9ff] focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
          <label className="text-lg font-medium">Analysis Type: </label>
          <select value={analysisType} onChange={(e) => setAnalysisType(e.target.value)}
            className="p-2 border border-[#b3d9ff] rounded text-base bg-transparent text-[#b3d9ff] focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="permutations">Permutations</option>
            <option value="arrangements">Arrangements</option>
            <option value="combinations">Combinations</option>
          </select>
        </div>
      </div>
      <div className="text-center my-8 p-6 bg-[#1b3440]/60 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-2">Result:</h3>
        <p className="text-3xl font-bold">
          {analysisType === 'permutations' ? (
            `P(${n}) = ${permutations(n)}`
          ) : analysisType === 'arrangements' ? (
            `A(${n},${k}) = ${arrangements(n, k)}`
          ) : (
            `C(${n},${k}) = ${combinations(n, k)}`
          )}
        </p>
      </div>
      <div className="my-10">
        <h3 className="text-xl font-semibold mb-4 text-center">Graph of dependency on n</h3>
        <div className="border border-gray-300 rounded-lg p-6 bg-[#1b3440]/40">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={results} style={{ background: 'transparent' }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="n" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="value" 
                fill="#b3d9ff" 
                name={analysisType === 'permutations' ? 'Permutations' : 
                      analysisType === 'arrangements' ? 'Arrangements' : 
                      'Combinations'}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="my-10 p-6 bg-[#1b3440]/60 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Explanation</h3>
        <p className="mb-2">
          {analysisType === 'permutations' ? (
            'Permutations (P) - the number of ways to arrange n distinct elements in n positions.'
          ) : analysisType === 'arrangements' ? (
            'Arrangements (A) - the number of ways to select k elements from n and arrange them in a specific order.'
          ) : (
            'Combinations (C) - the number of ways to select k elements from n without considering the order.'
          )}
        </p>
        <p className="font-mono text-lg text-center my-4 p-3 bg-transparent rounded border border-[#b3d9ff] inline-block">
          {analysisType === 'permutations' ? (
            'P(n) = n!'
          ) : analysisType === 'arrangements' ? (
            'A(n,k) = n! / (n-k)!'
          ) : (
            'C(n,k) = n! / (k! * (n-k)!)'
          )}
        </p>
      </div>
    </div>
  );
};

export default CombinatorialAnalyzer; 