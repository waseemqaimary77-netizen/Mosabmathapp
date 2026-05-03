/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import MathSolver from './pages/MathSolver';
import QuizHub from './pages/QuizHub';
import Calculator from './pages/Calculator';
import StudySchedule from './pages/StudySchedule';
import Achievements from './pages/Achievements';
import FormulaSheet from './pages/FormulaSheet';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solve" element={<MathSolver />} />
            <Route path="/quiz" element={<QuizHub />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/schedule" element={<StudySchedule />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/formulas" element={<FormulaSheet />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

