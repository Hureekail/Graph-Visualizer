import React from 'react';
import BinomialCalculator from './components/BinomialCalculator';
import CombinatorialAnalyzer from './components/CombinatorialAnalyzer';
import SideBar from './components/SideBar';
import PathfindingVisualizer from './components/PathfindingVisualizer';
import './styles/App.css';
import './styles/SideBar.css'

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="layout">
        <SideBar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<BinomialCalculator />} />
            <Route path="/CombinatorialAnalyzer" element={<CombinatorialAnalyzer />} />
            <Route path="/pathfinding" element={<PathfindingVisualizer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;